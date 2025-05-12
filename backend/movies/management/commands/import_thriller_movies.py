from django.core.management.base import BaseCommand
from movies.tmdb_service import search_movies, get_movie_details, get_movie_credits, get_movie_videos
from movies.models import Movie, Genre, Person, MovieCast, MovieCrew, Video, Industry
from django.db import transaction
from datetime import datetime
import time

class Command(BaseCommand):
    help = 'Import thriller movies from 2020 onwards for all industries'

    def add_arguments(self, parser):
        parser.add_argument('--pages', type=int, default=3, help='Number of pages to import per industry')

    @transaction.atomic
    def import_movie_with_industry(self, movie_data, industry):
        try:
            # Get detailed movie info
            details = get_movie_details(movie_data['id'])
            if not details:
                return None

            # Skip if movie is before 2020
            release_date = details.get('release_date')
            if not release_date or datetime.strptime(release_date, '%Y-%m-%d').year < 2020:
                return None

            # Create or update movie using the new method
            movie, created = Movie.create_or_update(
                tmdb_id=details['id'],
                title=details['title'],
                overview=details.get('overview', ''),
                poster_path=details.get('poster_path', ''),
                backdrop_path=details.get('backdrop_path', ''),
                release_date=release_date,
                popularity=float(details.get('popularity', 0)),
                rating=float(details.get('vote_average', 0)),
                industry=industry
            )

            # Set genres
            genre_ids = [genre['id'] for genre in details.get('genres', [])]
            movie.genres.set(Genre.objects.filter(tmdb_id__in=genre_ids))

            # Get and set credits
            credits = get_movie_credits(details['id'])
            
            # Process cast (limit to top 10)
            MovieCast.objects.filter(movie=movie).delete()  # Clear existing cast
            for cast in credits.get('cast', [])[:10]:
                person, _ = Person.objects.get_or_create(
                    tmdb_id=cast['id'],
                    defaults={'name': cast['name'], 'profile_path': cast.get('profile_path', '')}
                )
                MovieCast.objects.create(
                    movie=movie,
                    person=person,
                    character=cast.get('character', ''),
                    order=cast.get('order', 0)
                )

            # Process key crew members
            MovieCrew.objects.filter(movie=movie).delete()  # Clear existing crew
            for crew in credits.get('crew', []):
                if crew['job'] in ['Director', 'Screenplay', 'Writer']:
                    person, _ = Person.objects.get_or_create(
                        tmdb_id=crew['id'],
                        defaults={'name': crew['name'], 'profile_path': crew.get('profile_path', '')}
                    )
                    MovieCrew.objects.create(
                        movie=movie,
                        person=person,
                        job=crew['job'],
                        department=crew.get('department', '')
                    )

            # Get and set videos
            Video.objects.filter(movie=movie).delete()  # Clear existing videos
            videos = get_movie_videos(details['id'])
            for video in videos.get('results', []):
                Video.objects.create(
                    movie=movie,
                    key=video['key'],
                    type=video.get('type', ''),
                    site=video.get('site', ''),
                    name=video.get('name', '')
                )

            return movie

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error processing movie {movie_data["title"]}: {str(e)}'))
            return None

    def handle(self, *args, **options):
        pages = options['pages']
        
        # Industry-specific search terms
        industry_configs = [
            {
                'name': 'Hollywood',
                'search_terms': ['thriller', 'psychological thriller', 'crime thriller'],
                'primary_release_year': '2020'
            },
            {
                'name': 'Bollywood',
                'search_terms': ['hindi thriller', 'bollywood thriller'],
                'primary_release_year': '2020'
            },
            {
                'name': 'South Indian',
                'search_terms': ['tamil thriller', 'telugu thriller', 'malayalam thriller', 'kannada thriller'],
                'primary_release_year': '2020'
            }
        ]

        total_imported = 0

        for config in industry_configs:
            try:
                industry = Industry.objects.get(name=config['name'])
                self.stdout.write(f"\nProcessing {config['name']} thrillers...")

                for search_term in config['search_terms']:
                    self.stdout.write(f"\nSearching for: {search_term}")
                    
                    for page in range(1, pages + 1):
                        self.stdout.write(f"Processing page {page}...")
                        
                        # Search for movies with primary_release_year parameter
                        results = search_movies(
                            query=f"{search_term} {config['primary_release_year']}",
                            page=page
                        )

                        if not results.get('results'):
                            break

                        for movie_data in results['results']:
                            movie = self.import_movie_with_industry(movie_data, industry)
                            if movie:
                                self.stdout.write(
                                    self.style.SUCCESS(f"Successfully imported: {movie.title}")
                                )
                                total_imported += 1
                            
                            # Add a small delay to avoid rate limiting
                            time.sleep(0.5)

            except Industry.DoesNotExist:
                self.stdout.write(
                    self.style.ERROR(f"Industry not found: {config['name']}")
                )
                continue
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f"Error processing {config['name']}: {str(e)}")
                )
                continue

        self.stdout.write(
            self.style.SUCCESS(f"\nFinished! Total thriller movies imported: {total_imported}")
        ) 