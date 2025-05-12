"use client";

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { MovieCard } from './movie-card';
import { fetchMovies } from '@/lib/api';
import { Movie } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MovieCarouselProps {
  title: string;
  endpoint: string;
  className?: string;
  description?: string;
}

export function MovieCarousel({ title, endpoint, className, description }: MovieCarouselProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadMovies() {
      try {
        setLoading(true);
        const data = await fetchMovies(endpoint);
        setMovies(data);
      } catch (error) {
        console.error(`Error loading movies for carousel ${title}:`, error);
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, [endpoint, title]);

  const scrollToIndex = (index: number) => {
    if (carouselRef.current && movies.length > 0) {
      const itemWidth = carouselRef.current.scrollWidth / movies.length;
      carouselRef.current.scrollTo({
        left: index * itemWidth,
        behavior: 'smooth'
      });
      setCurrentIndex(index);
    }
  };

  const scrollNext = () => {
    const nextIndex = Math.min(currentIndex + 4, movies.length - 1);
    scrollToIndex(nextIndex);
  };

  const scrollPrev = () => {
    const prevIndex = Math.max(currentIndex - 4, 0);
    scrollToIndex(prevIndex);
  };

  if (loading) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex justify-between items-baseline mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">{title}</h2>
            {description && (
              <p className="text-sm text-gray-400 mt-1">{description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-800 animate-pulse"></div>
            <div className="w-8 h-8 rounded-full bg-gray-800 animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-gray-800 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-4 relative group", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">{title}</h2>
          {description && (
            <p className="text-sm text-gray-400 mt-1">{description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={scrollPrev}
            className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            disabled={currentIndex === 0}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button 
            onClick={scrollNext}
            className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            disabled={currentIndex >= movies.length - 5}
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div 
        className="overflow-x-scroll scrollbar-hide relative" 
        ref={carouselRef}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex gap-4 pb-4">
          {movies.map((movie) => (
            <div key={movie.tmdb_id} className="flex-none w-[220px] md:w-[240px]">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>

      {/* Control buttons that overlay on the sides */}
      <button 
        onClick={scrollPrev}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
        disabled={currentIndex === 0}
      >
        <ArrowLeft className="h-6 w-6" />
      </button>
      <button 
        onClick={scrollNext}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
        disabled={currentIndex >= movies.length - 5}
      >
        <ArrowRight className="h-6 w-6" />
      </button>
    </div>
  );
}