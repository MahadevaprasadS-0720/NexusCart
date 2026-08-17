import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Zap, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const isLiked = isInWishlist ? isInWishlist(product) : false;

  const discountPercent = product.discountPercentage ||
    (product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 15);

  return (
    <div className="group neu-card hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col relative">
      
      {/* Floating Deal & Featured Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.isDealOfTheDay && (
          <span className="bg-gradient-to-r from-red-600 to-amber-500 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1 tracking-wider">
            <Zap className="w-3 h-3 fill-white" /> Lightning Deal
          </span>
        )}
        {product.isFeatured && !product.isDealOfTheDay && (
          <span className="bg-slate-900 text-amber-400 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1 tracking-wider">
            <Sparkles className="w-3 h-3 text-amber-400" /> Bestseller
          </span>
        )}
      </div>

      {/* Floating Neumorphic Wishlist Heart Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleWishlist(product);
        }}
        className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full neu-btn flex items-center justify-center text-slate-400 hover:text-red-500 hover:scale-110 active:scale-95 transition-all"
        title="Add to Wishlist"
      >
        <Heart className={`w-4 h-4 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
      </button>

      {/* Product Image Link */}
      <Link to={`/product/${product.id || product._id}`} className="block relative pt-[80%] overflow-hidden bg-white/40">
        <img
          src={product.image || (product.images ? product.images[0] : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80')}
          alt={product.name || product.title}
          className="absolute inset-0 w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500 ease-out"
        />
      </Link>

      {/* Product Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
            <span>{product.brand || 'NexusCart Prime'}</span>
            <span className="text-amber-600 font-extrabold">{discountPercent}% OFF</span>
          </div>

          {/* Title */}
          <Link to={`/product/${product.id || product._id}`} className="block">
            <h3 className="font-extrabold text-slate-800 text-sm line-clamp-2 group-hover:text-amber-600 transition-colors leading-snug">
              {product.name || product.title}
            </h3>
          </Link>
        </div>

        {/* Rating & Pricing Bottom Bar */}
        <div className="space-y-3 pt-3 border-t border-slate-200/60">
          <div className="flex items-center justify-between">
            {/* Rating Stars */}
            <div className="flex items-center gap-1 neu-card-inset px-2.5 py-1 text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span className="font-extrabold text-amber-700">{product.rating || 4.8}</span>
              <span className="text-[10px] text-slate-400 font-medium">({product.reviewCount || 140})</span>
            </div>

            {/* Price */}
            <div className="text-right">
              <div className="font-extrabold text-slate-900 text-base">
                ₹{Number(product.price).toLocaleString('en-IN')}
              </div>
              {product.originalPrice && (
                <div className="text-[10px] font-semibold text-slate-400 line-through">
                  ₹{Number(product.originalPrice).toLocaleString('en-IN')}
                </div>
              )}
            </div>
          </div>

          {/* Add to Cart CTA Button */}
          <button
            onClick={() => addToCart(product, 1)}
            className="w-full neu-btn-primary text-white font-extrabold text-xs py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
          >
            <ShoppingCart className="w-4 h-4" /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
