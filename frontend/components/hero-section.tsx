"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchMovies, getBackdropUrl } from '@/lib/api';
import { Movie, Video } from '@/lib/types';
import { MoviePlayerModal } from '@/components/movie-player-modal';

export function HeroSection() {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [activeTrailer, setActiveTrailer] = useState<Video | null>(null);

  useEffect(() => {
    async function loadFeaturedMovie() {
      try {
        setLoading(true);
        // Get the highest rated movie with good popularity
        const movies = await fetchMovies('/api/movies/?sort=top_rated&min_rating=8&limit=1');
        if (movies && movies.length > 0) {
          const selectedMovie = movies[0]; // Get the first movie (highest rated)
          setFeaturedMovie(selectedMovie);
          
          // Set active trailer if available
          if (selectedMovie?.videos && selectedMovie.videos.length > 0) {
            const trailer = selectedMovie.videos.find(
              v => v.type.toLowerCase() === 'trailer' && v.site.toLowerCase() === 'youtube'
            );
            if (trailer) {
              setActiveTrailer(trailer);
            }
          }
        }
      } catch (error) {
        console.error('Error loading featured movie:', error);
      } finally {
        setLoading(false);
      }
    }

    loadFeaturedMovie();
  }, []);

  const handleWatchNow = (e: React.MouseEvent) => {
    e.preventDefault();
    if (featuredMovie?.autoembed_url || activeTrailer) {
      setIsPlayerOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[80vh] bg-gray-900 animate-pulse">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="w-1/2">
            <div className="h-10 w-3/4 bg-gray-800 rounded-md mb-4"></div>
            <div className="h-24 w-full bg-gray-800 rounded-md mb-6"></div>
            <div className="h-10 w-1/3 bg-gray-800 rounded-md"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!featuredMovie) {
    // Fallback hero with placeholder
    return (
      <div className="w-full h-[80vh] relative bg-gradient-to-b from-transparent to-black">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <div className="relative z-20 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">Welcome to ThrillBinge</h1>
            <p className="text-xl text-gray-300 mb-8">Discover the best movies and TV shows all in one place.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                Browse Movies
              </Button>
              <Button variant="outline" className="text-white border-white hover:bg-white/10">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const backdropUrl = getBackdropUrl(featuredMovie.backdrop_path);
  const releaseYear = new Date(featuredMovie.release_date).getFullYear();

  return (
    <div className="w-full h-[90vh] relative overflow-hidden">
      {/* Backdrop Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image 
          src={backdropUrl} 
          alt={featuredMovie.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="max-w-2xl">
          <div className="mb-6 flex items-center gap-3">
            <span className="bg-red-600 text-white px-2 py-1 text-sm font-semibold rounded">Featured</span>
            <span className="text-gray-300">{releaseYear}</span>
            <span className="text-yellow-500 flex items-center">
              ★ {featuredMovie.rating.toFixed(1)}
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
            {featuredMovie.title}
          </h1>
          
          <p className="text-gray-300 text-lg mb-8 line-clamp-3">
            {featuredMovie.overview}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
              size="lg"
              onClick={handleWatchNow}
              disabled={!featuredMovie?.autoembed_url && !activeTrailer}
            >
              <Play className="h-5 w-5" />
              Watch Now
            </Button>
            
            <Link href={`/movies/${featuredMovie.tmdb_id}`}>
              <Button 
                variant="outline" 
                className="text-white border-white hover:bg-white/10 flex items-center gap-2"
                size="lg"
              >
                <Info className="h-5 w-5" />
                More Info
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Movie Player Modal */}
      <MoviePlayerModal
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        videoKey={activeTrailer?.key}
        autoembedUrl={featuredMovie?.autoembed_url}
        movieTitle={featuredMovie?.title || ''}
      />
    </div>
  );
}