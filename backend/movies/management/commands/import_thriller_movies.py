from django.core.management.base import BaseCommand
from movies.tmdb_service import import_movie_by_name
from movies.models import Movie, Person, MovieCast, MovieCrew, Video, Industry
from django.db import transaction
import time

class Command(BaseCommand):
    help = 'Import curated list of suspense thriller movies from all three industries'

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("Starting import of suspense thriller movies..."))
        
        # Create industries if they don't exist
        industries = {
            "Hollywood": "American film industry based in Hollywood, California",
            "Bollywood": "Hindi-language film industry based in Mumbai, India",
            "South Indian": "Film industries of South Indian languages including Tamil, Telugu, Malayalam, and Kannada"
        }
        
        for name, description in industries.items():
            Industry.objects.get_or_create(
                name=name,
                defaults={"description": description}
            )
        
        # Lists of suspense thriller movies by industry
        movies_by_industry = {
            "Hollywood": [
                "The Silence of the Lambs", "Se7en", "Prisoners", "Gone Girl",
                "Zodiac", "The Departed", "Shutter Island", "The Prestige",
                "Memento", "No Country for Old Men", "Parasite", "Fight Club",
                "The Usual Suspects", "The Sixth Sense", "The Game",
                "Cape Fear", "Black Swan", "Misery", "Nightcrawler", "Get Out",
                "Oldboy", "The Others", "Mulholland Drive", "Rear Window",
                "The Lighthouse", "Psycho", "The Shining", "Disturbia", 
                "Wind River", "Sicario"
            ],
            "Bollywood": [
                "Andhadhun", "Kahaani", "Drishyam", "Talvar", "Badla",
                "A Wednesday", "Ugly", "Mom", "NH10", "Special 26",
                "Talaash", "Raat Akeli Hai", "Detective Byomkesh Bakshy!", "Manorama Six Feet Under",
                "Johnny Gaddaar", "Ittefaq", "Wazir", "Trapped", "Ek Hasina Thi",
                "Gupt", "Karthik Calling Karthik", "Raazi", "Raman Raghav 2.0", "Te3n",
                "Table No.21", "Kaun", "Samay: When Time Strikes", "404: Error Not Found",
                "Gumnaam", "Khakee"
            ],
            "South Indian": [
                "Drishyam", "Vikram Vedha", "Super Deluxe", "Ratsasan", "Visaranai",
                "Awe!", "Lucia", "U Turn", "Thani Oruvan", "Karthikeya",
                "Anjaam Pathiraa", "Forensic", "Evaru", "Agent Sai Srinivasa Athreya", "Game Over",
                "7th Day", "Kavaludaari", "Yavarum Nalam", "Dhuruvangal Pathinaaru", "Thegidi",
                "Kuttrame Thandanai", "Kshanam", "Memories", "Adanga Maru", "C U Soon",
                "Maanagaram", "Aandavan Kattalai", "Hit: The First Case", "Penguin", "Aa Naluguru"
            ]
        }
        
        # Import movies by industry
        total_imported = 0
        
        for industry_name, movie_list in movies_by_industry.items():
            self.stdout.write(self.style.SUCCESS(f"\n===== Importing {industry_name} Suspense Thriller Movies ====="))
            industry = Industry.objects.get(name=industry_name)
            
            for i, movie_name in enumerate(movie_list, 1):
                self.stdout.write(f"[{i}/{len(movie_list)}] 🔍 Searching for movie: {movie_name}")
                
                try:
                    movie_data = import_movie_by_name(movie_name)
                    if not movie_data:
                        self.stdout.write(self.style.ERROR(f"❌ No movie found with name: {movie_name}"))
                        continue
                    
                    rating = float(movie_data.get('vote_average', 0))
                    self.stdout.write(f"📝 Creating/updating movie: {movie_data['title']} (Rating: {rating}/10)")
                    
                    # Create or update the movie
                    movie, created = Movie.create_or_update(
                        tmdb_id=movie_data['id'],
                        title=movie_data['title'],
                        overview=movie_data.get('overview', ''),
                        poster_path=movie_data.get('poster_path', ''),
                        backdrop_path=movie_data.get('backdrop_path', ''),
                        release_date=movie_data.get('release_date'),
                        popularity=float(movie_data.get('popularity', 0)),
                        rating=rating,
                        industry=industry
                    )
                    
                    # Clear existing related data
                    MovieCast.objects.filter(movie=movie).delete()
                    MovieCrew.objects.filter(movie=movie).delete()
                    Video.objects.filter(movie=movie).delete()
                    
                    # Process cast
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
                        self.style.SUCCESS(f"✅ Successfully {status} movie: {movie.title} (Rating: {rating}/10)")
                    )
                    total_imported += 1
                    
                    # Sleep briefly to avoid rate limiting
                    time.sleep(1)
                    
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f"❌ Error importing {movie_name}: {str(e)}"))
        
        self.stdout.write(self.style.SUCCESS(f"\n===================="))
        self.stdout.write(self.style.SUCCESS(f"✅ Import complete! Total thriller movies imported/updated: {total_imported}"))
        self.stdout.write(self.style.SUCCESS(f"===================="))