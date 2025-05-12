import { fetchMovie } from '@/lib/api';
import MovieDetailsClient from './MovieDetailsClient';

export default async function MovieDetailsPage({ params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const movie = await fetchMovie(id);

    if (!movie) {
      return (
        <div className="pt-24 text-center py-12">
          <h1 className="text-2xl font-semibold text-white mb-4">Movie Not Found</h1>
          <p className="text-gray-400 mb-6">The movie you're looking for doesn't exist or has been removed.</p>
        </div>
      );
    }

    return <MovieDetailsClient movie={movie} />;
  } catch (error) {
    console.error('Error fetching movie:', error);
    return (
      <div className="pt-24 text-center py-12">
        <h1 className="text-2xl font-semibold text-white mb-4">Error</h1>
        <p className="text-gray-400 mb-6">An error occurred while fetching the movie details.</p>
      </div>
    );
  }
}

export async function generateStaticParams() {
  const res = await fetch('http://localhost:8000/api/movies/');
  const movies = await res.json();
  return movies.map((movie: { tmdb_id: number }) => ({
    id: movie.tmdb_id.toString(),
  }));
}