import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { api } from '../services/api';
import { initialOrders } from '../data/mockData';

const MyOrders = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.getMyOrders();
      if (res.success && res.orders.length > 0) {
        setOrders(res.orders);
      }
    } catch (err) {
      setOrders(initialOrders);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1.5rem' }}>
      <h1 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '1.5rem', color: '#0f172a' }}>
        My Orders & Past Purchases ({orders.length})
      </h1>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>Loading your orders...</div>
      ) : orders.length === 0 ? (
        <div style={{ background: '#ffffff', padding: '3rem', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
          <Package size={48} color="#94a3b8" style={{ margin: '0 auto 1rem auto' }} />
          <h3>No Past Orders Found</h3>
          <p style={{ color: '#64748b' }}>Your completed orders will appear here for easy tracking.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order) => {
            const orderId = order.id || order._id;
            const items = order.orderItems || order.items || [];
            const total = order.totalPrice || order.totalAmount || 0;
            const status = order.orderStatus || 'Pending';

            return (
              <div key={orderId} style={{ background: '#ffffff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>ORDER DATE</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>
                      {new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>TOTAL AMOUNT</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#2874f0' }}>
                      ₹{total.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>ORDER ID</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>{orderId}</div>
                  </div>

                  <div className={`status-badge ${status.toLowerCase()}`}>
                    {status}
                  </div>
                </div>

                {/* Items List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'}
                        alt={item.title || item.product}
                        style={{ width: '60px', height: '60px', objectFit: 'contain', background: '#f8fafc', borderRadius: '6px', padding: '4px' }}
                      />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' }}>
                          {item.title || item.product}
                        </h4>
                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                          Qty: {item.quantity} • Price: ₹{item.price.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  ))}
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
