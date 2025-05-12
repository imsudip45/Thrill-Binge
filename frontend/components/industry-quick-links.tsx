"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const INDUSTRIES = [
  { id: 1, name: "Hollywood", description: "American film industry" },
  { id: 2, name: "Bollywood", description: "Hindi film industry" },
  { id: 3, name: "South Indian", description: "South Indian film industries" },
];

export function IndustryQuickLinks() {
  return (
    <div className="mt-8 mb-4">
      <h2 className="text-2xl font-semibold text-white mb-4">Movie Industries</h2>
      <div className="flex flex-wrap gap-4">
        {INDUSTRIES.map((industry) => (
          <Link
            key={industry.id}
            href={`/movies?industry=${industry.name.toLowerCase()}`}
            className={cn(
              "relative group overflow-hidden",
              "rounded-xl p-6 flex-1 min-w-[250px]",
              "bg-gradient-to-br from-gray-800 to-gray-900",
              "hover:from-red-900 hover:to-red-800 transition-all duration-300"
            )}
          >
            <h3 className="text-xl font-semibold text-white mb-2">{industry.name}</h3>
            <p className="text-gray-300 text-sm">{industry.description}</p>
            <div className="absolute bottom-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity">
              <svg
                className="h-12 w-12 text-white transform -rotate-12"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 15V3l-4 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2h-4l-4-4z" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 