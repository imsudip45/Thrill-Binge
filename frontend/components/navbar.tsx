"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300',
        isScrolled 
          ? 'bg-black bg-opacity-90 backdrop-blur-sm shadow-md' 
          : 'bg-gradient-to-b from-black to-transparent'
      )}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <span className="font-black text-2xl flex items-center space-x-1">
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-b from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">THRILL</span>
                  <span className="absolute -inset-y-2 -inset-x-1 bg-red-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></span>
                  <span className="absolute -inset-y-3 -inset-x-2 bg-gradient-to-r from-red-500/0 via-red-500/20 to-red-500/0 blur-2xl group-hover:via-red-500/30 transition-all rounded-[100%]"></span>
                  <span className="absolute -inset-1 bg-gradient-to-tr from-red-500/0 via-red-500/10 to-transparent blur-xl group-hover:via-red-500/20 transition-all rotate-6"></span>
                </span>
                <span className="relative inline-block">
                  <span className="relative z-10 text-red-500 font-bold group-hover:text-red-400 transition-colors">BINGE</span>
                  <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500/0 via-red-500 to-red-500/0 transform origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100"></span>
                </span>
              </span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-8">
                <Link href="/" className="text-white hover:text-red-500 transition-colors">
                  Home
                </Link>
                <Link href="/movies" className="text-white hover:text-red-500 transition-colors">
                  Movies
                </Link>
                <Link href="/search" className="text-white hover:text-red-500 transition-colors">
                  <Search className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:block text-sm bg-gradient-to-r from-red-500 to-red-700 text-white px-3 py-1 rounded-full font-medium animate-pulse">
              Use Brave Browser for AD free experience
            </span>
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="text-white focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black bg-opacity-95 backdrop-blur-sm">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              href="/" 
              className="block px-3 py-2 text-white hover:bg-gray-800 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/movies" 
              className="block px-3 py-2 text-white hover:bg-gray-800 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Movies
            </Link>
            <Link 
              href="/search" 
              className="block px-3 py-2 text-white hover:bg-gray-800 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Search
            </Link>
            <div className="px-3 py-2">
              <span className="block text-sm bg-gradient-to-r from-red-500 to-red-700 text-white px-3 py-1 rounded-full font-medium text-center">
                Use Brave Browser for AD free experience
              </span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}