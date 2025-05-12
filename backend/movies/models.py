from django.db import models
from django.utils.text import slugify

# Create your models here.

class Genre(models.Model):
    tmdb_id = models.IntegerField(unique=True)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Industry(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    slug = models.SlugField(unique=True)

    class Meta:
        verbose_name_plural = "Industries"

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

class Movie(models.Model):
    tmdb_id = models.IntegerField(unique=True, db_index=True)
    title = models.CharField(max_length=255)
    overview = models.TextField(blank=True)
    poster_path = models.CharField(max_length=255, blank=True, null=True)
    backdrop_path = models.CharField(max_length=255, blank=True, null=True)
    release_date = models.DateField(null=True, blank=True)
    popularity = models.FloatField(default=0)
    rating = models.FloatField(default=0)
    genres = models.ManyToManyField(Genre, related_name='movies')
    industry = models.ForeignKey(Industry, on_delete=models.SET_NULL, null=True, related_name='movies')

    class Meta:
        indexes = [
            models.Index(fields=['tmdb_id']),
            models.Index(fields=['title', 'release_date']),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=['tmdb_id'],
                name='unique_tmdb_id'
            )
        ]

    def __str__(self):
        return self.title

    @classmethod
    def create_or_update(cls, tmdb_id, **data):
        """
        Create or update a movie with proper duplicate prevention
        """
        movie, created = cls.objects.get_or_create(
            tmdb_id=tmdb_id,
            defaults=data
        )
        if not created:
            # Update existing movie with new data
            for key, value in data.items():
                setattr(movie, key, value)
            movie.save()
        return movie, created

class Person(models.Model):
    tmdb_id = models.IntegerField(unique=True)
    name = models.CharField(max_length=255)
    profile_path = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.name

    def delete_if_unused(self):
        # Check if person has any associated movies through cast or crew
        if not self.moviecast_set.exists() and not self.moviecrew_set.exists():
            self.delete()

class MovieCast(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='cast')
    person = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='moviecast_set')
    character = models.CharField(max_length=255, blank=True)
    order = models.IntegerField(default=0)

    def delete(self, *args, **kwargs):
        person = self.person
        super().delete(*args, **kwargs)
        person.delete_if_unused()

class MovieCrew(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='crew')
    person = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='moviecrew_set')
    job = models.CharField(max_length=255)
    department = models.CharField(max_length=255, blank=True)

    def delete(self, *args, **kwargs):
        person = self.person
        super().delete(*args, **kwargs)
        person.delete_if_unused()

class Video(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='videos')
    type = models.CharField(max_length=50)
    key = models.CharField(max_length=255)
    site = models.CharField(max_length=50)
    name = models.CharField(max_length=255)
