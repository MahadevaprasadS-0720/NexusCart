import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, ShieldCheck, ShoppingBag, Printer } from 'lucide-react';

const OrderSuccessPage = () => {
  const { orderId } = useParams();

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="max-w-xl mx-auto my-16 px-4 font-['Inter']">
      <div className="neu-card p-8 sm:p-12 rounded-3xl text-center space-y-6">
        <div className="w-20 h-20 rounded-full neu-card-inset flex items-center justify-center mx-auto text-emerald-600">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit']">
            Order Confirmed & Paid!
          </h1>
          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
            Your payment was authorized and your order is securely recorded in Cloud Firestore.
          </p>
        </div>

        <div className="neu-card-inset p-5 rounded-2xl space-y-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
            FIRESTORE ORDER REFERENCE
          </span>
          <div className="text-xl font-black text-amber-600 font-mono">
            {orderId || 'ORD-98421'}
          </div>
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Paid via Clover / Razorpay Gateway</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/orders"
            className="w-full sm:w-auto neu-btn-primary px-6 py-3 rounded-2xl text-xs font-black text-white flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <Package className="w-4 h-4" /> Track in My Orders
          </Link>

          <button
            onClick={handlePrintReceipt}
            className="w-full sm:w-auto neu-btn px-5 py-3 rounded-2xl text-xs font-black text-slate-700 hover:text-amber-600 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-blue-500" /> Print Receipt
          </button>

          <Link
            to="/"
            className="w-full sm:w-auto neu-btn px-5 py-3 rounded-2xl text-xs font-black text-slate-700 hover:text-amber-600 flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-amber-500" /> Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
