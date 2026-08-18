import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Zap, Star, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const NeumorphicDealRow = ({
  title = "⚡ Flash Deals of the Day",
  subtitle = "Handpicked verified flagship products with instant dispatch",
  linkText = "View All",
  categoryFilter = "All",
  products = [],
  onSelectCategory
}) => {
  const scrollRef = useRef(null);
  const { addToCart } = useCart();

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -550 : 550;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <section className="w-full px-4 sm:px-6 lg:px-10 my-8 font-['Inter'] select-none">
      <div className="neu-card p-6 sm:p-8 rounded-3xl space-y-4 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-300/70 pb-4">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-['Outfit'] flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span>{title}</span>
            </h2>
            {subtitle && (
              <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
            )}
          </div>

          <button
            onClick={() => onSelectCategory && onSelectCategory(categoryFilter)}
            className="neu-btn px-4 py-2 rounded-xl text-xs font-black text-amber-600 hover:text-amber-700 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>{linkText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Carousel Container */}
        <div className="relative group">
          
          {/* Left Arrow */}
          <button
            type="button"
            onClick={() => scroll('left')}
            className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 neu-btn-circle text-slate-800 flex items-center justify-center transition-all opacity-90 hover:scale-110 shadow-lg cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Items Track */}
          <div
            ref={scrollRef}
            className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto no-scrollbar py-2 scroll-smooth"
          >
            {products.slice(0, 15).map((product) => {
              const discountPercent =
                product.discountPercentage ||
                (product.originalPrice
                  ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                  : 15);

              return (
                <div
                  key={product.id || product._id}
                  className="w-52 sm:w-64 shrink-0 neu-card p-4 rounded-2xl flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 shadow-sm"
                >
                  <div>
                    {/* Image Link */}
                    <Link
                      to={`/product/${product.id || product._id}`}
                      className="block relative pt-[85%] neu-card-inset rounded-xl overflow-hidden mb-3 bg-white/30"
                    >
                      <img
                        src={
                          product.image ||
                          (product.images && product.images.length > 0 ? product.images[0] : '')
                        }
                        alt={product.title || product.name}
                        className="absolute inset-0 w-full h-full object-contain p-3 hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    {/* Brand & Discount */}
                    <div className="flex items-center justify-between text-[10px] font-black uppercase mb-1">
                      <span className="text-slate-400 truncate max-w-[110px]">
                        {product.brand || 'Nexus Prime'}
                      </span>
                      <span className="neu-card-inset px-2 py-0.5 text-amber-600 rounded-md">
                        {discountPercent}% OFF
                      </span>
                    </div>

                    {/* Title */}
                    <Link
                      to={`/product/${product.id || product._id}`}
                      className="text-xs font-bold text-slate-800 hover:text-amber-600 line-clamp-2 leading-snug mb-2 block"
                    >
                      {product.title || product.name}
                    </Link>
                  </div>

                  {/* Price & Add to Cart */}
                  <div className="pt-2 border-t border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-extrabold text-slate-900">
                        ₹{Number(product.price).toLocaleString('en-IN')}
                      </div>
                      {product.originalPrice && (
                        <div className="text-[10px] font-semibold text-slate-400 line-through">
                          ₹{Number(product.originalPrice).toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => addToCart(product, 1)}
                      className="w-full py-2 px-3 neu-btn-primary rounded-xl text-white text-xs font-black shadow-sm transition-all"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={() => scroll('right')}
            className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 neu-btn-circle text-slate-800 flex items-center justify-center transition-all opacity-90 hover:scale-110 shadow-lg cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default NeumorphicDealRow;
