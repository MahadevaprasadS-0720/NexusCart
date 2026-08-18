import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const amazonBanners = [
  {
    id: 'b1',
    title: 'Great Indian Festival - Top Deals on Smartphones',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1600&q=80',
    link: '/?category=Mobiles'
  },
  {
    id: 'b2',
    title: 'Up to 70% Off - Electronics & Audio Essentials',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&q=80',
    link: '/?category=Electronics'
  },
  {
    id: 'b3',
    title: 'Latest Fashion Trends - Minimum 50% Off',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80',
    link: '/?category=Fashion'
  },
  {
    id: 'b4',
    title: 'Upgrade Your Home & Kitchen - Mega Deals',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80',
    link: '/?category=Home & Kitchen'
  }
];

const AmazonHeroBanner = () => {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % amazonBanners.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIdx((prev) => (prev === 0 ? amazonBanners.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIdx((prev) => (prev + 1) % amazonBanners.length);
  };

  return (
    <div className="relative w-full overflow-hidden bg-[#e3e6e6] max-w-[1500px] mx-auto select-none">
      {/* Banner Slides Carousel */}
      <div className="relative h-[250px] sm:h-[350px] md:h-[450px] lg:h-[520px] w-full">
        {amazonBanners.map((banner, index) => (
          <Link
            key={banner.id}
            to={banner.link}
            className={`absolute inset-0 transition-opacity duration-700 block ${
              index === currentIdx ? 'opacity-100 z-0' : 'opacity-0 -z-10'
            }`}
          >
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover object-center"
            />
          </Link>
        ))}

        {/* Amazon Bottom Gradient Mask */}
        <div className="absolute inset-x-0 bottom-0 h-44 md:h-72 bg-gradient-to-t from-[#e3e6e6] via-[#e3e6e6]/60 to-transparent pointer-events-none z-10" />

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-2 top-24 sm:top-36 md:top-48 z-20 w-10 sm:w-12 h-16 sm:h-24 flex items-center justify-center text-slate-800 hover:bg-black/10 rounded-sm focus:outline focus:outline-2 focus:outline-[#007185] transition-all cursor-pointer"
        >
          <ChevronLeft className="w-8 h-8 sm:w-10 sm:h-10 text-slate-800" />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-2 top-24 sm:top-36 md:top-48 z-20 w-10 sm:w-12 h-16 sm:h-24 flex items-center justify-center text-slate-800 hover:bg-black/10 rounded-sm focus:outline focus:outline-2 focus:outline-[#007185] transition-all cursor-pointer"
        >
          <ChevronRight className="w-8 h-8 sm:w-10 sm:h-10 text-slate-800" />
        </button>
      </div>
    </div>
  );
};

export default AmazonHeroBanner;
