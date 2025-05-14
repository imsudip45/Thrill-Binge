import os
import requests

TMDB_BASE_URL = "https://api.themoviedb.org/3"
TMDB_BEARER_TOKEN = os.environ.get('TMDB_BEARER_TOKEN')

def tmdb_get(endpoint, params=None):
    if params is None:
        params = {}
    url = f"{TMDB_BASE_URL}{endpoint}"
    headers = {
        "Authorization": f"Bearer {TMDB_BEARER_TOKEN}",
        "accept": "application/json"
    }
    response = requests.get(url, params=params, headers=headers, timeout=10)
    response.raise_for_status()
    return response.json()

def get_popular_movies(page=1):
    return tmdb_get("/movie/popular", params={"page": page})

def get_movie_details(tmdb_id):
    # Use append_to_response to get all needed data in a single API call
    return tmdb_get(f"/movie/{tmdb_id}", params={
        "append_to_response": "credits,videos"
    })

def get_movie_credits(tmdb_id):
    return tmdb_get(f"/movie/{tmdb_id}/credits")

def get_movie_videos(tmdb_id):
    return tmdb_get(f"/movie/{tmdb_id}/videos")

def get_genres():
    return tmdb_get("/genre/movie/list")

def get_movies_by_genre(genre_id, page=1):
    return tmdb_get("/discover/movie", params={"with_genres": genre_id, "page": page})

def search_movies(query, page=1, language=None, region=None):
    params = {"query": query, "page": page}
    if language:
        params["language"] = language
    if region:
        params["region"] = region
    return tmdb_get("/search/movie", params=params)

def get_now_playing_movies(page=1):
    return tmdb_get("/movie/now_playing", params={"page": page})

def get_upcoming_movies(page=1):
    return tmdb_get("/movie/upcoming", params={"page": page})

def get_top_rated_movies(page=1):
    return tmdb_get("/movie/top_rated", params={"page": page})

def import_movie_by_name(movie_name):
    """
    Search for a movie by name and return its full details including credits and videos.
    Returns None if no movie is found.
    """
    search_results = search_movies(movie_name)
    if not search_results.get('results'):
        return None
    
    # Get the first (most relevant) result
    movie = search_results['results'][0]
    movie_id = movie['id']
    
    # Get all movie details in a single API call
    details = get_movie_details(movie_id)
    return details
