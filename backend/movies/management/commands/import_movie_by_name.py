from django.core.management.base import BaseCommand
from movies.tmdb_service import import_movie_by_name
from movies.models import Movie, Person, MovieCast, MovieCrew, Video, Industry
from django.db import transaction

class Command(BaseCommand):
    help = 'Import a specific movie by name from TMDB'

    def add_arguments(self, parser):
        parser.add_argument('movie_name', type=str, help='Name of the movie to import')
        parser.add_argument('--industry', type=str, choices=['Hollywood', 'Bollywood', 'South Indian'],
                          help='Specify the movie industry')

    @transaction.atomic
    def handle(self, *args, **options):
        movie_name = options['movie_name']
        industry_name = options['industry']
        
        self.stdout.write(f"🔍 Searching for movie: {movie_name}")
        
        movie_data = import_movie_by_name(movie_name)
        if not movie_data:
            self.stdout.write(self.style.ERROR(f"❌ No movie found with name: {movie_name}"))
            return

        # Get or create industry if specified
        industry = None
        if industry_name:
            try:
                industry = Industry.objects.get(name=industry_name)
            except Industry.DoesNotExist:
                self.stdout.write(self.style.ERROR(f"❌ Industry not found: {industry_name}"))
                return
        
        self.stdout.write(f"📝 Creating/updating movie: {movie_data['title']}")
        
        # Create or update the movie using the new method
        movie, created = Movie.create_or_update(
            tmdb_id=movie_data['id'],
            title=movie_data['title'],
            overview=movie_data.get('overview', ''),
            poster_path=movie_data.get('poster_path', ''),
            backdrop_path=movie_data.get('backdrop_path', ''),
            release_date=movie_data.get('release_date'),
            popularity=float(movie_data.get('popularity', 0)),
            rating=float(movie_data.get('vote_average', 0)),
            industry=industry
        )

        # Set genres
        self.stdout.write("📋 Processing genres...")
        genre_ids = [genre['id'] for genre in movie_data.get('genres', [])]
        movie.genres.set(Genre.objects.filter(tmdb_id__in=genre_ids))

        # Clear existing related data
        MovieCast.objects.filter(movie=movie).delete()
        MovieCrew.objects.filter(movie=movie).delete()
        Video.objects.filter(movie=movie).delete()

        # Process cast
        self.stdout.write("👥 Processing cast members...")
        for cast in movie_data['credits'].get('cast', [])[:10]:
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

        # Process crew
        self.stdout.write("👥 Processing crew members...")
        for crew in movie_data['credits'].get('crew', []):
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

        # Process videos
        self.stdout.write("🎬 Processing videos...")
        for video in movie_data['videos'].get('results', []):
            Video.objects.create(
                movie=movie,
                key=video['key'],
                name=video['name'],
                site=video['site'],
                type=video['type']
            )

        status = 'created' if created else 'updated'
        self.stdout.write(
            self.style.SUCCESS(f"✅ Successfully {status} movie: {movie.title}")
        ) 