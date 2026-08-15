import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, ShieldCheck, Truck, RotateCcw, Heart, ShoppingCart, Zap, CheckCircle, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';
import { initialProducts } from '../data/mockData';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedImg, setSelectedImg] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await api.getProductById(id);
      if (res.success && res.product) {
        setProduct(res.product);
        setSelectedImg(res.product.image || (res.product.images ? res.product.images[0] : ''));
      } else {
        const found = initialProducts.find(p => p.id === id || p._id === id);
        setProduct(found);
        if (found) setSelectedImg(found.image || (found.images ? found.images[0] : ''));
      }
    } catch (err) {
      const found = initialProducts.find(p => p.id === id || p._id === id);
      setProduct(found);
      if (found) setSelectedImg(found.image || (found.images ? found.images[0] : ''));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '5rem', textAlign: 'center', color: '#64748b' }}>Loading product details...</div>;
  }

  if (!product) {
    return (
      <div style={{ padding: '5rem', textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <Link to="/" style={{ color: '#2874f0', fontWeight: '700' }}>← Back to Storefront</Link>
      </div>
    );
  }

  const prodId = product.id || product._id;
  const isWishlisted = wishlist.includes(prodId);
  const images = product.images && product.images.length > 0
    ? product.images
    : [product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'];

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '2rem auto', padding: '0 1.5rem' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem', fontWeight: '600' }}>
        <ArrowLeft size={16} /> Back to Catalog
      </button>

      <div className="detail-container">
        {/* Left: Product Images */}
        <div className="gallery-container">
          <div className="main-image-frame">
            <img src={selectedImg || images[0]} alt={product.name || product.title} />
          </div>
          {images.length > 1 && (
            <div className="thumbs-row">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className={`thumb-box ${selectedImg === img ? 'active' : ''}`}
                  onClick={() => setSelectedImg(img)}
                >
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Specifications & Info */}
        <div className="detail-info">
          <div style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: '800', color: '#2874f0', letterSpacing: '1px' }}>
            {product.brand || 'Prime Brand'} • {product.category}
          </div>
          <h1>{product.name || product.title}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.8rem 0' }}>
            <span className="rating-badge" style={{ fontSize: '0.9rem', padding: '4px 10px' }}>
              {product.rating || 4.8} <Star size={14} fill="#fff" />
            </span>
            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>{product.reviewCount || 1400} Ratings & Customer Reviews</span>
            <span style={{ color: '#16a34a', fontWeight: '700', fontSize: '0.85rem' }}>
              <CheckCircle size={14} style={{ display: 'inline', marginRight: '4px' }} /> Verified Fulfillment
            </span>
          </div>

          <div className="price-row" style={{ margin: '1.2rem 0' }}>
            <span className="current-price" style={{ fontSize: '2rem' }}>
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="original-price" style={{ fontSize: '1.2rem' }}>
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
            {product.discountPercentage > 0 && (
              <span className="discount-percentage" style={{ fontSize: '1.1rem' }}>
                {product.discountPercentage}% OFF
              </span>
            )}
          </div>

          <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            {product.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#334155' }}>Quantity:</span>
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: '700' }}
            >
              {[1, 2, 3, 4, 5].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <span style={{ color: product.stock > 0 ? '#16a34a' : '#ef4444', fontWeight: '700', fontSize: '0.85rem' }}>
              {product.stock > 0 ? `In Stock (${product.stock} units available)` : 'Out of Stock'}
            </span>
          </div>

          <div className="detail-actions">
            <button className="add-cart-btn" style={{ padding: '0.8rem' }} onClick={() => addToCart(product, quantity)}>
              <ShoppingCart size={20} /> Add to Cart
            </button>
            <button className="btn-buy-now" onClick={handleBuyNow}>
              <Zap size={20} style={{ display: 'inline', marginRight: '4px' }} /> Buy Now
            </button>
            <button
              onClick={() => toggleWishlist(prodId)}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                padding: '0 1rem',
                color: isWishlisted ? '#ef4444' : '#64748b',
                cursor: 'pointer'
              }}
            >
              <Heart size={20} fill={isWishlisted ? '#ef4444' : 'none'} />
            </button>
          </div>

          {/* Full Specifications Section */}
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.8rem', borderBottom: '2px solid #2874f0', width: 'fit-content', paddingBottom: '0.2rem' }}>
              Product Specifications & Details
            </h3>
            <table className="specs-table">
              <tbody>
                <tr>
                  <td className="spec-key">Product Name</td>
                  <td>{product.name || product.title}</td>
                </tr>
                <tr>
                  <td className="spec-key">Category</td>
                  <td>{product.category}</td>
                </tr>
                <tr>
                  <td className="spec-key">Brand</td>
                  <td>{product.brand || 'Generic'}</td>
                </tr>
                <tr>
                  <td className="spec-key">Stock Availability</td>
                  <td>{product.stock} Units</td>
                </tr>
                <tr>
                  <td className="spec-key">Rating</td>
                  <td>{product.rating || 4.5} / 5.0 Stars</td>
                </tr>
                {product.specifications && Object.entries(product.specifications).map(([key, val]) => (
                  <tr key={key}>
                    <td className="spec-key">{key}</td>
                    <td>{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
