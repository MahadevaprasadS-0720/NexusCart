import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Zap,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

const banners = [
  {
    id: 1,
    title: 'Apple iPhone 15 Pro Max',
    subtitle: 'Forged in Titanium. Powered by the groundbreaking A17 Pro Chip.',
    badge: 'FLASH SALE • 15% OFF',
    tag: 'FLAGSHIP MOBILE',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    link: '/product-details/flagship-1',
    bgColor: 'from-slate-950 via-slate-900 to-amber-950/40',
    btnGradient: 'from-amber-400 to-amber-500'
  },
  {
    id: 2,
    title: 'Samsung Galaxy S24 Ultra',
    subtitle: 'Galaxy AI is here. 200MP Camera with 100x Space Zoom & Titanium frame.',
    badge: 'NEW ARRIVAL • ₹15,000 EXCHANGE',
    tag: 'PREMIUM AI PHONE',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
    link: '/product-details/flagship-2',
    bgColor: 'from-slate-950 via-indigo-950/60 to-slate-900',
    btnGradient: 'from-indigo-400 to-blue-500'
  },
  {
    id: 3,
    title: 'Sony WH-1000XM5 Noise Canceling',
    subtitle: 'Industry-leading noise cancellation with two processors and 8 microphones.',
    badge: 'BESTSELLER • 30% OFF',
    tag: 'STUDIO AUDIO',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    link: '/product-details/flagship-4',
    bgColor: 'from-slate-950 via-neutral-900 to-emerald-950/30',
    btnGradient: 'from-emerald-400 to-teal-500'
  },
  {
    id: 4,
    title: 'MacBook Air 15" M2 Chip',
    subtitle: 'Impossibly thin design. Up to 18 hours of battery life. Liquid Retina display.',
    badge: 'LIMITED TIME DEAL',
    tag: 'POWERHOUSE ULTRABOOK',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    link: '/product-details/flagship-3',
    bgColor: 'from-slate-950 via-slate-900 to-sky-950/50',
    btnGradient: 'from-sky-400 to-blue-500'
  },
  {
    id: 5,
    title: 'Nike Air Jordan Retro High',
    subtitle: 'Iconic hardwood heritage meets modern street style comfort and cushioning.',
    badge: 'TRENDING FASHION • 20% OFF',
    tag: 'SNEAKER CULTURE',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
    link: '/product-details/flagship-5',
    bgColor: 'from-slate-950 via-red-950/40 to-slate-900',
    btnGradient: 'from-rose-500 to-red-600'
  },
  {
    id: 6,
    title: 'LG 65" OLED 4K Smart Cinema TV',
    subtitle: 'Self-lit OLED pixels, Dolby Vision IQ & Atmos for pure visual perfection.',
    badge: 'BIG SCREEN BONANZA • 40% OFF',
    tag: 'HOME ENTERTAINMENT',
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80',
    link: '/product-details/flagship-6',
    bgColor: 'from-slate-950 via-purple-950/50 to-slate-900',
    btnGradient: 'from-purple-500 to-pink-600'
  }
];

const BannerCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Auto slide timer
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 6000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const handlePrev = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  // Touch Swipe Handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const slide = banners[currentSlide];

  return (
    <div
      className="relative w-full px-4 sm:px-6 lg:px-10 py-4 font-['Inter'] select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={`relative min-h-[380px] md:min-h-[430px] rounded-3xl overflow-hidden bg-gradient-to-r ${slide.bgColor} shadow-2xl border border-slate-800/90 flex items-center transition-all duration-700`}
      >
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:18px_18px] pointer-events-none" />

        {/* Ambient Glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Main Content Grid */}
        <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 px-6 py-8 sm:p-10 md:p-14 items-center">
          
          {/* Left Text Column */}
          <div className="space-y-4 text-white z-10">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-amber-300 text-xs font-black tracking-wider uppercase backdrop-blur-md shadow-sm">
                <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {slide.badge}
              </span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">
                • {slide.tag}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-['Outfit'] leading-tight text-white transition-all duration-500 drop-shadow-md">
              {slide.title}
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-md font-medium leading-relaxed">
              {slide.subtitle}
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-4">
              <Link
                to={slide.link}
                className={`inline-flex items-center gap-2 bg-gradient-to-r ${slide.btnGradient} text-slate-950 font-black px-6 py-3.5 rounded-2xl shadow-lg shadow-black/30 hover:scale-105 active:scale-95 transition-all text-xs sm:text-sm cursor-pointer`}
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-300 font-semibold bg-white/5 px-3 py-2 rounded-xl border border-white/10 backdrop-blur-sm">
                <ShieldCheck className="w-4 h-4 text-amber-400" /> Official NexusCart Warranty
              </span>
            </div>
          </div>

          {/* Right Hero Product Image */}
          <div className="relative flex justify-center items-center z-10">
            <Link to={slide.link} className="block group cursor-pointer">
              <div className="w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-3xl overflow-hidden shadow-2xl border border-white/15 backdrop-blur-md bg-white/10 p-4 transition-transform duration-500 group-hover:scale-105 group-hover:shadow-amber-500/10">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]"
                />
              </div>
            </Link>
          </div>
        </div>

        {/* Carousel Navigation Arrow Controls */}
        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3 sm:px-6 pointer-events-none z-30">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous Slide"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-black/60 hover:bg-black/90 active:scale-90 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all shadow-xl pointer-events-auto cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>
          
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next Slide"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-black/60 hover:bg-black/90 active:scale-90 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all shadow-xl pointer-events-auto cursor-pointer"
          >
            <ChevronRight className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Indicator Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30 pointer-events-auto">
          {banners.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentSlide(index);
              }}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentSlide
                  ? 'w-8 bg-amber-400 shadow-md shadow-amber-500/50'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerCarousel;
