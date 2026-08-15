import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Truck, Package, ArrowRight } from 'lucide-react';

const OrderSuccessPage = () => {
  const { orderId } = useParams();

  return (
    <div style={{ maxWidth: '700px', margin: '4rem auto', background: '#fff', borderRadius: '16px', padding: '3rem', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
      <div style={{ width: '80px', height: '80px', background: '#dcfce7', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
        <CheckCircle size={48} />
      </div>

      <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.4rem' }}>
        Order Confirmed!
      </h1>
      <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '1.5rem' }}>
        Thank you for your purchase. Your order ID is <strong style={{ color: '#2874f0' }}>{orderId || 'ORD-98421'}</strong>
      </p>

      {/* Progress tracker timeline */}
      <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1.5rem', margin: '2rem 0', border: '1px solid #e2e8f0' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#334155', marginBottom: '1.2rem', textAlign: 'left' }}>
          Estimated Delivery: Tomorrow by 8 PM
        </h4>

        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
          <div style={{ textAlign: 'center', zIndex: 2 }}>
            <div style={{ width: '36px', height: '36px', background: '#16a34a', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.4rem auto' }}>
              <Package size={18} />
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#16a34a' }}>Placed</span>
          </div>

          <div style={{ textAlign: 'center', zIndex: 2 }}>
            <div style={{ width: '36px', height: '36px', background: '#3b82f6', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.4rem auto' }}>
              <Package size={18} />
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#3b82f6' }}>Processing</span>
          </div>

          <div style={{ textAlign: 'center', zIndex: 2 }}>
            <div style={{ width: '36px', height: '36px', background: '#e2e8f0', color: '#94a3b8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.4rem auto' }}>
              <Truck size={18} />
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: '600', color: '#94a3b8' }}>Shipped</span>
          </div>

          <div style={{ textAlign: 'center', zIndex: 2 }}>
            <div style={{ width: '36px', height: '36px', background: '#e2e8f0', color: '#94a3b8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.4rem auto' }}>
              <CheckCircle size={18} />
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: '600', color: '#94a3b8' }}>Delivered</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <Link to="/orders" style={{ background: '#0f172a', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '0.9rem' }}>
          View My Orders
        </Link>
        <Link to="/" className="btn-primary" style={{ display: 'inline-flex' }}>
          Continue Shopping <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
