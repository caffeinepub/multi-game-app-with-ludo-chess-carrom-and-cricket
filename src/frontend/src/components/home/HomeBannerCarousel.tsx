import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const banners = [
  {
    id: 'ludo',
    image: '/assets/generated/home-banner-ludo.dim_1600x600.png',
    alt: 'Ludo Game',
  },
  {
    id: 'chess',
    image: '/assets/generated/home-banner-chess.dim_1600x600.png',
    alt: 'Chess Game',
  },
  {
    id: 'carrom',
    image: '/assets/generated/home-banner-carrom.dim_1600x600.png',
    alt: 'Carrom Game',
  },
];

export default function HomeBannerCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-muted/50 to-background shadow-lg">
      {/* Slides Container */}
      <div className="relative w-full aspect-[16/6] md:aspect-[16/5] lg:aspect-[16/4.5]">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-all duration-1000 ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <img
              src={banner.image}
              alt={banner.alt}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        onClick={goToPrevious}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background backdrop-blur-md rounded-full w-12 h-12 md:w-14 md:h-14 shadow-xl border border-border/50 transition-all hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={goToNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background backdrop-blur-md rounded-full w-12 h-12 md:w-14 md:h-14 shadow-xl border border-border/50 transition-all hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 md:w-7 md:h-7" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 bg-background/80 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 shadow-lg">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all rounded-full ${
              index === currentSlide
                ? 'bg-primary w-10 h-3'
                : 'bg-muted-foreground/40 hover:bg-muted-foreground/60 w-3 h-3'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
