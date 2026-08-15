import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const isWishlisted = wishlist.includes(product.id);

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(product.price);

  const formattedOriginal = product.originalPrice
    ? new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(product.originalPrice)
    : null;

  return (
    <div className="product-card">
      {product.isDealOfTheDay && (
        <span className="product-badge-deal">⚡ Deal of the Day</span>
      )}

      <button
        className={`product-wishlist-btn ${isWishlisted ? 'active' : ''}`}
        onClick={() => toggleWishlist(product.id)}
        title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart size={18} fill={isWishlisted ? '#ef4444' : 'none'} />
      </button>

      <Link to={`/product/${product.id}`} className="product-img-box">
        <img
          src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'}
          alt={product.title}
          loading="lazy"
        />
      </Link>

      <div className="product-info">
        <div className="product-brand">{product.brand || 'Prime Brand'}</div>
        <Link to={`/product/${product.id}`} className="product-title" title={product.title}>
          {product.title}
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', margin: '0.2rem 0' }}>
          <span className="rating-badge">
            {product.rating || 4.5} <Star size={11} fill="#fff" />
          </span>
          <span className="review-count">({product.reviewCount || 120})</span>
        </div>

        <div className="price-row">
          <span className="current-price">{formattedPrice}</span>
          {formattedOriginal && <span className="original-price">{formattedOriginal}</span>}
          {product.discountPercentage > 0 && (
            <span className="discount-percentage">{product.discountPercentage}% OFF</span>
          )}
        </div>

        <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: '600', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          <CheckCircle size={12} /> Free Express Prime Delivery
        </div>

        <button className="add-cart-btn" onClick={() => addToCart(product)}>
          <ShoppingCart size={16} /> Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
