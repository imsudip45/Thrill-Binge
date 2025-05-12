"use client";

import { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { MovieCard } from '@/components/movie-card';
import { searchMovies } from '@/lib/api';
import { Movie } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSearchParams, useRouter } from 'next/navigation';

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const updateQueryParam = (newQuery: string) => {
    const params = new URLSearchParams(searchParams);
    if (newQuery) {
      params.set('q', newQuery);
    } else {
      params.delete('q');
    }
    router.replace(`/search?${params.toString()}`);
  };
  
  const handleSearch = async () => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearched(false);
      updateQueryParam('');
      return;
    }
    
    try {
      setLoading(true);
      setSearched(true);
      updateQueryParam(query);
      const results = await searchMovies(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const clearSearch = () => {
    setQuery('');
    setSearchResults([]);
    setSearched(false);
    updateQueryParam('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  // Search when query param changes
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      handleSearch();
    }
  }, []);
  
  return (
    <div className="pt-24 pb-10">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">
            Search Movies
          </h1>
          
          <div className="relative">
            <div className="flex">
              <div className="relative flex-grow">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Search for movies..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 pr-10 py-6 bg-gray-900 border-gray-700 text-white rounded-l-md focus-visible:ring-red-500"
                />
                {query && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
              <Button
                onClick={handleSearch}
                className="bg-red-600 hover:bg-red-700 text-white rounded-l-none px-6"
              >
                Search
              </Button>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-gray-800 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : searched ? (
          searchResults.length > 0 ? (
            <>
              <div className="mb-6">
                <h2 className="text-xl text-white font-medium">
                  {searchResults.length} results for "{query}"
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {searchResults.map(movie => (
                  <MovieCard key={movie.tmdb_id} movie={movie} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold text-white mb-2">No Results Found</h3>
              <p className="text-gray-400 mb-8">
                We couldn't find any movies matching "{query}".
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Button onClick={clearSearch} className="bg-gray-800 hover:bg-gray-700 text-white">
                  Clear Search
                </Button>
                <Button onClick={() => router.push('/movies')} className="bg-red-600 hover:bg-red-700 text-white">
                  Browse All Movies
                </Button>
              </div>
            </div>
          )
        ) : (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold text-white mb-2">Discover Movies</h3>
            <p className="text-gray-400 mb-4">
              Search for your favorite movies by title, actor, or genre.
            </p>
            
            <div className="mt-8 mb-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <div className="bg-gray-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <SearchIcon className="h-8 w-8 text-red-500" />
                </div>
                <h4 className="text-white font-semibold mb-2">Search by Title</h4>
                <p className="text-gray-400 text-sm">Find movies by their full or partial title</p>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <div className="bg-gray-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h4 className="text-white font-semibold mb-2">Search by Actor</h4>
                <p className="text-gray-400 text-sm">Find movies featuring your favorite actors</p>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <div className="bg-gray-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h4 className="text-white font-semibold mb-2">Search by Genre</h4>
                <p className="text-gray-400 text-sm">Discover movies by genre like action, comedy, drama</p>
              </div>
            </div>
            
            <div className="mt-8">
              <p className="text-gray-300 mb-4">Try searching for:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {["Inception", "Marvel", "Tom Cruise", "Action", "Comedy", "2023"].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setQuery(suggestion);
                      setTimeout(() => handleSearch(), 0);
                    }}
                    className="bg-gray-800 hover:bg-gray-700 text-white rounded-full px-4 py-2 text-sm transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}