import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const AmazonProductRow = ({
  title = "Today's Deals",
  subtitle = "Limited time deals with instant savings",
  linkText = "See all deals",
  categoryFilter = "All",
  products = [],
  onSelectCategory
}) => {
  const scrollRef = useRef(null);
  const { addToCart } = useCart();

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -650 : 650;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-white p-5 my-5 shadow-sm border border-slate-200/70 max-w-[1500px] mx-auto px-4 font-['Inter'] relative select-none">
      
      {/* Header */}
      <div className="flex items-baseline justify-between mb-3">
        <div className="flex items-baseline gap-3">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h2>
          {subtitle && (
            <span className="text-xs text-slate-500 hidden sm:inline">{subtitle}</span>
          )}
        </div>
        <button
          onClick={() => onSelectCategory && onSelectCategory(categoryFilter)}
          className="text-xs font-medium text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer"
        >
          {linkText}
        </button>
      </div>

      {/* Horizontal Scroller Container */}
      <div className="relative group">
        
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-20 bg-white/90 hover:bg-white text-slate-800 border border-slate-300 shadow-md flex items-center justify-center rounded-r-md transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Product Items Track */}
        <div
          ref={scrollRef}
          className="flex items-stretch gap-4 overflow-x-auto no-scrollbar py-2 scroll-smooth"
        >
          {products.slice(0, 15).map((product) => {
            const discountPercent =
              product.discountPercentage ||
              (product.originalPrice
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 18);

            return (
              <div
                key={product.id || product._id}
                className="w-48 sm:w-56 shrink-0 bg-white p-3 border border-slate-100 rounded-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Image */}
                  <Link
                    to={`/product/${product.id || product._id}`}
                    className="block relative pt-[90%] bg-white overflow-hidden mb-2"
                  >
                    <img
                      src={
                        product.image ||
                        (product.images && product.images.length > 0 ? product.images[0] : '')
                      }
                      alt={product.title || product.name}
                      className="absolute inset-0 w-full h-full object-contain p-2 hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Deal Pill */}
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="bg-[#cc0c39] text-white text-[10px] font-black px-1.5 py-0.2 rounded-sm">
                      Up to {discountPercent}% off
                    </span>
                    <span className="text-[10px] font-bold text-[#cc0c39]">Deal of the Day</span>
                  </div>

                  {/* Price */}
                  <div className="text-sm font-bold text-slate-900">
                    ₹{Number(product.price).toLocaleString('en-IN')}
                    {product.originalPrice && (
                      <span className="text-[11px] font-normal text-slate-500 line-through ml-1.5">
                        ₹{Number(product.originalPrice).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <Link
                    to={`/product/${product.id || product._id}`}
                    className="text-xs text-slate-800 hover:text-[#c45500] line-clamp-1 mt-1 block font-medium"
                  >
                    {product.title || product.name}
                  </Link>
                </div>

                {/* Quick Add button */}
                <button
                  onClick={() => addToCart(product, 1)}
                  className="mt-2.5 w-full py-1.5 bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] rounded-full text-[11px] font-black text-slate-900 shadow-sm cursor-pointer transition-all"
                >
                  Add to Cart
                </button>
              </div>
            );
          })}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-20 bg-white/90 hover:bg-white text-slate-800 border border-slate-300 shadow-md flex items-center justify-center rounded-l-md transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
};

export default AmazonProductRow;
