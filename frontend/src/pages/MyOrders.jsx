import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle2, Clock, MapPin, ShieldCheck, ChevronRight, Calendar } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { initialOrders } from '../data/mockData';

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Delivery Progress Tracker Lifecycle Steps
  const trackingSteps = [
    { key: 'placed', label: 'Order Placed', icon: Package },
    { key: 'shipped', label: 'Shipped', icon: Truck },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: MapPin },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle2 }
  ];

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const userId = user ? (user.uid || user.id) : null;
      const res = await api.getUserOrders(userId);

      if (res.success && res.orders && res.orders.length) {
        setOrders(res.orders);
      } else {
        setOrders(initialOrders);
      }
    } catch (err) {
      setOrders(initialOrders);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to calculate active step index (0 to 3)
  const getActiveStepIndex = (status = '') => {
    const s = status.toLowerCase();
    if (s.includes('delivered')) return 3;
    if (s.includes('out') || s.includes('delivery')) return 2;
    if (s.includes('shipped') || s.includes('processing')) return 1;
    return 0; // 'Pending' or 'Order Placed'
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '900px', margin: '4rem auto', textAlign: 'center', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', color: '#64748b' }}>Fetching your NexusCart orders from Firestore...</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '950px', margin: '2.5rem auto', padding: '0 1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Package color="#2874f0" size={28} /> My Orders ({orders.length})
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
            Track real-time delivery progress and view purchase history
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
          <Package size={50} color="#94a3b8" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>No past orders found</h3>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.4rem' }}>
            Looks like you haven't placed any orders on NexusCart yet.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {orders.map((ord) => {
            const currentStepIdx = getActiveStepIndex(ord.orderStatus);
            const orderItems = ord.orderItems || ord.items || [];
            const shipping = ord.shippingAddress || {};

            return (
              <div
                key={ord.id || ord._id}
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                  overflow: 'hidden'
                }}
              >
                {/* Order Header Info Bar */}
                <div style={{ background: '#f8fafc', padding: '1.2rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '700' }}>FIRESTORE ORDER ID</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#2874f0' }}>{ord.id || ord._id}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '700' }}>ORDER DATE</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>
                      {new Date(ord.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '700' }}>TOTAL AMOUNT</div>
                    <div style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a' }}>
                      ₹{(ord.totalPrice || ord.totalAmount || 0).toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div>
                    <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.78rem', fontWeight: '800', padding: '4px 10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldCheck size={14} /> Paid ({ord.paymentMethod || 'UPI'})
                    </span>
                  </div>
                </div>

                {/* VISUAL PROGRESS STEP INDICATOR */}
                <div style={{ padding: '2rem 1.5rem 1.5rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Truck size={18} color="#2874f0" /> Delivery Status: <span style={{ color: '#2874f0' }}>{ord.orderStatus || 'Order Placed'}</span>
                  </div>

                  {/* Horizontal Step Tracker */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', maxWidth: '750px', margin: '0 auto' }}>
                    {/* Background Progress Bar Line */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '20px',
                        left: '10%',
                        right: '10%',
                        height: '4px',
                        background: '#e2e8f0',
                        zIndex: 1
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${(currentStepIdx / 3) * 100}%`,
                          background: '#16a34a',
                          transition: 'width 0.4s ease'
                        }}
                      />
                    </div>

                    {/* 4 Tracker Step Points */}
                    {trackingSteps.map((step, idx) => {
                      const isDone = idx <= currentStepIdx;
                      const isCurrent = idx === currentStepIdx;
                      const IconComp = step.icon;

                      return (
                        <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, position: 'relative' }}>
                          <div
                            style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: '50%',
                              background: isDone ? '#16a34a' : '#ffffff',
                              border: isDone ? '2px solid #16a34a' : '2px solid #cbd5e1',
                              color: isDone ? '#ffffff' : '#94a3b8',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: '800',
                              boxShadow: isCurrent ? '0 0 0 4px rgba(22,163,74,0.2)' : 'none',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            <IconComp size={20} />
                          </div>
                          <span style={{ fontSize: '0.8rem', fontWeight: isDone ? '800' : '600', color: isDone ? '#0f172a' : '#94a3b8', marginTop: '0.5rem', textAlign: 'center' }}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Order Items & Shipping Address Details */}
                <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem' }}>
                  {/* Item List */}
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#475569', marginBottom: '0.8rem', textTransform: 'uppercase' }}>
                      Items in this Order
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                      {orderItems.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <img
                            src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'}
                            alt={item.title}
                            style={{ width: '56px', height: '56px', objectFit: 'contain', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#0f172a' }}>{item.title}</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Qty: {item.quantity || 1} • ₹{(item.price || 0).toLocaleString('en-IN')}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#475569', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <MapPin size={16} color="#2874f0" /> Delivery Address
                    </h4>
                    <div style={{ fontSize: '0.82rem', color: '#334155', lineHeight: '1.5' }}>
                      <div style={{ fontWeight: '800', color: '#0f172a' }}>{shipping.fullName || 'Customer'}</div>
                      <div>{shipping.address}</div>
                      <div>{shipping.city}, {shipping.postalCode}</div>
                      <div style={{ marginTop: '0.4rem', color: '#64748b' }}>Phone: {shipping.phone || '+91 9876543210'}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
