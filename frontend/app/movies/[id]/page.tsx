import { fetchMovie } from '@/lib/api';
import MovieDetailsClient from './MovieDetailsClient';

// Mark this page as dynamically rendered at request time, not build time
export const dynamic = 'force-dynamic';

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