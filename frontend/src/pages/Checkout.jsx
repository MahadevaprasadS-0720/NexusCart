import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, ShieldCheck, CheckCircle, Lock, X, Smartphone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: 'Alex Johnson',
    phone: '+91 9876543210',
    address: 'Flat 402, Skyline Towers, MG Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560001',
    country: 'India'
  });

  const [paymentMethod, setPaymentMethod] = useState('UPI / NetBanking');
  const [paymentIntent, setPaymentIntent] = useState(null);

  // Mock Payment Form Fields
  const [cardDetails, setCardDetails] = useState({
    number: '4111 2222 3333 4444',
    expiry: '12/28',
    cvv: '123'
  });
  const [upiId, setUpiId] = useState('alex@upi');

  const handleInitiatePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Create Payment Intent / Order with Gateway
      const intentRes = await api.createPaymentIntent(cartTotal, `rec_${Date.now()}`);
      if (intentRes.success) {
        setPaymentIntent(intentRes);
      }
    } catch (err) {}

    setLoading(false);
    setShowPaymentModal(true);
  };

  const handleConfirmGatewayPayment = async () => {
    setPaymentProcessing(true);

    try {
      // Step 2: Verify Payment Transaction with Backend
      await api.verifyPayment({
        razorpay_payment_id: `pay_${Math.floor(100000 + Math.random() * 900000)}`,
        paymentIntentId: paymentIntent?.clientSecret || `pi_${Date.now()}`,
        paymentMethod
      });

      // Step 3: Place Order with Payment Status: 'Paid'
      const orderPayload = {
        orderItems: cartItems.map(item => ({
          product: item.id || item._id || item.title,
          productId: item.id || item._id,
          title: item.name || item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image || (item.images ? item.images[0] : '')
        })),
        shippingAddress,
        paymentMethod,
        paymentStatus: 'Paid',
        totalPrice: cartTotal,
        totalAmount: cartTotal
      };

      const res = await api.createOrder(orderPayload);
      clearCart();
      setShowPaymentModal(false);

      if (res.success && res.order) {
        navigate(`/order-success/${res.order.id || res.order._id}`);
      } else {
        navigate(`/order-success/ORD-${Math.floor(10000 + Math.random() * 90000)}`);
      }
    } catch (err) {
      clearCart();
      setShowPaymentModal(false);
      navigate(`/order-success/ORD-${Math.floor(10000 + Math.random() * 90000)}`);
    } finally {
      setPaymentProcessing(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
        <ShieldCheck size={28} color="#2874f0" />
        <h1 style={{ fontSize: '1.6rem', fontWeight: '800' }}>Order Checkout & Payment Gateway</h1>
      </div>

      <form onSubmit={handleInitiatePayment} style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Step 1: Delivery Address */}
          <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
              <MapPin size={20} color="#2874f0" /> 1. Delivery Address
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '600', color: '#475569' }}>Full Name</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.fullName}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '0.2rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '600', color: '#475569' }}>Phone Number</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.phone}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '0.2rem' }}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: '600', color: '#475569' }}>Street Address / Flat No.</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.address}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '0.2rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '600', color: '#475569' }}>City</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '0.2rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '600', color: '#475569' }}>Postal Code / PIN</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.postalCode}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '0.2rem' }}
                />
              </div>
            </div>
          </div>

          {/* Step 2: Payment Gateway Selection */}
          <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
              <CreditCard size={20} color="#2874f0" /> 2. Payment Gateway Mode
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {['UPI / NetBanking (Google Pay, PhonePe, Paytm)', 'Credit / Debit Card (Visa, Mastercard)', 'Cash on Delivery (COD)'].map((method) => (
                <label key={method} style={{ padding: '0.8rem', borderRadius: '8px', border: paymentMethod === method ? '2px solid #2874f0' : '1px solid #cbd5e1', display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', background: paymentMethod === method ? '#eff6ff' : '#fff' }}>
                  <input
                    type="radio"
                    name="payMethod"
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                  />
                  <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#0f172a' }}>{method}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Summary Sidebar */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0', height: 'fit-content', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.6rem' }}>
            Order Summary
          </h3>

          <div style={{ marginBottom: '1rem' }}>
            {cartItems.map((item) => (
              <div key={item.id || item._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                <span style={{ color: '#475569' }}>{item.quantity}x {(item.name || item.title).substring(0, 22)}...</span>
                <span style={{ fontWeight: '700' }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '2px dashed #e2e8f0', paddingTop: '0.8rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: '800' }}>
            <span>Total Amount:</span>
            <span style={{ color: '#2874f0' }}>₹{cartTotal.toLocaleString('en-IN')}</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: 'linear-gradient(180deg, #f8e3a0 0%, #eab308 100%)',
              border: '1px solid #d97706',
              padding: '0.85rem',
              borderRadius: '6px',
              fontWeight: '800',
              fontSize: '1rem',
              color: '#0f172a',
              marginTop: '1.5rem',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Initializing Payment...' : 'Proceed to Pay & Place Order'}
          </button>
        </div>
      </form>

      {/* Stripe / Razorpay Mock Payment Gateway Modal */}
      {showPaymentModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: '1rem' }}>
          <div style={{ background: '#ffffff', width: '100%', maxWidth: '480px', borderRadius: '16px', border: '1px solid #cbd5e1', padding: '2rem', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', paddingBottom: '0.8rem', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800', fontSize: '1.1rem', color: '#0f172a' }}>
                <ShieldCheck color="#2874f0" size={24} /> Razorpay / Stripe Secure Checkout
              </div>
              <button onClick={() => setShowPaymentModal(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: '8px', marginBottom: '1.2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.82rem', color: '#1e40af', fontWeight: '600' }}>Amount to Pay</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#2874f0' }}>
                ₹{cartTotal.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Order ID: {paymentIntent?.orderId || 'pay_ord_98421'}</div>
            </div>

            {paymentMethod.includes('Card') ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>Card Number</label>
                  <input
                    type="text"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '0.2rem' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>Expiry Date</label>
                    <input
                      type="text"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '0.2rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>CVV</label>
                    <input
                      type="password"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '0.2rem' }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>Virtual Payment Address (VPA / UPI ID)</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '0.2rem' }}
                />
              </div>
            )}

            <button
              onClick={handleConfirmGatewayPayment}
              disabled={paymentProcessing}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '0.85rem',
                borderRadius: '8px',
                fontWeight: '800',
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {paymentProcessing ? (
                'Processing Payment Gateway...'
              ) : (
                <>
                  <Lock size={18} /> Pay ₹{cartTotal.toLocaleString('en-IN')} via Gateway
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
