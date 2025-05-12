"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchMovies } from '@/lib/api';
import { Movie } from '@/lib/types';
import { MovieCard } from '@/components/movie-card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDownIcon, FilterX, SlidersHorizontal } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const INDUSTRIES = [
  { id: 1, name: "All Industries" },
  { id: 2, name: "Hollywood" },
  { id: 3, name: "Bollywood" },
  { id: 4, name: "South Indian" },
];

const YEARS = [
  { value: "all", label: "All Years" },
  { value: "2024", label: "2024" },
  { value: "2023", label: "2023" },
  { value: "2022", label: "2022" },
  { value: "2021", label: "2021" },
  { value: "2020", label: "2020" },
  { value: "2010-2019", label: "2010-2019" },
  { value: "2000-2009", label: "2000-2009" },
  { value: "1990-1999", label: "1990-1999" },
  { value: "1980-1989", label: "1980-1989" },
];

const SORT_OPTIONS = [
  { value: "popularity", label: "Popularity" },
  { value: "rating", label: "Rating" },
  { value: "release_date", label: "Release Date" },
  { value: "title", label: "Title" },
];

export default function MoviesPage() {
  const searchParams = useSearchParams();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Filters
  const [selectedIndustry, setSelectedIndustry] = useState(searchParams.get('industry') || 'all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [showFilters, setShowFilters] = useState(false);

  // Load movies with current filters
  useEffect(() => {
    async function loadMovies() {
      try {
        setLoading(true);
        
        // Build endpoint with filters
        let endpoint = `/api/movies/?page=${currentPage}`;
        
        if (selectedIndustry && selectedIndustry !== 'all') {
          endpoint += `&industry=${selectedIndustry}`;
        }
        
        if (selectedYear && selectedYear !== 'all') {
          endpoint += `&year=${selectedYear}`;
        }
        
        if (sortBy) {
          endpoint += `&sort=${sortBy}`;
        }
        
        const data = await fetchMovies(endpoint);
        
        if (currentPage > 1) {
          // Remove duplicates based on tmdb_id when adding new movies
          setMovies(prev => {
            const existingIds = new Set(prev.map(m => m.tmdb_id));
            const newMovies = data.filter(movie => !existingIds.has(movie.tmdb_id));
            return [...prev, ...newMovies];
          });
        } else {
          setMovies(data);
          window.scrollTo(0, 0);
        }
        
        // Check if we have more pages
        setHasMore(data.length > 0);
      } catch (error) {
        console.error('Error loading movies:', error);
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, [currentPage, selectedIndustry, selectedYear, sortBy]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedIndustry, selectedYear, sortBy]);

  // Apply filters and reset
  const applyFilters = () => {
    setShowFilters(false);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSelectedIndustry('all');
    setSelectedYear('all');
    setSortBy('popularity');
    setShowFilters(false);
    setCurrentPage(1);
  };

  // Load more movies
  const loadMore = () => {
    if (!loading && hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="pt-20 pb-8">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Movies</h1>
          
          {/* Desktop filters */}
          <div className="hidden md:flex gap-4 items-center">
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger className="w-[180px] bg-gray-900 text-white border-gray-700">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {INDUSTRIES.map(industry => (
                  <SelectItem key={industry.id} value={industry.name.toLowerCase()}>
                    {industry.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[180px] bg-gray-900 text-white border-gray-700">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map(year => (
                  <SelectItem key={year.value} value={year.value}>
                    {year.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] bg-gray-900 text-white border-gray-700">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Mobile filters */}
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetTrigger asChild>
              <Button className="md:hidden bg-gray-800 text-white">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-gray-900 text-white border-gray-700">
              <SheetHeader>
                <SheetTitle className="text-white">Filters</SheetTitle>
                <SheetDescription className="text-gray-400">
                  Apply filters to refine movie results
                </SheetDescription>
              </SheetHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Industry</label>
                  <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                    <SelectTrigger className="w-full bg-gray-800 text-white border-gray-700">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRIES.map(industry => (
                        <SelectItem key={industry.id} value={industry.name.toLowerCase()}>
                          {industry.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Year</label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-full bg-gray-800 text-white border-gray-700">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {YEARS.map(year => (
                        <SelectItem key={year.value} value={year.value}>
                          {year.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full bg-gray-800 text-white border-gray-700">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {SORT_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    onClick={applyFilters}
                  >
                    Apply Filters
                  </Button>
                  <Button 
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white"
                    onClick={resetFilters}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Filter summary */}
        {(selectedIndustry !== 'all' || selectedYear !== 'all') && (
          <div className="bg-gray-800/50 rounded-lg p-3 mb-6 flex flex-wrap items-center gap-2">
            <span className="text-gray-400 text-sm">Active filters:</span>
            {selectedIndustry !== 'all' && (
              <span className="bg-gray-700 text-white text-xs rounded-full px-3 py-1">
                Industry: {selectedIndustry}
              </span>
            )}
            {selectedYear !== 'all' && (
              <span className="bg-gray-700 text-white text-xs rounded-full px-3 py-1">
                Year: {selectedYear}
              </span>
            )}
            <button 
              onClick={resetFilters}
              className="text-red-500 text-xs ml-auto flex items-center"
            >
              <FilterX className="h-3 w-3 mr-1" />
              Clear All
            </button>
          </div>
        )}
        
        {/* Movies Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        
        {/* Load More */}
        {hasMore && (
          <div className="mt-8 text-center">
            <Button
              onClick={loadMore}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {loading ? 'Loading...' : 'Load More'}
            </Button>
          </div>
        )}
        
        {/* No Results */}
        {!loading && movies.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl text-gray-400">No movies found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}