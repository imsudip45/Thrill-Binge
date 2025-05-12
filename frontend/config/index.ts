// API Configuration
export const API_CONFIG = {
  // Base URLs for different environments
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  TMDB_IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
  
  // API Endpoints
  ENDPOINTS: {
    MOVIES: '/api/movies',
    SEARCH: '/api/movies/search',
  },
  
  // Image sizes
  IMAGE_SIZES: {
    POSTER: 'w500',
    BACKDROP: 'original',
    PROFILE: 'w185',
  },
};

// Function to build full API URL
export const buildApiUrl = (endpoint: string, queryParams?: Record<string, string>) => {
  const url = new URL(`${API_CONFIG.BASE_URL}${endpoint}`);
  
  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value) {
        url.searchParams.append(key, value);
      }
    });
  }
  
  return url.toString();
};

// Common request headers
export const DEFAULT_HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

// Common fetch options
export const DEFAULT_FETCH_OPTIONS: RequestInit = {
  headers: DEFAULT_HEADERS,
  credentials: 'include',
  mode: 'cors',
}; 