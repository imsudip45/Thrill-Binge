from django.core.management.base import BaseCommand
from movies.models import Movie, Person, MovieCast, MovieCrew, Video

class Command(BaseCommand):
    help = 'Clean the database by removing all movies and related data'

    def handle(self, *args, **options):
        # Delete all related data first
        self.stdout.write('Deleting all videos...')
        Video.objects.all().delete()
        
        self.stdout.write('Deleting all movie cast entries...')
        MovieCast.objects.all().delete()
        
        self.stdout.write('Deleting all movie crew entries...')
        MovieCrew.objects.all().delete()
        
        self.stdout.write('Deleting all movies...')
        Movie.objects.all().delete()
        
        self.stdout.write('Deleting all persons...')
        Person.objects.all().delete()
        
        self.stdout.write(self.style.SUCCESS('Successfully cleaned the database!')) 