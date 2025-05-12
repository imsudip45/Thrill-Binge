from django.contrib import admin
from .models import Genre, Movie, Person, MovieCast, MovieCrew, Video

# Register your models here.
admin.site.register(Genre)
admin.site.register(Movie)
admin.site.register(Person)
admin.site.register(MovieCast)
admin.site.register(MovieCrew)
admin.site.register(Video)
