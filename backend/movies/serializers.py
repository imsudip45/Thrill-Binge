from rest_framework import serializers
from .models import Genre, Movie, Person, MovieCast, MovieCrew, Video, Industry

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id', 'tmdb_id', 'name']

class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ['id', 'tmdb_id', 'name', 'profile_path']

class MovieCastSerializer(serializers.ModelSerializer):
    person = PersonSerializer()
    class Meta:
        model = MovieCast
        fields = ['id', 'person', 'character', 'order']

class MovieCrewSerializer(serializers.ModelSerializer):
    person = PersonSerializer()
    class Meta:
        model = MovieCrew
        fields = ['id', 'person', 'job', 'department']

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ['id', 'type', 'key', 'site', 'name']

class IndustrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Industry
        fields = ['id', 'name', 'description', 'slug']

class MovieSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True)
    cast = MovieCastSerializer(many=True, read_only=True)
    crew = MovieCrewSerializer(many=True, read_only=True)
    videos = VideoSerializer(many=True, read_only=True)
    industry = IndustrySerializer(read_only=True)
    autoembed_url = serializers.SerializerMethodField()

    class Meta:
        model = Movie
        fields = [
            'id', 'tmdb_id', 'title', 'overview', 'poster_path', 'backdrop_path',
            'release_date', 'popularity', 'rating', 'genres', 'cast', 'crew', 'videos', 'autoembed_url', 'industry'
        ]

    def get_autoembed_url(self, obj):
        if obj.tmdb_id:
            return f"https://player.autoembed.cc/embed/movie/{obj.tmdb_id}"
        return None
