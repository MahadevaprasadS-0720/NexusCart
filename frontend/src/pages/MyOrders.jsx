import React, { useState, useEffect } from 'react';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  ChevronRight,
  Calendar,
  ShoppingBag,
  Printer,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { initialOrders } from '../data/mockData';
import { Link } from 'react-router-dom';

const MyOrders = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

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

  const getActiveStepIndex = (status = '') => {
    const s = status.toLowerCase();
    if (s.includes('delivered')) return 3;
    if (s.includes('out') || s.includes('delivery')) return 2;
    if (s.includes('shipped') || s.includes('processing')) return 1;
    return 0;
  };

  const handleBuyAgain = (item) => {
    addToCart({
      id: item.productId || item.id || `prod_${Date.now()}`,
      name: item.title || item.name,
      title: item.title || item.name,
      price: item.price || 999,
      image: item.image
    }, 1);
    setToast(`🛒 Added "${item.title || 'Product'}" to your cart!`);
    setTimeout(() => setToast(''), 3500);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto my-16 text-center space-y-4 font-['Inter']">
        <div className="neu-card p-12 rounded-3xl max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl neu-btn-circle text-amber-500 flex items-center justify-center mx-auto animate-spin mb-4">
            <Package className="w-6 h-6" />
          </div>
          <h2 className="text-base font-black text-slate-800">Fetching your NexusCart orders...</h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">Connecting to Cloud Firestore database</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-8 font-['Inter'] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl neu-btn-circle text-amber-500 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-['Outfit']">
              My Orders & History ({orders.length})
            </h1>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Track live delivery progress and review purchase records
            </p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="neu-btn px-4 py-2.5 rounded-2xl text-xs font-black text-slate-700 hover:text-amber-600 flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Printer className="w-4 h-4 text-blue-500" /> Print Receipts
        </button>
      </div>

      {/* Toast Banner */}
      {toast && (
        <div className="neu-card p-4 rounded-2xl text-xs font-black text-emerald-800 bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 shadow-sm animate-float">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="neu-card p-12 rounded-3xl text-center space-y-4 max-w-md mx-auto my-8">
          <Package className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-black text-slate-800">No past orders found</h3>
          <p className="text-xs text-slate-500 font-semibold">
            Looks like you haven't placed any orders on NexusCart yet.
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="neu-btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black text-white shadow-md"
            >
              Start Shopping Deals <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((ord) => {
            const id = ord.id || ord._id;
            const currentStepIdx = getActiveStepIndex(ord.orderStatus);
            const orderItems = ord.orderItems || ord.items || [];
            const shipping = ord.shippingAddress || {};

            return (
              <div key={id} className="neu-card rounded-3xl overflow-hidden space-y-6">
                
                {/* Header Information Row */}
                <div className="p-5 neu-card-inset rounded-t-3xl flex flex-wrap items-center justify-between gap-4 text-xs font-bold">
                  <div>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">ORDER ID</span>
                    <div className="font-mono font-black text-amber-600 text-sm">{id}</div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">ORDER DATE</span>
                    <div className="text-slate-800 font-bold">
                      {new Date(ord.createdAt || Date.now()).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">TOTAL AMOUNT</span>
                    <div className="text-slate-900 font-black text-sm">
                      ₹{(ord.totalPrice || ord.totalAmount || 0).toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div>
                    <span className="neu-badge px-3 py-1 text-[10px] font-black text-emerald-700 uppercase flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Paid ({ord.paymentMethod || 'UPI / Card'})
                    </span>
                  </div>
                </div>

                {/* Progress Tracking Steps */}
                <div className="px-6 py-4 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-900">
                    <Truck className="w-4 h-4 text-amber-500" />
                    <span>Live Tracking: <span className="text-amber-600">{ord.orderStatus || 'Order Placed'}</span></span>
                  </div>

                  {/* Horizontal Line Steps */}
                  <div className="relative max-w-xl mx-auto py-2">
                    <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1 bg-slate-200 z-0">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                        style={{ width: `${(currentStepIdx / 3) * 100}%` }}
                      />
                    </div>

                    <div className="relative z-10 flex items-center justify-between">
                      {trackingSteps.map((step, idx) => {
                        const isDone = idx <= currentStepIdx;
                        const isCurrent = idx === currentStepIdx;
                        const StepIcon = step.icon;

                        return (
                          <div key={step.key} className="flex flex-col items-center gap-1.5">
                            <div
                              className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${
                                isDone
                                  ? 'bg-emerald-500 text-white shadow-md'
                                  : 'neu-card-inset text-slate-400'
                              } ${isCurrent ? 'ring-4 ring-emerald-500/20' : ''}`}
                            >
                              <StepIcon className="w-4 h-4" />
                            </div>
                            <span
                              className={`text-[10px] font-extrabold text-center ${
                                isDone ? 'text-slate-800' : 'text-slate-400'
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Ordered Items and Delivery Address */}
                <div className="p-6 pt-0 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Items List */}
                  <div className="md:col-span-2 space-y-3">
                    <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                      Purchased Items ({orderItems.length})
                    </h4>
                    <div className="space-y-2.5">
                      {orderItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="neu-card p-3 rounded-2xl flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'}
                              alt={item.title}
                              className="w-12 h-12 object-contain rounded-xl neu-card-inset p-1 shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="font-extrabold text-slate-900 line-clamp-1">{item.title}</div>
                              <div className="text-[10px] text-slate-500 font-bold">Qty: {item.quantity || 1} • ₹{(item.price || 0).toLocaleString('en-IN')}</div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleBuyAgain(item)}
                            className="neu-btn px-3 py-1.5 rounded-xl font-black text-[11px] text-amber-600 hover:text-amber-700 flex items-center gap-1 shrink-0 cursor-pointer"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" /> Buy Again
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="neu-card-inset p-4 rounded-2xl space-y-2 text-xs">
                    <div className="flex items-center gap-1.5 text-amber-600 font-black uppercase text-[10px] tracking-wider">
                      <MapPin className="w-3.5 h-3.5" /> Delivery Address
                    </div>
                    <div className="font-extrabold text-slate-900">{shipping.fullName || 'Customer'}</div>
                    <div className="text-slate-600">{shipping.address || 'Flat 402, MG Road'}</div>
                    <div className="text-slate-600">{shipping.city || 'Bengaluru'}, {shipping.postalCode || '560001'}</div>
                    <div className="text-slate-400 font-bold pt-1">Phone: {shipping.phone || '+91 9876543210'}</div>
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
