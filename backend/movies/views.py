from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from django.db.models import Q
from .models import Movie, Industry
from .serializers import MovieSerializer

# Create your views here.

class MovieListAPIView(generics.ListAPIView):
    serializer_class = MovieSerializer

    def get_queryset(self):
        queryset = Movie.objects.all().prefetch_related(
            'cast', 'crew', 'videos'
        ).select_related('industry')

        # Industry filter
        industry = self.request.query_params.get('industry', None)
        if industry:
            queryset = queryset.filter(industry__name__iexact=industry)

        # Year filter
        year = self.request.query_params.get('year', None)
        if year:
            if '-' in year:  # Range like 2010-2019
                start_year, end_year = year.split('-')
                queryset = queryset.filter(
                    release_date__year__gte=start_year,
                    release_date__year__lte=end_year
                )
            else:
                queryset = queryset.filter(release_date__year=year)

        # Minimum rating filter
        min_rating = self.request.query_params.get('min_rating', None)
        if min_rating:
            queryset = queryset.filter(rating__gte=float(min_rating))

        # Sort
        sort = self.request.query_params.get('sort', 'popularity')
        sort_mapping = {
            'popularity': '-popularity',
            'rating': '-rating',
            'release_date': '-release_date',
            'title': 'title',
            'top_rated': ('-rating', '-popularity', '-release_date'),  # Sort by rating, then popularity, then newest
        }
        
        sort_field = sort_mapping.get(sort, '-popularity')
        if isinstance(sort_field, tuple):
            queryset = queryset.order_by(*sort_field)
        else:
            queryset = queryset.order_by(sort_field)

        # Limit results if specified
        limit = self.request.query_params.get('limit', None)
        if limit:
            queryset = queryset[:int(limit)]

        return queryset

class MovieDetailAPIView(generics.RetrieveAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    lookup_field = 'tmdb_id'

class IndustryMoviesAPIView(generics.ListAPIView):
    serializer_class = MovieSerializer

    def get_queryset(self):
        industry_name = self.kwargs.get('industry_name')
        return Movie.objects.filter(
            industry__name__iexact=industry_name
        ).prefetch_related(
            'cast', 'crew', 'videos'
        ).select_related('industry')
