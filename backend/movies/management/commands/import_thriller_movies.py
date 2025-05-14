from django.core.management.base import BaseCommand
from movies.tmdb_service import (
    get_movies_by_genre, get_movie_details, get_movie_credits,
    get_movie_videos, search_movies
)
from movies.models import Movie, Industry, Person, MovieCast, MovieCrew, Video
import requests
from django.conf import settings

class Command(BaseCommand):
    help = 'Import top thriller movies from different industries'

    def add_arguments(self, parser):
        parser.add_argument('--pages', type=int, default=5, help='Number of pages to import per industry')

    def get_imdb_top_thrillers(self, industry_name, page=1):
        """Get top thriller movies from IMDB for specific industry"""
        if industry_name == 'Hollywood':
            # For Hollywood, use TMDB's thriller genre (53)
            return get_movies_by_genre(53, page=page)
        elif industry_name == 'Bollywood':
            # For Bollywood, search Hindi thriller movies
            return search_movies('thriller', page=page, region='IN')
        else:  # South Indian
            # For South Indian, search Tamil thriller movies
            # Simplify by focusing on Tamil to avoid API limitations
            return search_movies('thriller', page=page, region='IN')

    def get_dubbed_video(self, movie_id, original_language):
        """Get Hindi dubbed version of the movie if available"""
        videos = get_movie_videos(movie_id)
        for video in videos.get('results', []):
            if video.get('language') == 'hi' and video.get('type') == 'Trailer':
                return video
        return None

    def handle(self, *args, **options):
        pages = options['pages']
        industries = Industry.objects.all()
        
        # Track imported movies to prevent duplicates
        imported_movies = set()

        for industry in industries:
            self.stdout.write(f"Importing thriller movies for {industry.name}...")
            
            for page in range(1, pages + 1):
                data = self.get_imdb_top_thrillers(industry.name, page=page)
                movies = data.get('results', [])[:20]  # Get top 20 movies per page

                for movie_data in movies:
                    tmdb_id = movie_data['id']
                    
                    # Skip if we've already imported this movie
                    if tmdb_id in imported_movies:
                        continue
                    
                    imported_movies.add(tmdb_id)
                    
                    try:
                        # Get detailed movie info
                        details = get_movie_details(tmdb_id)
                        
                        # Create or update movie
                        movie, created = Movie.objects.update_or_create(
                            tmdb_id=tmdb_id,
                            defaults={
                                'title': movie_data['title'],
                                'overview': movie_data.get('overview', ''),
                                'poster_path': movie_data.get('poster_path', ''),
                                'backdrop_path': movie_data.get('backdrop_path', ''),
                                'release_date': movie_data.get('release_date') or None,
                                'popularity': movie_data.get('popularity', 0),
                                'rating': movie_data.get('vote_average', 0),
                                'industry': industry
                            }
                        )

                        # Add credits
                        credits = get_movie_credits(tmdb_id)
                        for cast in credits.get('cast', [])[:10]:
                            person, _ = Person.objects.get_or_create(
                                tmdb_id=cast['id'],
                                defaults={'name': cast['name'], 'profile_path': cast.get('profile_path', '')}
                            )
                            MovieCast.objects.update_or_create(
                                movie=movie, person=person,
                                defaults={'character': cast.get('character', ''), 'order': cast.get('order', 0)}
                            )

                        for crew in credits.get('crew', []):
                            person, _ = Person.objects.get_or_create(
                                tmdb_id=crew['id'],
                                defaults={'name': crew['name'], 'profile_path': crew.get('profile_path', '')}
                            )
                            MovieCrew.objects.update_or_create(
                                movie=movie, person=person,
                                defaults={'job': crew.get('job', ''), 'department': crew.get('department', '')}
                            )

                        # Add videos
                        videos = get_movie_videos(tmdb_id)
                        for video in videos.get('results', []):
                            Video.objects.update_or_create(
                                movie=movie,
                                key=video['key'],
                                defaults={
                                    'type': video.get('type', ''),
                                    'site': video.get('site', ''),
                                    'name': video.get('name', ''),
                                }
                            )

                        # For South Indian movies, add Hindi dubbed version if available
                        if industry.name == 'South Indian':
                            dubbed_video = self.get_dubbed_video(tmdb_id, details.get('original_language'))
                            if dubbed_video:
                                Video.objects.update_or_create(
                                    movie=movie,
                                    key=dubbed_video['key'],
                                    defaults={
                                        'type': dubbed_video.get('type', ''),
                                        'site': dubbed_video.get('site', ''),
                                        'name': f"{dubbed_video.get('name', '')} (Hindi Dubbed)",
                                    }
                                )

                        self.stdout.write(f"Successfully imported {movie.title}")

                    except Exception as e:
                        self.stderr.write(f"Error importing movie {movie_data.get('title')}: {str(e)}")

        self.stdout.write(self.style.SUCCESS('Successfully imported thriller movies for all industries!')) 