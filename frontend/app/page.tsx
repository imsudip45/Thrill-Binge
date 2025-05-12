import { HeroSection } from '@/components/hero-section';
import { MovieCarousel } from '@/components/movie-carousel';
import { IndustryQuickLinks } from '@/components/industry-quick-links';

export default function Home() {
  return (
    <div className="w-full">
      <HeroSection />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <IndustryQuickLinks />
        <MovieCarousel 
          title="Popular Movies (7+ Rating)" 
          endpoint="/api/movies/?sort=popularity&min_rating=7&limit=15" 
          className="my-10"
        />
        <MovieCarousel 
          title="Hollywood Hits" 
          endpoint="/api/movies/?industry=hollywood" 
          className="my-10"
        />
        <MovieCarousel 
          title="Bollywood Blockbusters" 
          endpoint="/api/movies/?industry=bollywood" 
          className="my-10"
        />
        <MovieCarousel 
          title="South Indian Cinema" 
          endpoint="/api/movies/?industry=south%20indian" 
          className="my-10"
        />
        <MovieCarousel 
          title="Must-Watch Movies (8.5+ Rating)" 
          endpoint="/api/movies/?sort=top_rated&min_rating=8.5&limit=15" 
          className="my-10"
          description="Highest rated movies across all industries"
        />
      </div>
    </div>
  );
}