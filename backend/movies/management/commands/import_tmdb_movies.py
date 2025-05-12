from django.core.management.base import BaseCommand
from movies.tmdb_service import (
    get_popular_movies, get_movie_details, get_movie_credits, get_movie_videos, get_genres,
    get_movies_by_genre, search_movies, get_now_playing_movies, get_upcoming_movies, get_top_rated_movies
)
from movies.models import Movie, Genre, Person, MovieCast, MovieCrew, Video

class Command(BaseCommand):
    help = 'Import movies from TMDB by popularity, genre, search, or other endpoints'

    def add_arguments(self, parser):
        parser.add_argument('--method', type=str, default='popular',
                            help='Import method: popular, genre, search, now_playing, upcoming, top_rated')
        parser.add_argument('--pages', type=int, default=1, help='Number of pages to import')
        parser.add_argument('--genre_id', type=int, help='TMDB genre ID (required for genre method)')
        parser.add_argument('--query', type=str, help='Search query (required for search method)')

    def handle(self, *args, **options):
        # Import genres first
        tmdb_genres = get_genres().get('genres', [])
        for g in tmdb_genres:
            Genre.objects.update_or_create(tmdb_id=g['id'], defaults={'name': g['name']})

        method = options['method']
        pages = options['pages']
        genre_id = options.get('genre_id')
        query = options.get('query')

        if method == 'popular':
            fetch_func = get_popular_movies
            fetch_args = {}
        elif method == 'genre':
            if not genre_id:
                self.stderr.write(self.style.ERROR('You must provide --genre_id for genre import.'))
                return
            fetch_func = get_movies_by_genre
            fetch_args = {'genre_id': genre_id}
        elif method == 'search':
            if not query:
                self.stderr.write(self.style.ERROR('You must provide --query for search import.'))
                return
            fetch_func = search_movies
            fetch_args = {'query': query}
        elif method == 'now_playing':
            fetch_func = get_now_playing_movies
            fetch_args = {}
        elif method == 'upcoming':
            fetch_func = get_upcoming_movies
            fetch_args = {}
        elif method == 'top_rated':
            fetch_func = get_top_rated_movies
            fetch_args = {}
        else:
            self.stderr.write(self.style.ERROR('Unknown import method.'))
            return

        for page in range(1, pages + 1):
            fetch_args['page'] = page
            data = fetch_func(**fetch_args)
            movies = data.get('results', [])
            for idx, m in enumerate(movies):
                print(f"Processing movie: {m['title']}")
                movie, created = Movie.objects.update_or_create(
                    tmdb_id=m['id'],
                    defaults={
                        'title': m['title'],
                        'overview': m.get('overview', ''),
                        'poster_path': m.get('poster_path', ''),
                        'backdrop_path': m.get('backdrop_path', ''),
                        'release_date': m.get('release_date') or None,
                        'popularity': m.get('popularity', 0),
                        'rating': m.get('vote_average', 0),
                    }
                )
                # Set genres
                genre_ids = m.get('genre_ids', [])
                movie.genres.set(Genre.objects.filter(tmdb_id__in=genre_ids))

                # Fetch and add credits
                credits = get_movie_credits(m['id'])
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

                # Fetch and add videos
                videos = get_movie_videos(m['id'])
                for v in videos.get('results', []):
                    Video.objects.update_or_create(
                        movie=movie,
                        key=v['key'],
                        defaults={
                            'type': v.get('type', ''),
                            'site': v.get('site', ''),
                            'name': v.get('name', ''),
                        }
                    )

                print(f"Finished movie: {m['title']}")

        self.stdout.write(self.style.SUCCESS('Successfully imported movies from TMDB!'))
