import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartDrawer = () => {
  const { isCartDrawerOpen, setIsCartDrawerOpen, cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  if (!isCartDrawerOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', justifyContent: 'flex-end' }}>
      {/* Backdrop */}
      <div
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }}
        onClick={() => setIsCartDrawerOpen(false)}
      />

      {/* Drawer Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '420px',
          height: '100%',
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-4px 0 25px rgba(0,0,0,0.15)',
          zIndex: 2010
        }}
      >
        {/* Header */}
        <div style={{ padding: '1.2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#131921', color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}>
            <ShoppingBag size={20} color="#febd69" /> Your Cart ({cartItems.length})
          </div>
          <button onClick={() => setIsCartDrawerOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {/* Cart Item List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
              <ShoppingBag size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.4 }} />
              <p style={{ fontWeight: '600' }}>Your cart is empty!</p>
              <p style={{ fontSize: '0.85rem' }}>Explore deals and add products to start shopping.</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} style={{ display: 'flex', gap: '1rem', padding: '0.8rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <img
                  src={item.images && item.images[0] ? item.images[0] : item.image}
                  alt={item.title}
                  style={{ width: '64px', height: '64px', objectFit: 'contain', background: '#f8fafc', borderRadius: '6px', padding: '4px' }}
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: '600', color: '#0f172a', lineHeight: '1.3' }}>{item.title}</h4>
                  <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0f172a', margin: '0.3rem 0' }}>
                    ₹{item.price.toLocaleString('en-IN')}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                      <button onClick={() => updateQuantity(item.id, -1)} style={{ padding: '2px 6px', border: 'none', background: '#f1f5f9' }}>
                        <Minus size={12} />
                      </button>
                      <span style={{ padding: '0 8px', fontSize: '0.82rem', fontWeight: '700' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} style={{ padding: '2px 6px', border: 'none', background: '#f1f5f9' }}>
                        <Plus size={12} />
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Subtotal & Checkout */}
        {cartItems.length > 0 && (
          <div style={{ padding: '1.2rem', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontWeight: '800', fontSize: '1.1rem' }}>
              <span>Subtotal:</span>
              <span style={{ color: '#2874f0' }}>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <button
              onClick={() => {
                setIsCartDrawerOpen(false);
                navigate('/cart');
              }}
              style={{
                width: '100%',
                background: 'linear-gradient(180deg, #f8e3a0 0%, #eab308 100%)',
                border: '1px solid #d97706',
                padding: '0.75rem',
                borderRadius: '6px',
                fontWeight: '800',
                fontSize: '0.95rem',
                color: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer'
              }}
            >
              View Full Cart & Checkout <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
