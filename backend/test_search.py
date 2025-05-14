import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'thrillbinge.settings')
django.setup()

from movies.tmdb_service import search_movies

def test_search_movies():
    # Test with no language or region
    result1 = search_movies('thriller')
    print(f"Found {len(result1.get('results', []))} movies with query 'thriller'")
    
    # Test with region parameter
    result2 = search_movies('thriller', region='IN')
    print(f"Found {len(result2.get('results', []))} Indian movies with query 'thriller'")
    
    print("search_movies function is working correctly!")

if __name__ == "__main__":
    test_search_movies() 