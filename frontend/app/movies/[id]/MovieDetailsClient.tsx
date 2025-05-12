"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Play, Star, Calendar, Clock, ChevronLeft } from 'lucide-react';
import { getBackdropUrl, getPosterUrl, getProfileUrl } from '@/lib/api';
import { Movie, Video } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { GenreTag } from '@/components/genre-tag';
import { MovieCarousel } from '@/components/movie-carousel';
import { MoviePlayerModal } from '@/components/movie-player-modal';
import Link from 'next/link';

export default function MovieDetailsClient({ movie }: { movie: Movie }) {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [activeTrailer, setActiveTrailer] = useState<Video | null>(null);

  useEffect(() => {
    if (movie?.videos && movie.videos.length > 0) {
      const trailer = movie.videos.find(v => v.type.toLowerCase() === 'trailer' && v.site.toLowerCase() === 'youtube');
      if (trailer) {
        setActiveTrailer(trailer);
      }
    }
  }, [movie]);

  const backdropUrl = getBackdropUrl(movie.backdrop_path);
  const posterUrl = getPosterUrl(movie.poster_path);
  const releaseYear = new Date(movie.release_date).getFullYear();

  const handleWatchNow = () => {
    setIsPlayerOpen(true);
  };

  return (
    <div className="pt-16">
      {/* Backdrop */}
      <div className="relative w-full h-[60vh] overflow-hidden">
        <Image 
          src={backdropUrl} 
          alt={movie.title}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Movie Poster */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-2xl">
              <Image 
                src={posterUrl} 
                alt={movie.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </div>
          </div>
          
          {/* Movie Details */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <Link href="/movies" className="text-gray-400 hover:text-white flex items-center gap-1">
                <ChevronLeft className="h-4 w-4" />
                Back to Movies
              </Link>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
              {movie.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-300 mb-6">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>{movie.rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>{releaseYear}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-gray-400" />
                <span>125 min</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres?.map(genre => (
                <GenreTag key={genre.id} genre={genre} />
              ))}
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-2">Overview</h2>
              <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
            </div>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                onClick={handleWatchNow}
                disabled={!movie.autoembed_url && !activeTrailer}
              >
                <Play className="h-5 w-5" />
                Watch Now
              </Button>
            </div>
            
            {/* Cast Section */}
            {movie.cast && movie.cast.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Cast</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {movie.cast.slice(0, 10).map((castMember) => (
                    <div key={`${castMember.person.id}-${castMember.character}`} className="bg-gray-800 rounded-lg overflow-hidden group">
                      <div className="aspect-[2/3] relative overflow-hidden">
                        <Image 
                          src={castMember.person.profile_path ? getProfileUrl(castMember.person.profile_path) : '/placeholder-person.jpg'} 
                          alt={castMember.person.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                          sizes="(max-width: 768px) 50vw, 20vw"
                        />
                      </div>
                      <div className="p-2">
                        <h4 className="font-medium text-white text-sm truncate">{castMember.person.name}</h4>
                        <p className="text-gray-400 text-xs truncate">{castMember.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Similar Movies */}
        <div className="mt-16">
          <MovieCarousel 
            title="Similar Movies" 
            endpoint={`/api/movies/?similar=${movie.tmdb_id}`} 
          />
        </div>
      </div>

      {/* Movie Player Modal */}
      <MoviePlayerModal
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        videoKey={activeTrailer?.key}
        autoembedUrl={movie.autoembed_url}
        movieTitle={movie.title}
      />
    </div>
  );
} 