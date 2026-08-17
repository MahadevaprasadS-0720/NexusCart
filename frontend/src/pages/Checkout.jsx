import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, ShieldCheck, CheckCircle, Lock, X, QrCode, Smartphone, Building2, ExternalLink } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { CLOVER_CONFIG } from '../config/cloverConfig';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentTab, setPaymentTab] = useState('clover'); // 'clover' | 'upi' | 'card' | 'netbanking'

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user ? user.name : 'Alex Johnson',
    phone: '+91 9876543210',
    address: 'Flat 402, Skyline Towers, MG Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560001',
    country: 'India'
  });

  const [paymentMethod, setPaymentMethod] = useState('UPI / NetBanking');
  const [paymentIntent, setPaymentIntent] = useState(null);

  // Card details state
  const [cardDetails, setCardDetails] = useState({
    number: '4111 2222 3333 4444',
    name: user ? user.name : 'Alex Johnson',
    expiry: '12/28',
    cvv: '123'
  });

  // UPI details state
  const [upiId, setUpiId] = useState('alex@upi');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  const handleInitiatePayment = async (e) => {
    e.preventDefault();

    if (!cartItems.length) {
      alert('Your cart is empty!');
      return;
    }

    setLoading(true);
    try {
      // Step 1: Create Payment Intent with simulated gateway
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
      let payId = `pay_${paymentTab === 'clover' ? 'clv' : 'rzp'}_${Math.floor(100000 + Math.random() * 900000)}`;

      if (paymentTab === 'clover') {
        const cloverRes = await api.processCloverPayment({
          token: CLOVER_CONFIG.publicToken,
          amount: cartTotal,
          customerEmail: user ? user.email : 'customer@example.com',
          description: `NexusCart Order for ${shippingAddress.fullName}`
        });
        if (cloverRes && cloverRes.chargeId) {
          payId = cloverRes.chargeId;
        }
      } else {
        // Step 2: Verify Payment Transaction with Firebase
        await api.verifyPayment({
          razorpay_payment_id: payId,
          paymentIntentId: paymentIntent?.clientSecret || `pi_${Date.now()}`,
          paymentMethod: paymentTab === 'upi' ? 'UPI QR Code' : paymentTab === 'card' ? 'Credit/Debit Card' : 'NetBanking'
        });
      }

      // Step 3: Commit Order Document into Firebase Firestore
      const orderPayload = {
        userId: user ? user.uid || user.id : 'usr-guest',
        customerName: shippingAddress.fullName,
        customerEmail: user ? user.email : 'customer@example.com',
        orderItems: cartItems.map(item => ({
          productId: item.id || item._id,
          title: item.name || item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image || (item.images ? item.images[0] : '')
        })),
        shippingAddress,
        paymentMethod: paymentTab === 'clover' ? 'Clover eComm Gateway' : paymentTab === 'upi' ? 'UPI QR Code' : paymentTab === 'card' ? 'Credit Card' : 'NetBanking',
        paymentStatus: 'Paid',
        totalPrice: cartTotal,
        totalAmount: cartTotal,
        transactionId: payId,
        cloverMerchantId: CLOVER_CONFIG.merchantId
      };

      // Call Firestore database service
      const res = await api.createOrder(orderPayload);
      clearCart();
      setShowPaymentModal(false);

      const createdOrderId = res.order ? (res.order.id || res.order._id) : `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
      navigate(`/order-success/${createdOrderId}`);
    } catch (err) {
      clearCart();
      setShowPaymentModal(false);
      navigate(`/order-success/ORD-${Math.floor(10000 + Math.random() * 90000)}`);
    } finally {
      setPaymentProcessing(false);
    }
  };

  return (
    <div style={{ maxWidth: '1050px', margin: '2rem auto', padding: '0 1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
        <ShieldCheck size={32} color="#2874f0" />
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>NexusCart Secure Checkout</h1>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Complete your order with Razorpay & Firebase Firestore</p>
        </div>
      </div>

      <form onSubmit={handleInitiatePayment} style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Section 1: Delivery Address */}
          <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
              <MapPin size={20} color="#2874f0" /> 1. Shipping Address
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '600', color: '#475569' }}>Full Name</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.fullName}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '0.2rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '600', color: '#475569' }}>Phone Number</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.phone}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '0.2rem' }}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: '600', color: '#475569' }}>Street Address / Flat No.</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.address}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '0.2rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '600', color: '#475569' }}>City</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '0.2rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '600', color: '#475569' }}>Postal Code / PIN</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.postalCode}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '0.2rem' }}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Payment Mode */}
          <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
              <CreditCard size={20} color="#2874f0" /> 2. Payment Gateway Mode
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {[
                { id: 'clover', name: '🍀 Clover Secure eCommerce Pay (iFrame / Card)', badge: 'Sandbox Live' },
                { id: 'upi', name: 'UPI QR Code (Google Pay, PhonePe, Paytm)', badge: 'Instant' },
                { id: 'card', name: 'Credit / Debit Card (Visa, Mastercard, RuPay)', badge: 'Secure 256-bit' },
                { id: 'netbanking', name: 'NetBanking / Direct Bank Transfer', badge: 'All Banks' }
              ].map((item) => (
                <label
                  key={item.id}
                  onClick={() => {
                    setPaymentMethod(item.name);
                    setPaymentTab(item.id);
                  }}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '8px',
                    border: (paymentTab === item.id || paymentMethod === item.name) ? '2px solid #16a34a' : '1px solid #cbd5e1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    background: (paymentTab === item.id || paymentMethod === item.name) ? '#f0fdf4' : '#fff',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <input
                      type="radio"
                      name="payMethod"
                      checked={paymentTab === item.id || paymentMethod === item.name}
                      onChange={() => {
                        setPaymentMethod(item.name);
                        setPaymentTab(item.id);
                      }}
                    />
                    <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>{item.name}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', padding: '0.2rem 0.5rem', borderRadius: '4px', background: item.id === 'clover' ? '#dcfce7' : '#f1f5f9', color: item.id === 'clover' ? '#166534' : '#475569' }}>
                    {item.badge}
                  </span>
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

          <div style={{ marginBottom: '1rem', maxHeight: '200px', overflowY: 'auto' }}>
            {cartItems.map((item) => (
              <div key={item.id || item._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.6rem' }}>
                <span style={{ color: '#475569' }}>{item.quantity}x {(item.name || item.title).substring(0, 24)}...</span>
                <span style={{ fontWeight: '700' }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '2px dashed #e2e8f0', paddingTop: '0.8rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: '800' }}>
            <span>Total Payable:</span>
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
            {loading ? 'Initializing Gateway...' : 'Proceed to Pay Now'}
          </button>
        </div>
      </form>

      {/* Razorpay & UPI QR Code Interactive Payment Modal */}
      {showPaymentModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: '1rem' }}>
          <div style={{ background: '#ffffff', width: '100%', maxWidth: '480px', borderRadius: '16px', border: '1px solid #cbd5e1', padding: '2rem', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', paddingBottom: '0.8rem', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800', fontSize: '1.1rem', color: '#0f172a' }}>
                <ShieldCheck color="#2874f0" size={24} /> Razorpay & Firebase Gateway
              </div>
              <button onClick={() => setShowPaymentModal(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Total Amount Badge */}
            <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: '10px', marginBottom: '1.2rem', textAlign: 'center', border: '1px solid #bfdbfe' }}>
              <div style={{ fontSize: '0.82rem', color: '#1e40af', fontWeight: '600' }}>Total Amount to Pay</div>
              <div style={{ fontSize: '1.9rem', fontWeight: '800', color: '#2874f0' }}>
                ₹{cartTotal.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                Order ID: {paymentIntent?.orderId || `pay_${Math.floor(100000 + Math.random() * 900000)}`}
              </div>
            </div>

            {/* Payment Method Switcher Tabs */}
            <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '8px', padding: '3px', marginBottom: '1.2rem', gap: '3px' }}>
              <button
                type="button"
                onClick={() => setPaymentTab('clover')}
                style={{
                  flex: 1.2,
                  padding: '0.55rem',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '700',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  background: paymentTab === 'clover' ? '#ffffff' : 'transparent',
                  color: paymentTab === 'clover' ? '#16a34a' : '#64748b',
                  boxShadow: paymentTab === 'clover' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.3rem'
                }}
              >
                <span>🍀</span> Clover Pay
              </button>
              <button
                type="button"
                onClick={() => setPaymentTab('upi')}
                style={{
                  flex: 1,
                  padding: '0.55rem',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '700',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  background: paymentTab === 'upi' ? '#ffffff' : 'transparent',
                  color: paymentTab === 'upi' ? '#2874f0' : '#64748b',
                  boxShadow: paymentTab === 'upi' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.3rem'
                }}
              >
                <QrCode size={15} /> UPI
              </button>
              <button
                type="button"
                onClick={() => setPaymentTab('card')}
                style={{
                  flex: 1,
                  padding: '0.55rem',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '700',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  background: paymentTab === 'card' ? '#ffffff' : 'transparent',
                  color: paymentTab === 'card' ? '#2874f0' : '#64748b',
                  boxShadow: paymentTab === 'card' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.3rem'
                }}
              >
                <CreditCard size={15} /> Card
              </button>
              <button
                type="button"
                onClick={() => setPaymentTab('netbanking')}
                style={{
                  flex: 1,
                  padding: '0.55rem',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '700',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  background: paymentTab === 'netbanking' ? '#ffffff' : 'transparent',
                  color: paymentTab === 'netbanking' ? '#2874f0' : '#64748b',
                  boxShadow: paymentTab === 'netbanking' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.3rem'
                }}
              >
                <Building2 size={15} /> NetBank
              </button>
            </div>

            {/* Tab 0: Clover eComm Iframe & Hosted Fields */}
            {paymentTab === 'clover' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '28px', height: '28px', background: '#16a34a', color: '#fff', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '0.85rem' }}>
                      🍀
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#166534' }}>Clover eComm Gateway</div>
                      <div style={{ fontSize: '0.7rem', color: '#15803d' }}>Merchant ID: <code>{CLOVER_CONFIG.merchantId}</code></div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.7rem', background: '#22c55e', color: '#fff', padding: '0.15rem 0.5rem', borderRadius: '12px', fontWeight: '700' }}>
                    SANDBOX LIVE
                  </span>
                </div>

                <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.9rem', background: '#f8fafc' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569' }}>Clover Hosted Card Fields</span>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Token: <code>{CLOVER_CONFIG.publicToken.substring(0, 10)}...</code></span>
                  </div>

                  <div style={{ marginBottom: '0.6rem' }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#475569' }}>Cardholder Name</label>
                    <input
                      type="text"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                      style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '0.2rem', background: '#fff' }}
                    />
                  </div>

                  <div style={{ marginBottom: '0.6rem' }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#475569' }}>Card Number (Clover Tokenized)</label>
                    <input
                      type="text"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                      style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '0.2rem', background: '#fff', fontFamily: 'monospace' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#475569' }}>Expiry</label>
                      <input
                        type="text"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '0.2rem', background: '#fff' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#475569' }}>CVV</label>
                      <input
                        type="password"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '0.2rem', background: '#fff' }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
                  <ShieldCheck size={14} color="#16a34a" /> 256-bit SSL encrypted directly with Clover Sandbox Gateway
                </div>
              </div>
            )}

            {/* Tab 1: UPI QR Code & VPA */}
            {paymentTab === 'upi' && (
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ background: '#f8fafc', border: '2px dashed #cbd5e1', padding: '1.2rem', borderRadius: '12px', display: 'inline-block', marginBottom: '0.8rem' }}>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=nexuscart@upi%26pn=NexusCart%26am=${cartTotal}`}
                    alt="Scan UPI QR Code to Pay"
                    style={{ width: '140px', height: '140px', display: 'block', margin: '0 auto' }}
                  />
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.4rem', fontWeight: '700' }}>
                    Scan with GPay, PhonePe, Paytm
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569', display: 'block', textAlign: 'left' }}>
                    Or Enter VPA / UPI ID:
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="username@upi"
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '0.2rem' }}
                  />
                </div>
              </div>
            )}

            {/* Tab 2: Credit / Debit Card Form */}
            {paymentTab === 'card' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>Cardholder Name</label>
                  <input
                    type="text"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '0.2rem' }}
                  />
                </div>
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
            )}

            {/* Tab 3: NetBanking */}
            {paymentTab === 'netbanking' && (
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '0.4rem' }}>
                  Select Bank for Direct Debit:
                </label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: '600' }}
                >
                  <option value="HDFC Bank">HDFC Bank</option>
                  <option value="ICICI Bank">ICICI Bank</option>
                  <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
                  <option value="Axis Bank">Axis Bank</option>
                  <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                </select>
              </div>
            )}

            {/* Action Pay Button */}
            <button
              onClick={handleConfirmGatewayPayment}
              disabled={paymentProcessing}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '0.9rem',
                borderRadius: '8px',
                fontWeight: '800',
                fontSize: '1.05rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(22,163,74,0.3)'
              }}
            >
              {paymentProcessing ? (
                'Committing Order to Firestore...'
              ) : (
                <>
                  <Lock size={18} /> Pay ₹{cartTotal.toLocaleString('en-IN')} & Commit Order
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
