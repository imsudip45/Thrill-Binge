export interface Movie {
  id: number;
  tmdb_id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  popularity: number;
  rating: number;
  genres: Genre[];
  cast?: CastMember[];
  crew?: CrewMember[];
  videos?: Video[];
  autoembed_url?: string;
}

export interface Genre {
  id: number;
  tmdb_id: number;
  name: string;
}

export interface Person {
  id: number;
  name: string;
  profile_path: string | null;
}

export interface CastMember {
  person: Person;
  character: string;
  order: number;
}

export interface CrewMember {
  person: Person;
  job: string;
  department: string;
}

export interface Video {
  type: string;
  key: string;
  site: string;
  name: string;
}

export interface ApiResponse<T> {
  results: T[];
  page: number;
  total_pages: number;
  total_results: number;
}