import { Movie, ApiResponse } from './types';
import { API_CONFIG, buildApiUrl, DEFAULT_FETCH_OPTIONS, DEFAULT_HEADERS } from '@/config';

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const getImageUrl = (path: string | null, size: string = API_CONFIG.IMAGE_SIZES.POSTER): string => {
  if (!path) return '/placeholder-poster.svg';
  return `${API_CONFIG.TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

export const getPosterUrl = (path: string | null): string => 
  getImageUrl(path, API_CONFIG.IMAGE_SIZES.POSTER);

export const getBackdropUrl = (path: string | null): string => 
  getImageUrl(path, API_CONFIG.IMAGE_SIZES.BACKDROP);

export const getProfileUrl = (path: string | null): string => 
  getImageUrl(path, API_CONFIG.IMAGE_SIZES.PROFILE);

export const getYoutubeEmbedUrl = (key: string): string => 
  `https://www.youtube.com/embed/${key}`;

export async function fetchMovies(endpoint: string): Promise<Movie[]> {
  // Check if we're in the build process
  if (process.env.IS_BUILD === 'true' || process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
    console.log('Build mode detected - returning mock data for endpoint:', endpoint);
    // Return empty array during build
    return [];
  }

  try {
    const url = buildApiUrl(endpoint);
    console.log('Fetching movies from:', url);
    
    const response = await fetch(url, {
      ...DEFAULT_FETCH_OPTIONS,
      headers: {
        ...DEFAULT_HEADERS,
        'Accept': 'application/json',
      },
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error response:', errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('API response data:', data);
    return data.results || data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
}

export async function fetchMovie(id: number | string): Promise<Movie | null> {
  // Check if we're in the build process
  if (process.env.IS_BUILD === 'true' || process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
    console.log('Build mode detected - returning mock data for movie ID:', id);
    // Return minimal mock data to allow build to complete
    return {
      id: typeof id === 'string' ? parseInt(id, 10) : id,
      tmdb_id: 0,
      title: 'Movie Title',
      overview: 'This is a placeholder overview used during build time.',
      poster_path: '',
      backdrop_path: '',
      release_date: '2023-01-01',
      popularity: 0,
      rating: 0,
      genres: [],
      cast: [],
      crew: [],
      videos: [],
      autoembed_url: ''
    };
  }

  try {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.MOVIES}/${id}`);
    const response = await fetch(url, DEFAULT_FETCH_OPTIONS);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching movie ${id}:`, error);
    return null;
  }
}

export async function searchMovies(query: string): Promise<Movie[]> {
  if (!query.trim()) return [];
  
  // Check if we're in the build process
  if (process.env.IS_BUILD === 'true' || process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
    console.log('Build mode detected - returning mock data for search query:', query);
    // Return empty array during build
    return [];
  }
  
  try {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.MOVIES, { search: query });
    const response = await fetch(url, DEFAULT_FETCH_OPTIONS);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
}