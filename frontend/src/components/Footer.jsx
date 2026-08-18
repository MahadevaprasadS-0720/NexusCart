import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, Headphones, Lock, ArrowUp, ShoppingBag, Sparkles } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="neu-bg border-t border-slate-300/70 text-slate-700 mt-auto font-['Inter'] w-full">
      {/* Back to top banner */}
      <div
        onClick={scrollToTop}
        className="neu-card mx-4 sm:mx-8 lg:mx-10 my-6 p-3.5 rounded-2xl text-center cursor-pointer text-xs font-black text-slate-700 hover:text-amber-600 flex items-center justify-center gap-2 transition-all shadow-sm select-none"
      >
        <ArrowUp className="w-4 h-4 text-amber-500" />
        <span>Back to top</span>
      </div>

      {/* Value props banner - Full width */}
      <div className="w-full px-4 sm:px-6 lg:px-10 py-8 border-b border-slate-300/60">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="neu-card p-5 rounded-2xl text-center space-y-2">
            <div className="w-10 h-10 rounded-xl neu-btn-circle text-amber-500 flex items-center justify-center mx-auto">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="font-black text-xs text-slate-900">Free NexusCart Delivery</h4>
            <p className="text-[11px] text-slate-500">On all eligible orders over ₹499</p>
          </div>

          <div className="neu-card p-5 rounded-2xl text-center space-y-2">
            <div className="w-10 h-10 rounded-xl neu-btn-circle text-emerald-500 flex items-center justify-center mx-auto">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h4 className="font-black text-xs text-slate-900">10 Days Easy Return</h4>
            <p className="text-[11px] text-slate-500">Hassle free replacement guarantee</p>
          </div>

          <div className="neu-card p-5 rounded-2xl text-center space-y-2">
            <div className="w-10 h-10 rounded-xl neu-btn-circle text-blue-500 flex items-center justify-center mx-auto">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="font-black text-xs text-slate-900">100% Safe Payments</h4>
            <p className="text-[11px] text-slate-500">UPI, Cards, EMI & Clover Gateway</p>
          </div>

          <div className="neu-card p-5 rounded-2xl text-center space-y-2">
            <div className="w-10 h-10 rounded-xl neu-btn-circle text-purple-500 flex items-center justify-center mx-auto">
              <Headphones className="w-5 h-5" />
            </div>
            <h4 className="font-black text-xs text-slate-900">24x7 Customer Helpline</h4>
            <p className="text-[11px] text-slate-500">Dedicated assistance anytime</p>
          </div>
        </div>
      </div>

      {/* Main footer links - Full width */}
      <div className="w-full px-4 sm:px-6 lg:px-10 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-xs font-semibold">
        <div className="space-y-3">
          <h4 className="font-black text-slate-900 uppercase tracking-wider text-[11px]">Get to Know Us</h4>
          <ul className="space-y-2 text-slate-500">
            <li><Link to="/" className="hover:text-amber-600 transition-colors">About NexusCart</Link></li>
            <li><Link to="/" className="hover:text-amber-600 transition-colors">Careers & Press</Link></li>
            <li><Link to="/" className="hover:text-amber-600 transition-colors">Sustainability Initiatives</Link></li>
            <li><Link to="/" className="hover:text-amber-600 transition-colors">Prime Marketplace</Link></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-black text-slate-900 uppercase tracking-wider text-[11px]">Connect with Us</h4>
          <ul className="space-y-2 text-slate-500">
            <li><a href="#" className="hover:text-amber-600 transition-colors">Facebook Community</a></li>
            <li><a href="#" className="hover:text-amber-600 transition-colors">Twitter / X Official</a></li>
            <li><a href="#" className="hover:text-amber-600 transition-colors">Instagram Feed</a></li>
            <li><a href="#" className="hover:text-amber-600 transition-colors">Engineering Blog</a></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-black text-slate-900 uppercase tracking-wider text-[11px]">Make Money with Us</h4>
          <ul className="space-y-2 text-slate-500">
            <li><Link to="/admin" className="hover:text-amber-600 transition-colors">Sell on NexusCart</Link></li>
            <li><Link to="/admin" className="hover:text-amber-600 transition-colors">Merchant Portal</Link></li>
            <li><Link to="/admin/clover" className="hover:text-amber-600 transition-colors">Clover Integration</Link></li>
            <li><Link to="/admin" className="hover:text-amber-600 transition-colors">Fulfillment Center</Link></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-black text-slate-900 uppercase tracking-wider text-[11px]">Let Us Help You</h4>
          <ul className="space-y-2 text-slate-500">
            <li><Link to="/orders" className="hover:text-amber-600 transition-colors">Your Account & Orders</Link></li>
            <li><Link to="/orders" className="hover:text-amber-600 transition-colors">Delivery & Tracking</Link></li>
            <li><Link to="/orders" className="hover:text-amber-600 transition-colors">Returns & Refunds</Link></li>
            <li><Link to="/profile" className="hover:text-amber-600 transition-colors">Manage Saved Profile</Link></li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center border-t border-slate-300/60 py-6 text-xs text-slate-500 font-bold">
        © 2026 NexusCart Inc. All rights reserved. Built with Neumorphic Soft-UI Design System.
      </div>
    </footer>
  );
};

export default Footer;
