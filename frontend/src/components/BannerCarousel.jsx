import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Zap, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

const banners = [
  {
    id: 1,
    title: 'Apple iPhone 15 Pro Max',
    subtitle: 'Forged in Titanium. Powered by A17 Pro Chip.',
    badge: '⚡ FLASH SALE • 15% OFF',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1200&q=80',
    link: '/product/prod-101',
    bgColor: 'from-slate-950 via-slate-900 to-amber-950'
  },
  {
    id: 2,
    title: 'Samsung Galaxy S24 Ultra 5G',
    subtitle: 'Welcome to the Era of Mobile AI & 200MP Camera.',
    badge: '🔥 DEAL OF THE DAY',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1200&q=80',
    link: '/product/prod-102',
    bgColor: 'from-slate-950 via-slate-900 to-blue-950'
  },
  {
    id: 3,
    title: 'Sony WH-1000XM5 Headphones',
    subtitle: 'Industry Leading Noise Canceling Sound Performance.',
    badge: '⭐ TOP RATED AUDIOPHILE',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
    link: '/product/prod-103',
    bgColor: 'from-slate-950 via-slate-900 to-emerald-950'
  }
];

const BannerCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = banners[currentSlide];

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className={`relative min-h-[360px] md:min-h-[420px] rounded-3xl overflow-hidden bg-gradient-to-r ${slide.bgColor} shadow-2xl border border-slate-800/80 flex items-center transition-all duration-700`}>
        
        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12 items-center">
          {/* Left Text */}
          <div className="space-y-4 text-white">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-extrabold tracking-wider uppercase">
              <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {slide.badge}
            </span>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-['Outfit'] leading-tight text-white">
              {slide.title}
            </h1>

            <p className="text-sm md:text-base text-slate-300 max-w-md font-medium leading-relaxed">
              {slide.subtitle}
            </p>

            <div className="pt-2 flex items-center gap-4">
              <Link
                to={slide.link}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold px-6 py-3.5 rounded-2xl shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all text-sm"
              >
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                <ShieldCheck className="w-4 h-4 text-amber-400" /> Official NexusCart Warranty
              </span>
            </div>
          </div>

          {/* Right Hero Image */}
          <div className="relative flex justify-center items-center">
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden shadow-2xl border border-white/10 backdrop-blur-sm bg-white/5 p-4">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover rounded-2xl shadow-inner transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* Carousel Navigation Buttons */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1))}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-2xl bg-slate-900/60 hover:bg-slate-900 text-white border border-slate-700/60 backdrop-blur-md flex items-center justify-center transition-all opacity-80 hover:opacity-100"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % banners.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-2xl bg-slate-900/60 hover:bg-slate-900 text-white border border-slate-700/60 backdrop-blur-md flex items-center justify-center transition-all opacity-80 hover:opacity-100"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === idx ? 'w-8 bg-amber-400' : 'w-2 bg-slate-700 hover:bg-slate-500'
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default BannerCarousel;
