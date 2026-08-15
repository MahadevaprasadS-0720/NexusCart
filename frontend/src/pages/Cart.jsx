import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Tag, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  // Coupon Code State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState({ type: '', text: '' });

  // Valid Promotional Coupons Database
  const validCoupons = {
    'SAVE20': { code: 'SAVE20', percent: 20, desc: '20% Instant Discount on Total Order' },
    'NEXUS10': { code: 'NEXUS10', percent: 10, desc: '10% NexusCart Member Offer' },
    'FLAT500': { code: 'FLAT500', flat: 500, desc: 'Flat ₹500 Instant Discount' },
    'FREESHIP': { code: 'FREESHIP', freeShipping: true, desc: 'Free Express Shipping' }
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const cleanCode = couponCode.trim().toUpperCase();

    if (!cleanCode) {
      setCouponMessage({ type: 'error', text: 'Please enter a valid coupon code.' });
      return;
    }

    if (validCoupons[cleanCode]) {
      const coupon = validCoupons[cleanCode];
      setAppliedCoupon(coupon);
      setCouponMessage({
        type: 'success',
        text: `Coupon '${coupon.code}' applied! ${coupon.desc}`
      });
    } else {
      setCouponMessage({
        type: 'error',
        text: 'Invalid Coupon Code. Try "SAVE20", "NEXUS10", "FLAT500", or "FREESHIP"'
      });
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponMessage({ type: '', text: '' });
  };

  // Calculate Discounts & Totals
  const subtotal = cartTotal;
  let discountAmount = 0;

  if (appliedCoupon) {
    if (appliedCoupon.percent) {
      discountAmount = Math.round((subtotal * appliedCoupon.percent) / 100);
    } else if (appliedCoupon.flat) {
      discountAmount = Math.min(subtotal, appliedCoupon.flat);
    }
  }

  const isFreeShipping = subtotal > 499 || (appliedCoupon && appliedCoupon.freeShipping);
  const shippingFee = subtotal === 0 || isFreeShipping ? 0 : 99;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  if (cartItems.length === 0) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '3rem 2rem', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
        <ShoppingBag size={54} color="#94a3b8" style={{ margin: '0 auto 1.2rem auto' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.4rem' }}>Your NexusCart is Empty</h2>
        <p style={{ fontSize: '0.92rem', color: '#64748b', marginBottom: '1.8rem' }}>
          Explore our trending electronics, mobiles, and fashion catalog to add items to your cart!
        </p>
        <Link
          to="/"
          style={{
            background: '#2874f0',
            color: '#ffffff',
            padding: '0.85rem 1.8rem',
            borderRadius: '8px',
            fontWeight: '800',
            fontSize: '0.95rem',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          Start Shopping Deals <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1.5rem' }}>
      <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <ShoppingBag color="#2874f0" size={28} /> Shopping Cart ({cartItems.length} Items)
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem' }}>
        {/* Left Column: Cart Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cartItems.map((item) => (
            <div key={item.id || item._id} style={{ background: '#ffffff', borderRadius: '12px', padding: '1.2rem', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: '90px 1fr auto', gap: '1.2rem', alignItems: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
              <img
                src={item.image || (item.images ? item.images[0] : '')}
                alt={item.name || item.title}
                style={{ width: '90px', height: '90px', objectFit: 'contain', background: '#f8fafc', borderRadius: '8px', padding: '4px' }}
              />

              <div>
                <Link to={`/product/${item.id || item._id}`} style={{ textDecoration: 'none', color: '#0f172a', fontWeight: '700', fontSize: '0.98rem', lineHeight: '1.4' }}>
                  {item.name || item.title}
                </Link>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                  Category: {item.category || 'General'} • In Stock
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginTop: '0.6rem' }}>
                  ₹{item.price.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Quantity controls & Delete */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden' }}>
                  <button
                    onClick={() => updateQuantity(item.id || item._id, item.quantity - 1)}
                    style={{ background: '#f1f5f9', border: 'none', padding: '6px 10px', cursor: 'pointer' }}
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ padding: '0 12px', fontWeight: '800', fontSize: '0.9rem' }}>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id || item._id, item.quantity + 1)}
                    style={{ background: '#f1f5f9', border: 'none', padding: '6px 10px', cursor: 'pointer' }}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.id || item._id)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: '700' }}
                >
                  <Trash2 size={16} /> Remove
                </button>
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
            <button
              onClick={clearCart}
              style={{ background: 'none', border: '1px solid #cbd5e1', padding: '0.5rem 1rem', borderRadius: '6px', color: '#64748b', fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer' }}
            >
              Clear Entire Cart
            </button>
            <Link to="/" style={{ color: '#2874f0', fontWeight: '700', textDecoration: 'none', fontSize: '0.88rem' }}>
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary & Coupon Code */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          
          {/* Coupon Code Section */}
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '1.2rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '0.98rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Tag size={18} color="#2874f0" /> Apply Coupon Code
            </h3>

            {appliedCoupon ? (
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#1e40af', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <CheckCircle2 size={16} /> {appliedCoupon.code} Applied
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#3b82f6', marginTop: '2px' }}>{appliedCoupon.desc}</div>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '800' }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter Code (e.g. SAVE20)"
                    style={{ flex: 1, padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: '700', textTransform: 'uppercase' }}
                  />
                  <button
                    type="submit"
                    style={{ background: '#2874f0', color: '#ffffff', border: 'none', padding: '0.6rem 1rem', borderRadius: '6px', fontWeight: '800', fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    Apply
                  </button>
                </div>
              </form>
            )}

            {/* Toast Message */}
            {couponMessage.text && !appliedCoupon && (
              <div style={{ fontSize: '0.78rem', marginTop: '0.5rem', fontWeight: '700', color: couponMessage.type === 'error' ? '#ef4444' : '#16a34a', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                {couponMessage.type === 'error' ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />} {couponMessage.text}
              </div>
            )}

            {/* Available Promo Codes Banner */}
            <div style={{ marginTop: '0.8rem', paddingTop: '0.8rem', borderTop: '1px dashed #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', marginBottom: '0.4rem' }}>Available Coupons:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {['SAVE20 (20% OFF)', 'NEXUS10 (10% OFF)', 'FLAT500 (₹500 OFF)', 'FREESHIP'].map((c) => (
                  <span
                    key={c}
                    onClick={() => { setCouponCode(c.split(' ')[0]); }}
                    style={{ background: '#f1f5f9', border: '1px border #cbd5e1', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '700', color: '#334155', cursor: 'pointer' }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Price Breakdown Sidebar */}
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.6rem' }}>
              Price Details
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#475569' }}>Items Subtotal:</span>
                <span style={{ fontWeight: '700' }}>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', fontWeight: '700' }}>
                  <span>Coupon Discount ({appliedCoupon?.code}):</span>
                  <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#475569' }}>Delivery Charges:</span>
                <span style={{ fontWeight: '700', color: isFreeShipping ? '#16a34a' : '#0f172a' }}>
                  {isFreeShipping ? 'FREE Delivery' : `₹${shippingFee}`}
                </span>
              </div>

              <div style={{ borderTop: '2px dashed #e2e8f0', paddingTop: '0.8rem', marginTop: '0.4rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: '800' }}>
                <span>Total Payable:</span>
                <span style={{ color: '#2874f0' }}>₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>

              {discountAmount > 0 && (
                <div style={{ background: '#dcfce7', color: '#15803d', padding: '0.5rem', borderRadius: '6px', textAlign: 'center', fontWeight: '800', fontSize: '0.8rem', marginTop: '0.4rem' }}>
                  You are saving ₹{discountAmount.toLocaleString('en-IN')} on this order! 🎉
                </div>
              )}
            </div>

            <button
              onClick={() => navigate('/checkout')}
              style={{
                width: '100%',
                background: 'linear-gradient(180deg, #f8e3a0 0%, #eab308 100%)',
                border: '1px solid #d97706',
                padding: '0.85rem',
                borderRadius: '8px',
                fontWeight: '800',
                fontSize: '1rem',
                color: '#0f172a',
                marginTop: '1.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
