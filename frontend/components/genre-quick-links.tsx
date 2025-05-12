"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const GENRES = [
  { id: 1, name: "Action" },
  { id: 2, name: "Adventure" },
  { id: 3, name: "Animation" },
  { id: 4, name: "Comedy" },
  { id: 5, name: "Crime" },
  { id: 6, name: "Documentary" },
  { id: 7, name: "Drama" },
  { id: 8, name: "Family" },
  { id: 9, name: "Fantasy" },
  { id: 10, name: "Horror" },
  { id: 11, name: "Mystery" },
  { id: 12, name: "Romance" },
  { id: 13, name: "Science Fiction" },
  { id: 14, name: "Thriller" },
];

export function GenreQuickLinks() {
  const [visibleGenres, setVisibleGenres] = useState<typeof GENRES>([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    // On mobile, show fewer genres initially
    const initialCount = window.innerWidth < 640 ? 4 : 8;
    setVisibleGenres(showMore ? GENRES : GENRES.slice(0, initialCount));
  }, [showMore]);

  return (
    <div className="mt-8 mb-4">
      <h2 className="text-2xl font-semibold text-white mb-4">Quick Categories</h2>
      <div className="flex flex-wrap gap-2">
        {visibleGenres.map((genre) => (
          <Link
            key={genre.id}
            href={`/movies?genre=${genre.name.toLowerCase()}`}
            className={cn(
              "inline-block px-4 py-2 rounded-full text-sm font-medium transition-all",
              "bg-gray-800 text-white hover:bg-red-600"
            )}
          >
            {genre.name}
          </Link>
        ))}
        
        <button
          onClick={() => setShowMore(!showMore)}
          className="inline-block px-4 py-2 rounded-full text-sm font-medium transition-all bg-gray-900 text-gray-300 hover:text-white"
        >
          {showMore ? "Show Less" : "Show More"}
        </button>
      </div>
    </div>
  );
}