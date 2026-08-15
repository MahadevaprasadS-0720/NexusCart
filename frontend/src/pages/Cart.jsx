import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShieldCheck, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, totalDiscount } = useCart();
  const navigate = useNavigate();

  const deliveryFee = cartTotal > 500 || cartItems.length === 0 ? 0 : 49;
  const finalTotal = cartTotal + deliveryFee;

  if (cartItems.length === 0) {
    return (
      <div style={{ maxWidth: '800px', margin: '4rem auto', background: '#ffffff', borderRadius: '12px', padding: '3rem', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
        <ShoppingBag size={64} color="#94a3b8" style={{ margin: '0 auto 1.5rem auto' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Your Shopping Cart is Empty</h2>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>Explore top deals on Mobiles, Electronics, Fashion & Home Appliances.</p>
        <Link to="/" className="btn-primary" style={{ display: 'inline-flex' }}>
          Continue Shopping <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1240px', margin: '2rem auto', padding: '0 1.5rem' }}>
      <h1 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '1.5rem', color: '#0f172a' }}>
        Shopping Cart ({cartItems.length} items)
      </h1>

      <div className="cart-layout">
        {/* Left: Items List */}
        <div className="cart-items-card">
          {cartItems.map((item) => (
            <div key={item.id || item._id} className="cart-item-row">
              <img
                src={item.image || (item.images ? item.images[0] : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80')}
                alt={item.name || item.title}
                className="cart-item-img"
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.4rem' }}>
                  {item.name || item.title}
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: '600', marginBottom: '0.6rem' }}>
                  In Stock • Eligible for Free Delivery
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden' }}>
                    <button onClick={() => updateQuantity(item.id || item._id, -1)} style={{ padding: '4px 10px', border: 'none', background: '#f1f5f9', cursor: 'pointer' }}>
                      <Minus size={14} />
                    </button>
                    <span style={{ padding: '0 14px', fontWeight: '800', fontSize: '0.95rem' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id || item._id, 1)} style={{ padding: '4px 10px', border: 'none', background: '#f1f5f9', cursor: 'pointer' }}>
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id || item._id)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <Trash2 size={16} /> Remove Item
                  </button>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </div>
                {item.originalPrice && item.originalPrice > item.price && (
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                    ₹{(item.originalPrice * item.quantity).toLocaleString('en-IN')}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right: Summary */}
        <div className="cart-summary-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.2rem', paddingBottom: '0.6rem', borderBottom: '1px solid #e2e8f0' }}>
            Price Breakdown
          </h3>

          <div className="summary-row">
            <span>Price ({cartItems.length} items)</span>
            <span>₹{(cartTotal + totalDiscount).toLocaleString('en-IN')}</span>
          </div>

          <div className="summary-row" style={{ color: '#16a34a' }}>
            <span>Discount Savings</span>
            <span>- ₹{totalDiscount.toLocaleString('en-IN')}</span>
          </div>

          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>{deliveryFee === 0 ? <strong style={{ color: '#16a34a' }}>FREE</strong> : `₹${deliveryFee}`}</span>
          </div>

          <div className="summary-row total">
            <span>Total Payable Price</span>
            <span style={{ color: '#2874f0' }}>₹{finalTotal.toLocaleString('en-IN')}</span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            style={{
              width: '100%',
              background: 'linear-gradient(180deg, #f8e3a0 0%, #eab308 100%)',
              border: '1px solid #d97706',
              padding: '0.8rem',
              borderRadius: '6px',
              fontWeight: '800',
              fontSize: '1rem',
              color: '#0f172a',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '1rem'
            }}
          >
            Proceed to Checkout <ArrowRight size={18} />
          </button>

          <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', marginTop: '1rem' }}>
            <ShieldCheck size={14} color="#16a34a" /> 100% Purchase Protection
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
