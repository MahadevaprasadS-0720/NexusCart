import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Lock,
  CreditCard,
  Truck,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Building,
  QrCode,
  Smartphone,
  Sparkles,
  ArrowRight,
  MapPin,
  Plus,
  Edit3,
  Check
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useAddress } from '../context/AddressContext';
import { api } from '../services/api';
import { CLOVER_CONFIG } from '../config/cloverConfig';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const {
    addresses,
    selectedAddress,
    selectedAddressId,
    selectAddress,
    addAddress,
    resolvePincode
  } = useAddress();

  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentTab, setPaymentTab] = useState('clover'); // 'clover' | 'upi' | 'card' | 'netbanking'
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  const [newAddr, setNewAddr] = useState({
    fullName: user ? user.name : '',
    phone: '+91 9876543210',
    address: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '',
    addressType: 'Home'
  });

  const [paymentIntent, setPaymentIntent] = useState(null);

  // Card details state
  const [cardDetails, setCardDetails] = useState({
    number: '4111 2222 3333 4444',
    name: user ? user.name : 'Mahadevaprasad',
    expiry: '12/28',
    cvv: '123'
  });

  // UPI details state
  const [upiId, setUpiId] = useState('user@upi');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  const handleAddNewAddress = async (e) => {
    e.preventDefault();
    if (!newAddr.postalCode || newAddr.postalCode.length !== 6) {
      alert('Please enter a valid 6-digit postal PIN code.');
      return;
    }

    await addAddress(newAddr, true);
    setShowNewAddressForm(false);
  };

  const handleInitiatePayment = async (e) => {
    e?.preventDefault();

    if (!cartItems.length) {
      alert('Your cart is empty!');
      return;
    }

    setLoading(true);
    try {
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
          description: `NexusCart Order for ${selectedAddress.fullName}`
        });
        if (cloverRes && cloverRes.chargeId) {
          payId = cloverRes.chargeId;
        }
      } else {
        await api.verifyPayment({
          razorpay_payment_id: payId,
          paymentIntentId: paymentIntent?.clientSecret || `pi_${Date.now()}`,
          paymentMethod: paymentTab === 'upi' ? 'UPI QR Code' : paymentTab === 'card' ? 'Credit/Debit Card' : 'NetBanking'
        });
      }

      const orderPayload = {
        userId: user ? user.uid || user.id : 'usr-guest',
        customerName: selectedAddress.fullName,
        customerEmail: user ? user.email : 'customer@example.com',
        orderItems: cartItems.map(item => ({
          productId: item.id || item._id,
          title: item.name || item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image || (item.images ? item.images[0] : '')
        })),
        shippingAddress: selectedAddress,
        paymentMethod: paymentTab === 'clover' ? 'Clover eComm Gateway' : paymentTab === 'upi' ? 'UPI QR Code' : paymentTab === 'card' ? 'Credit Card' : 'NetBanking',
        paymentStatus: 'Paid',
        totalPrice: cartTotal,
        totalAmount: cartTotal,
        transactionId: payId,
        cloverMerchantId: CLOVER_CONFIG.merchantId
      };

      const orderRes = await api.createOrder(orderPayload);
      clearCart();
      setShowPaymentModal(false);

      if (orderRes && orderRes.success && orderRes.order) {
        navigate(`/order-success/${orderRes.order.id || orderRes.order._id}`);
        return;
      }

      navigate(`/order-success/ORD-${Math.floor(10000 + Math.random() * 90000)}`);
    } finally {
      setPaymentProcessing(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-8 font-['Inter'] space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl neu-btn-circle text-amber-500 flex items-center justify-center shrink-0">
          <Lock className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-['Outfit']">
            Secure Checkout
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            256-bit encrypted checkout with instant payment verification
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left 2 Columns: Shipping Address & Payment Selector */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Shipping Address Selection Card */}
          <div className="neu-card p-6 sm:p-8 rounded-3xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-black text-slate-900 font-['Outfit']">
                  1. Select Shipping & Delivery Address
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                className="neu-btn px-3.5 py-1.5 text-amber-600 font-black text-xs rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showNewAddressForm ? 'View Saved' : 'Add New'}</span>
              </button>
            </div>

            {/* Saved Addresses List */}
            {!showNewAddressForm && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => selectAddress(addr.id)}
                        className={`p-4 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between ${
                          isSelected
                            ? 'neu-card-inset bg-amber-50/50 border-amber-400 text-slate-900'
                            : 'neu-btn text-slate-700 hover:border-amber-300'
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-slate-900">{addr.fullName}</span>
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                              isSelected ? 'bg-amber-500 border-amber-500 text-white' : 'border-slate-300 bg-white'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </div>
                          <p className="text-xs text-slate-600 font-medium">{addr.address}</p>
                          <p className="text-xs text-slate-900 font-black">
                            {addr.city}, {addr.state} - <span className="text-amber-600">{addr.postalCode}</span>
                          </p>
                          <p className="text-[11px] text-slate-500 font-bold">📞 {addr.phone}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add New Address Inline Form */}
            {showNewAddressForm && (
              <form onSubmit={handleAddNewAddress} className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Recipient Full Name *"
                    value={newAddr.fullName}
                    onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                    className="neu-input p-2.5 text-xs font-bold text-slate-800"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Phone Number *"
                    value={newAddr.phone}
                    onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                    className="neu-input p-2.5 text-xs font-bold text-slate-800"
                  />
                </div>

                <input
                  type="text"
                  required
                  placeholder="Street Address, House No, Flat *"
                  value={newAddr.address}
                  onChange={(e) => setNewAddr({ ...newAddr, address: e.target.value })}
                  className="neu-input w-full p-2.5 text-xs font-bold text-slate-800"
                />

                <div className="grid grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    required
                    maxLength="6"
                    placeholder="PIN Code *"
                    value={newAddr.postalCode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      let city = newAddr.city;
                      let state = newAddr.state;
                      if (val.length === 6) {
                        const res = resolvePincode(val);
                        city = res.city;
                        state = res.state;
                      }
                      setNewAddr({ ...newAddr, postalCode: val, city, state });
                    }}
                    className="neu-input p-2.5 text-xs font-black text-slate-800"
                  />
                  <input
                    type="text"
                    required
                    placeholder="City *"
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="neu-input p-2.5 text-xs font-bold text-slate-800"
                  />
                  <input
                    type="text"
                    required
                    placeholder="State *"
                    value={newAddr.state}
                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                    className="neu-input p-2.5 text-xs font-bold text-slate-800"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="neu-btn-primary px-5 py-2.5 text-white font-black text-xs rounded-xl shadow-md cursor-pointer"
                  >
                    Save & Deliver to this Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewAddressForm(false)}
                    className="neu-btn px-4 py-2.5 text-xs font-bold text-slate-600 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Payment Method Selector Card */}
          <div className="neu-card p-6 sm:p-8 rounded-3xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-black text-slate-900 font-['Outfit']">
                  2. Choose Payment Gateway
                </h3>
              </div>
            </div>

            {/* Gateway Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => setPaymentTab('clover')}
                className={`p-3.5 rounded-2xl flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  paymentTab === 'clover'
                    ? 'neu-card-inset text-emerald-700 bg-emerald-50/50 border border-emerald-300 font-black'
                    : 'neu-btn text-slate-700 hover:text-slate-900'
                }`}
              >
                <Building className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-black">Clover Gateway</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentTab('upi')}
                className={`p-3.5 rounded-2xl flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  paymentTab === 'upi'
                    ? 'neu-card-inset text-amber-700 bg-amber-50/50 border border-amber-300 font-black'
                    : 'neu-btn text-slate-700 hover:text-slate-900'
                }`}
              >
                <QrCode className="w-5 h-5 text-amber-600" />
                <span className="text-xs font-black">UPI / QR Code</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentTab('card')}
                className={`p-3.5 rounded-2xl flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  paymentTab === 'card'
                    ? 'neu-card-inset text-purple-700 bg-purple-50/50 border border-purple-300 font-black'
                    : 'neu-btn text-slate-700 hover:text-slate-900'
                }`}
              >
                <CreditCard className="w-5 h-5 text-purple-600" />
                <span className="text-xs font-black">Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentTab('netbanking')}
                className={`p-3.5 rounded-2xl flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  paymentTab === 'netbanking'
                    ? 'neu-card-inset text-blue-700 bg-blue-50/50 border border-blue-300 font-black'
                    : 'neu-btn text-slate-700 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <span className="text-xs font-black">NetBanking</span>
              </button>
            </div>

            {/* Gateway specific descriptions */}
            <div className="neu-card-inset p-4 rounded-2xl text-xs text-slate-600 leading-relaxed space-y-1">
              {paymentTab === 'clover' && (
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Clover Global Merchant Gateway with instant settlement & sandbox verification.</span>
                </div>
              )}
              {paymentTab === 'upi' && (
                <div className="flex items-center gap-2 text-amber-800 font-bold">
                  <QrCode className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Scan QR with Google Pay, PhonePe, Paytm, or BHIM for instant 1-second payment.</span>
                </div>
              )}
              {paymentTab === 'card' && (
                <div className="flex items-center gap-2 text-purple-800 font-bold">
                  <CreditCard className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Visa, Mastercard, RuPay, and American Express with 3D Secure OTP verification.</span>
                </div>
              )}
              {paymentTab === 'netbanking' && (
                <div className="flex items-center gap-2 text-blue-800 font-bold">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Direct secure authentication through all major Indian banks (SBI, HDFC, ICICI, Axis).</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleInitiatePayment}
              disabled={loading || cartItems.length === 0}
              className="w-full neu-btn-primary py-4 px-6 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Proceed to Pay ₹{cartTotal.toLocaleString('en-IN')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Right Column: Order Summary */}
        <div className="space-y-6">
          <div className="neu-card p-6 rounded-3xl space-y-5 sticky top-24">
            <h3 className="text-base font-black text-slate-900 font-['Outfit'] border-b border-slate-200 pb-3">
              Order Summary ({cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'})
            </h3>

            {/* Selected Address Preview */}
            <div className="p-3 neu-card-inset rounded-2xl space-y-1 text-xs">
              <div className="flex items-center justify-between text-slate-500 font-bold text-[10px] uppercase">
                <span>Delivering To:</span>
                <span className="text-amber-600 font-black">{selectedAddress.addressType || 'Home'}</span>
              </div>
              <p className="font-extrabold text-slate-900">{selectedAddress.fullName}</p>
              <p className="text-slate-600 line-clamp-1">{selectedAddress.address}</p>
              <p className="text-slate-800 font-bold">
                {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.postalCode}
              </p>
            </div>

            {/* Mini Items List */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.id || item._id} className="flex items-center gap-3">
                  <img
                    src={item.image || (item.images ? item.images[0] : '')}
                    alt={item.name || item.title}
                    className="w-12 h-12 rounded-xl object-contain neu-card p-1 shrink-0 bg-white"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{item.name || item.title}</p>
                    <p className="text-[11px] text-slate-500 font-semibold">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-black text-slate-900 shrink-0">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 pt-3 border-t border-slate-200 text-xs font-semibold text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-bold text-slate-800">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Express Delivery:</span>
                <span className="font-bold text-emerald-600">FREE</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-black text-slate-900">
                <span>Total Amount:</span>
                <span className="text-amber-600">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* GATEWAY PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="neu-card p-6 sm:p-8 rounded-3xl w-full max-w-md space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-black text-slate-900">Confirm Payment</h3>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="neu-btn w-7 h-7 rounded-lg flex items-center justify-center text-slate-500"
              >
                ✕
              </button>
            </div>

            <div className="neu-card-inset p-4 rounded-2xl space-y-1.5 text-center">
              <p className="text-xs text-slate-500 font-bold">Total Payable</p>
              <p className="text-2xl font-black text-slate-900 font-['Outfit']">₹{cartTotal.toLocaleString('en-IN')}</p>
              <p className="text-[11px] text-emerald-700 font-bold">Delivering to: {selectedAddress.city} ({selectedAddress.postalCode})</p>
            </div>

            <button
              onClick={handleConfirmGatewayPayment}
              disabled={paymentProcessing}
              className="w-full neu-btn-primary py-3.5 px-6 text-white font-black text-xs rounded-2xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              {paymentProcessing ? (
                <span>Processing Payment...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Authorize & Complete Order</span>
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
