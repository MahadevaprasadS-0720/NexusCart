import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Tag,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  X,
  MapPin
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAddress } from '../context/AddressContext';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const { deliveryLocation } = useAddress();
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
      <div className="max-w-lg mx-auto my-16 px-4 font-['Inter']">
        <div className="neu-card p-10 sm:p-14 rounded-3xl text-center space-y-4">
          <div className="w-20 h-20 rounded-full neu-card-inset flex items-center justify-center mx-auto text-slate-400">
            <ShoppingBag className="w-10 h-10 text-amber-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 font-['Outfit']">Your Cart is Empty</h2>
          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
            Explore 10,000+ top electronics, smartphones, and fashion deals on NexusCart and add them to your cart!
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 neu-btn-primary px-6 py-3.5 rounded-2xl text-xs font-black text-white shadow-md cursor-pointer"
            >
              <span>Start Shopping Deals</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-8 font-['Inter'] space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl neu-btn-circle text-amber-500 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-['Outfit']">
              Shopping Cart ({cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'})
            </h1>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Review your items and proceed to express checkout
            </p>
          </div>
        </div>

        <button
          onClick={clearCart}
          className="neu-btn px-4 py-2 rounded-2xl text-xs font-bold text-slate-500 hover:text-red-500 transition-all cursor-pointer hidden sm:flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Cart
        </button>
      </div>

      {/* Cart Layout: 2 Columns */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start">
        
        {/* Left Column: Cart Items List */}
        <div className="xl:col-span-3 space-y-4">
          {cartItems.map((item) => {
            const pId = item.id || item._id;
            const price = item.price || 0;
            const orig = item.originalPrice || price;

            return (
              <div
                key={pId}
                className="neu-card p-5 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-20 h-20 rounded-2xl neu-card-inset p-2 flex items-center justify-center shrink-0">
                    <img
                      src={item.image || (item.images ? item.images[0] : '')}
                      alt={item.name || item.title}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <span className="neu-badge px-2 py-0.5 text-[9px] font-black text-amber-600 uppercase">
                      {item.category || 'General'}
                    </span>
                    <Link
                      to={`/product/${pId}`}
                      className="block font-black text-xs text-slate-900 hover:text-amber-600 transition-colors line-clamp-2 leading-relaxed"
                    >
                      {item.name || item.title}
                    </Link>
                    <div className="font-black text-sm text-slate-900">
                      ₹{price.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Delete */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                  <div className="flex items-center gap-2 neu-card-inset p-1 rounded-2xl">
                    <button
                      onClick={() => updateQuantity(pId, -1)}
                      className="neu-btn w-8 h-8 rounded-xl flex items-center justify-center text-slate-700 hover:text-amber-600 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-black text-xs text-slate-900">
                      {item.quantity || 1}
                    </span>
                    <button
                      onClick={() => updateQuantity(pId, 1)}
                      className="neu-btn w-8 h-8 rounded-xl flex items-center justify-center text-slate-700 hover:text-amber-600 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right sm:min-w-[100px]">
                    <div className="font-black text-sm text-slate-900">
                      ₹{(price * (item.quantity || 1)).toLocaleString('en-IN')}
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(pId)}
                    className="neu-btn p-2 rounded-xl text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                    title="Remove Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Order Summary & Coupons */}
        <div className="space-y-6">
          
          {/* Coupon Box */}
          <div className="neu-card p-6 rounded-3xl space-y-4">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-500" />
              <h3 className="font-black text-xs text-slate-900 uppercase tracking-wider">Promotional Discount</h3>
            </div>

            {appliedCoupon ? (
              <div className="neu-card-inset p-3 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-black text-emerald-600 font-mono">{appliedCoupon.code}</span>
                  <div className="text-[10px] text-slate-500">{appliedCoupon.desc}</div>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="neu-btn p-1.5 rounded-lg text-red-500 hover:text-red-600 text-xs font-bold"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. SAVE20, NEXUS10"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="neu-input flex-1 px-3 py-2 text-xs font-black text-slate-800 uppercase tracking-wider outline-none"
                />
                <button
                  type="submit"
                  className="neu-btn-primary px-4 py-2 rounded-2xl text-xs font-black text-white shrink-0 cursor-pointer"
                >
                  Apply
                </button>
              </form>
            )}

            {couponMessage.text && (
              <div className={`text-[11px] font-bold ${couponMessage.type === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>
                {couponMessage.text}
              </div>
            )}
          </div>

          {/* Price Summary */}
          <div className="neu-card p-6 rounded-3xl space-y-4">
            <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-200">
              Order Summary
            </h3>

            {/* Delivery Destination Preview */}
            <div className="neu-card-inset p-3 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">DELIVERING TO</span>
                  <span className="font-extrabold text-slate-800">{deliveryLocation.city} ({deliveryLocation.pincode})</span>
                </div>
              </div>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Eligible for Free Delivery
              </span>
            </div>

            <div className="space-y-2.5 text-xs font-bold text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-black">
                  <span>Coupon Savings ({appliedCoupon?.code}):</span>
                  <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery:</span>
                <span className={isFreeShipping ? 'text-emerald-600 font-black' : 'text-slate-900'}>
                  {isFreeShipping ? 'FREE Delivery' : `₹${shippingFee}`}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-300 flex justify-between text-base font-black text-slate-900">
                <span>Total Amount:</span>
                <span className="text-amber-600">₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full neu-btn-primary py-3.5 rounded-2xl text-xs font-black text-white flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>100% Purchase Protection & Secure Payment</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Cart;
