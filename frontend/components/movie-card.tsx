"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Info } from 'lucide-react';
import { Movie, Video } from '@/lib/types';
import { getPosterUrl } from '@/lib/api';
import { GenreTag } from './genre-tag';
import { cn } from '@/lib/utils';
import { MoviePlayerModal } from './movie-player-modal';

interface MovieCardProps {
  movie: Movie;
  className?: string;
  featured?: boolean;
}

export function MovieCard({ movie, className, featured = false }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [activeTrailer, setActiveTrailer] = useState<Video | null>(null);
  const posterUrl = movie.poster_path ? getPosterUrl(movie.poster_path) : '/placeholder-poster.svg';
  const releaseYear = new Date(movie.release_date).getFullYear();
  
  // Get the first 3 genres only
  const displayGenres = movie.genres?.slice(0, 3) || [];

  useEffect(() => {
    if (movie?.videos && movie.videos.length > 0) {
      const trailer = movie.videos.find(v => v.type.toLowerCase() === 'trailer' && v.site.toLowerCase() === 'youtube');
      if (trailer) {
        setActiveTrailer(trailer);
      }
    }
  }, [movie]);

  const handleWatchNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (movie.autoembed_url || activeTrailer) {
      setIsPlayerOpen(true);
    }
  };

  const handleMoreInfo = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  return (
    <>
      <div 
        className={cn(
          "group relative overflow-hidden rounded-lg transition-transform duration-300",
          featured ? "md:h-[500px] aspect-[2/3]" : "h-[350px] md:h-[400px]",
          isHovered && "scale-[1.03] shadow-xl z-10",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Poster Image */}
        <div className="absolute inset-0 w-full h-full bg-gray-900">
          <Image 
            src={posterUrl} 
            alt={movie.title}
            fill
            sizes={featured ? "(max-width: 768px) 100vw, 33vw" : "(max-width: 768px) 100vw, 25vw"}
            className={cn(
              "object-cover transition-all duration-300",
              isHovered ? "brightness-30 scale-110" : "brightness-90"
            )}
            priority={featured}
          />
        </div>
        
        {/* Hover overlay with details */}
        <div 
          className={cn(
            "absolute inset-0 flex flex-col justify-end p-4 transition-all duration-300",
            isHovered ? "opacity-100 visible" : "opacity-0 invisible md:invisible",
            "bg-gradient-to-t from-black via-black/80 to-transparent"
          )}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-yellow-500">★ {movie.rating.toFixed(1)}</span>
            <span className="text-gray-300 text-sm">{releaseYear}</span>
          </div>
          
          <h3 className="text-white font-semibold text-lg line-clamp-2 mb-2">
            {movie.title}
          </h3>
          
          <p className="text-gray-300 text-sm line-clamp-2 mb-3">
            {movie.overview}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {displayGenres.map(genre => (
              <GenreTag key={genre.id} genre={genre} />
            ))}
          </div>
          
          <div className="flex gap-2 relative z-20">
            <button 
              type="button"
              onClick={handleWatchNow}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md flex items-center justify-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!movie.autoembed_url && !activeTrailer}
            >
              <Play className="h-4 w-4" />
              <span>Watch</span>
            </button>
            
            <Link 
              href={`/movies/${movie.tmdb_id}`} 
              onClick={handleMoreInfo}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-md flex items-center justify-center gap-1 transition-colors z-10"
            >
              <Info className="h-4 w-4" />
              <span>Details</span>
            </Link>
          </div>
        </div>
        
        {/* Default view for mobile or non-hovered state */}
        <div className={cn(
          "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3",
          "opacity-100 md:group-hover:opacity-0 transition-opacity duration-300"
        )}>
          <h3 className="text-white font-medium line-clamp-1">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-yellow-500">★ {movie.rating.toFixed(1)}</span>
            <span className="text-gray-300">{releaseYear}</span>
          </div>
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
    </>
  );
}