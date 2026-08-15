import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';

const OrderSuccessPage = () => {
  const { orderId } = useParams();

  return (
    <div style={{ maxWidth: '640px', margin: '4rem auto', padding: '2.5rem', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', textAlign: 'center' }}>
      <div style={{ width: '80px', height: '80px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
        <CheckCircle2 size={48} color="#16a34a" />
      </div>

      <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.4rem' }}>
        Payment Authorized & Order Confirmed!
      </h1>
      <p style={{ fontSize: '0.95rem', color: '#64748b', marginBottom: '1.5rem' }}>
        Your transaction was verified and your order has been safely committed to Cloud Firestore.
      </p>

      <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '1.2rem', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>FIRESTORE ORDER ID</div>
        <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#2874f0', marginTop: '2px' }}>
          {orderId || 'ORD-98421'}
        </div>
        <div style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: '700', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
          <ShieldCheck size={16} /> Payment Status: Paid (Simulated Razorpay / UPI Gateway)
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link
          to="/orders"
          style={{
            background: '#2874f0',
            color: '#ffffff',
            padding: '0.75rem 1.4rem',
            borderRadius: '8px',
            fontWeight: '700',
            textDecoration: 'none',
            fontSize: '0.92rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Package size={18} /> View My Orders
        </Link>
        <Link
          to="/"
          style={{
            background: '#f1f5f9',
            color: '#0f172a',
            padding: '0.75rem 1.4rem',
            borderRadius: '8px',
            fontWeight: '700',
            textDecoration: 'none',
            fontSize: '0.92rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            border: '1px solid #cbd5e1'
          }}
        >
          <ShoppingBag size={18} /> Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
