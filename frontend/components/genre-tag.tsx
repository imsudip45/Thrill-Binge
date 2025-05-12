import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Genre } from '@/lib/types';

interface GenreTagProps {
  genre: Genre;
  className?: string;
}

export function GenreTag({ genre, className }: GenreTagProps) {
  return (
    <Link 
      href={`/movies?genre=${genre.name.toLowerCase()}`}
      className={cn(
        "inline-block bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium rounded-full px-3 py-1 transition-colors",
        className
      )}
    >
      {genre.name}
    </Link>
  );
}