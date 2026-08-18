import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Zap, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

const banners = [
  {
    id: 1,
    title: 'Apple iPhone 15 Pro Max',
    subtitle: 'Forged in Titanium. Powered by the groundbreaking A17 Pro Chip.',
    badge: '⚡ FLASH SALE • 15% OFF',
    tag: 'Flagship Mobile',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1200&q=80',
    link: '/product/prod-101',
    bgColor: 'from-slate-950 via-slate-900 to-amber-950',
    accentColor: 'text-amber-400',
    btnGradient: 'from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400'
  },
  {
    id: 2,
    title: 'Samsung Galaxy S24 Ultra 5G',
    subtitle: 'Welcome to the Era of Mobile AI & Ultra 200MP Quad Camera.',
    badge: '🔥 DEAL OF THE DAY',
    tag: 'Galaxy AI Enabled',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1200&q=80',
    link: '/product/prod-102',
    bgColor: 'from-slate-950 via-slate-900 to-blue-950',
    accentColor: 'text-blue-400',
    btnGradient: 'from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400'
  },
  {
    id: 3,
    title: 'Sony WH-1000XM5 Headphones',
    subtitle: 'Industry-Leading Noise Canceling & Master Audio Performance.',
    badge: '⭐ TOP RATED AUDIO',
    tag: 'Lossless Hi-Res Sound',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
    link: '/product/prod-103',
    bgColor: 'from-slate-950 via-slate-900 to-emerald-950',
    accentColor: 'text-emerald-400',
    btnGradient: 'from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400'
  },
  {
    id: 4,
    title: 'Apple MacBook Air 15" M2',
    subtitle: 'Impossibly thin design with Liquid Retina Display and 18h Battery.',
    badge: '✨ BESTSELLER PRO',
    tag: 'Next-Gen Performance',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
    link: '/product/prod-104',
    bgColor: 'from-slate-950 via-slate-900 to-purple-950',
    accentColor: 'text-purple-400',
    btnGradient: 'from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400'
  },
  {
    id: 5,
    title: 'Nike Air Jordan 1 Retro High',
    subtitle: 'Iconic Chicago Colorway crafted with premium full-grain leather.',
    badge: '👟 TRENDING STREETWEAR',
    tag: 'Limited Edition Drop',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=80',
    link: '/product/prod-105',
    bgColor: 'from-slate-950 via-slate-900 to-red-950',
    accentColor: 'text-red-400',
    btnGradient: 'from-red-500 to-amber-500 hover:from-red-400 hover:to-amber-400'
  },
  {
    id: 6,
    title: 'LG 55" 4K OLED Smart TV',
    subtitle: 'Self-lit OLED pixels delivering infinite contrast & 120Hz gaming.',
    badge: '📺 HOME ENTERTAINMENT',
    tag: 'Dolby Vision Cinema',
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1200&q=80',
    link: '/product/prod-107',
    bgColor: 'from-slate-950 via-slate-900 to-indigo-950',
    accentColor: 'text-indigo-400',
    btnGradient: 'from-indigo-500 to-blue-500 hover:from-indigo-400 hover:to-blue-400'
  }
];

const BannerCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Auto slide with pause on user hover
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused, currentSlide]);

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
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  // Touch Swipe Handlers for Mobile & Tablet
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
      className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 font-['Inter'] select-none"
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
                  className="w-full h-full object-cover rounded-2xl shadow-inner transition-transform duration-700 ease-out group-hover:scale-108"
                />
              </div>
            </Link>
          </div>
        </div>

        {/* ================= CAROUSEL NAVIGATION BUTTONS ================= */}
        {/* Previous Button (<) */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-2xl bg-slate-900/80 hover:bg-slate-900 text-white border border-white/20 backdrop-blur-lg flex items-center justify-center transition-all duration-200 shadow-xl hover:scale-110 active:scale-90 cursor-pointer pointer-events-auto hover:border-amber-400 group"
        >
          <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* Next Button (>) */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-2xl bg-slate-900/80 hover:bg-slate-900 text-white border border-white/20 backdrop-blur-lg flex items-center justify-center transition-all duration-200 shadow-xl hover:scale-110 active:scale-90 cursor-pointer pointer-events-auto hover:border-amber-400 group"
        >
          <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* ================= SLIDE INDICATOR DOTS ================= */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-slate-950/60 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
          {banners.map((b, idx) => (
            <button
              key={b.id}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentSlide(idx);
              }}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer pointer-events-auto ${
                currentSlide === idx
                  ? 'w-7 bg-amber-400 shadow-md shadow-amber-400/50'
                  : 'w-2.5 bg-slate-600 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default BannerCarousel;
