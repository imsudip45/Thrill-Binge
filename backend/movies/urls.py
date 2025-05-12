from django.urls import path
from .views import MovieListAPIView, MovieDetailAPIView, IndustryMoviesAPIView

urlpatterns = [
    path('', MovieListAPIView.as_view(), name='movie-list'),
    path('<int:tmdb_id>/', MovieDetailAPIView.as_view(), name='movie-detail'),
    path('industry/<str:industry_name>/', IndustryMoviesAPIView.as_view(), name='industry-movies'),
]
