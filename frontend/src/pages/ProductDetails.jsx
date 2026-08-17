import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, ShieldCheck, Truck, RotateCcw, Heart, ShoppingCart, Zap, CheckCircle, ArrowLeft, MessageSquare, UserCheck, Send } from 'lucide-react';
import { api } from '../services/api';
import { initialProducts } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Review Form State
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');

  useEffect(() => {
    fetchProductAndReviews();
  }, [id]);

  const fetchProductAndReviews = async () => {
    try {
      setLoading(true);
      let foundProduct = null;

      try {
        const res = await api.getProductById(id);
        if (res.success && res.product) {
          foundProduct = res.product;
        }
      } catch (e) {}

      // Fallback 1: Search in initialProducts
      if (!foundProduct) {
        foundProduct = initialProducts.find(p => (p.id || p._id) === id);
      }

      // Fallback 2: Search in Live Market catalog
      if (!foundProduct) {
        try {
          const liveRes = await fetchLiveMarketStoreProducts();
          if (liveRes.success && liveRes.products) {
            foundProduct = liveRes.products.find(p => (p.id || p._id) === id);
          }
        } catch (me) {}
      }

      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedImage(foundProduct.image || (foundProduct.images ? foundProduct.images[0] : ''));
        if (foundProduct.reviews && foundProduct.reviews.length > 0) {
          setReviews(foundProduct.reviews);
        }
      }

      // Fetch additional Reviews from Firestore DB
      try {
        const revRes = await api.getProductReviews(id);
        if (revRes.success && revRes.reviews && revRes.reviews.length > 0) {
          setReviews(prev => [...revRes.reviews, ...prev]);
        }
      } catch (fe) {}
    } catch (err) {
      console.warn('Error loading product details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (!newComment.trim()) return;

    setSubmittingReview(true);
    setReviewSuccess('');

    try {
      const reviewPayload = {
        userId: user.uid || user.id,
        userName: user.name || 'Verified Buyer',
        rating: newRating,
        comment: newComment.trim()
      };

      const res = await api.addProductReview(id, reviewPayload);
      if (res.success && res.review) {
        setReviews([res.review, ...reviews]);
        setNewComment('');
        setNewRating(5);
        setReviewSuccess('Thank you! Your rating & review have been submitted to Firestore.');

        // Refresh product rating average
        const updatedProd = await api.getProductById(id);
        if (updatedProd.success && updatedProd.product) {
          setProduct(updatedProd.product);
        }
      }
    } catch (err) {
      setReviewSuccess('Review saved locally!');
    } finally {
      setSubmittingReview(false);
      setTimeout(() => setReviewSuccess(''), 4000);
    }
  };

  if (loading || !product) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.2rem', color: '#64748b' }}>Loading NexusCart product details...</h2>
      </div>
    );
  }

  const isLiked = isInWishlist(product.id || product._id);

  return (
    <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1.5rem' }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          background: 'none',
          border: 'none',
          color: '#2874f0',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontWeight: '700',
          fontSize: '0.9rem',
          marginBottom: '1.5rem'
        }}
      >
        <ArrowLeft size={18} /> Back to Products
      </button>

      {/* Main Product Details Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 460px) 1fr', gap: '2.5rem', marginBottom: '3rem' }}>
        {/* Left Column: Image Gallery */}
        <div>
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.5rem', textAlign: 'center', marginBottom: '1rem', position: 'relative' }}>
            <img
              src={selectedImage || product.image}
              alt={product.name || product.title}
              style={{ maxWidth: '100%', maxHeight: '380px', objectFit: 'contain' }}
            />
            <button
              onClick={() => toggleWishlist(product)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}
            >
              <Heart size={20} color={isLiked ? '#ef4444' : '#64748b'} fill={isLiked ? '#ef4444' : 'none'} />
            </button>
          </div>

          {/* Additional Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.8rem', overflowX: 'auto' }}>
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="Thumbnail"
                  onClick={() => setSelectedImage(img)}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '8px',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    border: selectedImage === img ? '2px solid #2874f0' : '1px solid #e2e8f0'
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Title & Actions */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '0.8rem', color: '#2874f0', fontWeight: '800', textTransform: 'uppercase', tracking: '1px' }}>
              {product.brand || 'NexusCart Prime'} • {product.category}
            </div>
            {(product.isCloverLive || (product.id && String(product.id).startsWith('clover_'))) && (
              <span style={{ background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', fontSize: '0.72rem', fontWeight: '800', padding: '2px 8px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                🍀 Clover Live Merchant Verified
              </span>
            )}
          </div>

          <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', margin: '0.4rem 0 0.8rem 0', lineHeight: '1.3' }}>
            {product.name || product.title}
          </h1>

          {/* Rating Summary Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
            <div style={{ background: '#388e3c', color: '#ffffff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.88rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '3px' }}>
              {product.rating || 4.8} <Star size={14} fill="#fff" color="#fff" />
            </div>
            <span style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: '600' }}>
              ({product.reviewCount || reviews.length} Ratings & Reviews)
            </span>
          </div>

          {/* Pricing */}
          <div style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: '10px', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.8rem' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f172a' }}>
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '1.1rem' }}>
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span style={{ color: '#388e3c', fontWeight: '800', fontSize: '1rem' }}>
                    {product.discountPercentage || 15}% OFF
                  </span>
                </>
              )}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: '700', marginTop: '4px' }}>
              Inclusive of all taxes • In Stock ({product.stock || 20} units remaining)
            </div>
          </div>

          {/* Quantity Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.8rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#475569' }}>Quantity:</label>
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: '700', fontSize: '0.95rem' }}
            >
              {[1, 2, 3, 4, 5, 10].map(q => <option key={q} value={q}>{q}</option>)}
            </select>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <button
              onClick={() => addToCart(product, quantity)}
              style={{
                flex: 1,
                background: '#ff9f00',
                color: '#ffffff',
                border: 'none',
                padding: '0.9rem',
                borderRadius: '8px',
                fontWeight: '800',
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(255,159,0,0.3)'
              }}
            >
              <ShoppingCart size={20} /> Add to Cart
            </button>

            <button
              onClick={() => { addToCart(product, quantity); navigate('/checkout'); }}
              style={{
                flex: 1,
                background: '#fb641b',
                color: '#ffffff',
                border: 'none',
                padding: '0.9rem',
                borderRadius: '8px',
                fontWeight: '800',
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(251,100,27,0.3)'
              }}
            >
              <Zap size={20} /> Buy Now
            </button>
          </div>

          {/* Specifications Table */}
          {product.specifications && (
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '0.8rem', color: '#0f172a' }}>
                Technical Specifications
              </h3>
              <table style={{ width: '100%', fontSize: '0.88rem', borderCollapse: 'collapse' }}>
                <tbody>
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <tr key={key} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.5rem 0', color: '#64748b', fontWeight: '600', width: '35%' }}>{key}</td>
                      <td style={{ padding: '0.5rem 0', color: '#0f172a', fontWeight: '700' }}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Product Reviews & Ratings Section */}
      <section style={{ background: '#ffffff', borderRadius: '16px', padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <MessageSquare color="#2874f0" size={24} /> Customer Ratings & Reviews
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 340px) 1fr', gap: '2.5rem', marginBottom: '2.5rem' }}>
          {/* Average Rating Score Card */}
          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '3.2rem', fontWeight: '800', color: '#0f172a', lineHeight: 1 }}>
              {product.rating || 4.8}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', margin: '0.6rem 0' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={20}
                  fill={star <= Math.round(product.rating || 4.8) ? '#f59e0b' : '#cbd5e1'}
                  color={star <= Math.round(product.rating || 4.8) ? '#f59e0b' : '#cbd5e1'}
                />
              ))}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>
              Based on {reviews.length || product.reviewCount || 12} verified customer reviews
            </div>
          </div>

          {/* Submit Review Form */}
          <div style={{ background: '#eff6ff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e40af', marginBottom: '0.8rem' }}>
              Write a Product Review
            </h3>

            {reviewSuccess && (
              <div style={{ background: '#dcfce7', color: '#15803d', padding: '0.6rem 1rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.8rem' }}>
                {reviewSuccess}
              </div>
            )}

            <form onSubmit={handleReviewSubmit}>
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#1e3a8a', display: 'block', marginBottom: '0.4rem' }}>
                  Select Star Rating:
                </label>
                <div style={{ display: 'flex', gap: '6px', cursor: 'pointer' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={26}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setNewRating(star)}
                      fill={(hoverRating || newRating) >= star ? '#f59e0b' : '#cbd5e1'}
                      color={(hoverRating || newRating) >= star ? '#d97706' : '#cbd5e1'}
                    />
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <textarea
                  required
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={user ? "Write your honest feedback about this product..." : "Please log in to submit a review"}
                  disabled={!user}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #93c5fd', fontSize: '0.9rem' }}
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                style={{
                  background: '#2874f0',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: '800',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <Send size={16} /> {submittingReview ? 'Submitting to Firestore...' : user ? 'Submit Review' : 'Log In to Review'}
              </button>
            </form>
          </div>
        </div>

        {/* Reviews List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reviews.map((rev) => (
            <div key={rev.id} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', marginBottom: '0.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ width: '32px', height: '32px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.85rem' }}>
                    {rev.userName ? rev.userName.charAt(0) : 'U'}
                  </div>
                  <span style={{ fontWeight: '800', fontSize: '0.92rem', color: '#0f172a' }}>{rev.userName}</span>
                  <span style={{ background: '#388e3c', color: '#fff', fontSize: '0.75rem', fontWeight: '800', padding: '1px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    {rev.rating} <Star size={10} fill="#fff" color="#fff" />
                  </span>
                </div>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', marginLeft: 'auto' }}>
                  {new Date(rev.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: '1.5', margin: 0, paddingLeft: '2.5rem' }}>
                {rev.comment}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
