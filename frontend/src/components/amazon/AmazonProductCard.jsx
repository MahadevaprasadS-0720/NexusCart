import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Check, ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const AmazonProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const isLiked = isInWishlist ? isInWishlist(product) : false;

  const discountPercent =
    product.discountPercentage ||
    (product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 15);

  return (
    <div className="bg-white p-4 rounded-none shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full border border-slate-200/80 group font-['Inter'] relative">
      
      {/* Floating Wishlist Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleWishlist(product);
        }}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-400 hover:text-[#cc0c39] flex items-center justify-center shadow-sm border border-slate-200 transition-all cursor-pointer"
        title="Add to Wishlist"
      >
        <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#cc0c39] text-[#cc0c39]' : ''}`} />
      </button>

      <div>
        {/* Product Image */}
        <Link
          to={`/product/${product.id || product._id}`}
          className="block relative pt-[85%] bg-white overflow-hidden mb-3"
        >
          <img
            src={
              product.image ||
              (product.images && product.images.length > 0 ? product.images[0] : '')
            }
            alt={product.title || product.name}
            className="absolute inset-0 w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Badges: Deal of the Day or Limited Time Deal */}
        <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
          {product.isDealOfTheDay ? (
            <span className="bg-[#cc0c39] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-[2px] tracking-wide">
              Limited time deal
            </span>
          ) : product.isFeatured ? (
            <span className="bg-[#232f3e] text-[#febd69] text-[10px] font-black uppercase px-2 py-0.5 rounded-[2px] tracking-wide">
              #1 Best Seller
            </span>
          ) : null}
          <span className="text-[#cc0c39] text-xs font-black">
            {discountPercent}% off
          </span>
        </div>

        {/* Title */}
        <Link
          to={`/product/${product.id || product._id}`}
          className="text-xs font-medium text-slate-900 hover:text-[#c45500] line-clamp-2 leading-relaxed mb-2 block"
        >
          {product.title || product.name}
        </Link>

        {/* Amazon Star Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center text-[#de7921]">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating || 4.5)
                    ? 'fill-[#de7921] text-[#de7921]'
                    : 'text-slate-300'
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] text-[#007185] hover:underline cursor-pointer">
            {product.reviewCount ? Number(product.reviewCount).toLocaleString('en-IN') : '1,420'}
          </span>
        </div>

        {/* Price Section */}
        <div className="space-y-0.5 mb-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs font-bold text-slate-900 align-top">₹</span>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              {Number(product.price).toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-slate-500 font-normal">
                M.R.P.: <span className="line-through">₹{Number(product.originalPrice).toLocaleString('en-IN')}</span>
              </span>
            )}
          </div>

          {/* Prime Badge & Fast Delivery */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <div className="flex items-center bg-[#00a8e1] text-white text-[9px] font-black italic px-1 rounded-sm">
              <span>prime</span>
            </div>
            <span className="text-[11px] text-slate-600 font-medium">
              FREE delivery <span className="font-bold text-slate-800">Tomorrow</span>
            </span>
          </div>
        </div>
      </div>

      {/* Yellow Add to Cart Button */}
      <button
        onClick={() => addToCart(product, 1)}
        className="w-full py-2 px-3 bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] border border-[#fcd200] rounded-full text-slate-900 text-xs font-extrabold shadow-sm transition-all flex items-center justify-center gap-1.5 mt-3 cursor-pointer"
      >
        <ShoppingCart className="w-3.5 h-3.5" />
        <span>Add to Cart</span>
      </button>
    </div>
  );
};

export default AmazonProductCard;
