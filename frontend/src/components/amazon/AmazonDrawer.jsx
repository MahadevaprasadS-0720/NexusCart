import React from 'react';
import { Link } from 'react-router-dom';
import { User, X, ChevronRight, ShoppingBag, Sparkles, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AmazonDrawer = ({ isOpen, onClose, onSelectCategory }) => {
  const { user, logout } = useAuth();

  if (!isOpen) return null;

  const handleCategoryClick = (cat) => {
    if (onSelectCategory) onSelectCategory(cat);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex font-['Inter']">
      
      {/* Dark Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-[365px] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300 select-none">
        
        {/* User Header */}
        <div className="bg-[#232f3e] text-white p-4 flex items-center justify-between">
          <Link
            to={user ? "/profile" : "/login"}
            onClick={onClose}
            className="flex items-center gap-3 hover:text-[#febd69] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-base font-['Outfit']">
              Hello, {user ? user.name : 'Sign in'}
            </span>
          </Link>

          <button
            onClick={onClose}
            className="text-white hover:text-red-400 p-1 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Categories List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 text-sm text-slate-800">
          
          {/* Trending */}
          <div className="space-y-2 border-b border-slate-200 pb-4">
            <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider">
              Trending
            </h4>
            <div
              onClick={() => handleCategoryClick('All')}
              className="flex items-center justify-between py-2 px-2 rounded-md hover:bg-slate-100 cursor-pointer font-medium"
            >
              <span>Best Sellers</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
            <div
              onClick={() => handleCategoryClick('All')}
              className="flex items-center justify-between py-2 px-2 rounded-md hover:bg-slate-100 cursor-pointer font-medium"
            >
              <span>New Releases</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
            <div
              onClick={() => handleCategoryClick('All')}
              className="flex items-center justify-between py-2 px-2 rounded-md hover:bg-slate-100 cursor-pointer font-medium"
            >
              <span>Movers and Shakers</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Shop by Category */}
          <div className="space-y-2 border-b border-slate-200 pb-4">
            <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider">
              Shop by Category
            </h4>
            {[
              { label: 'Mobiles & Smartphones', cat: 'Mobiles' },
              { label: 'Computers & Electronics', cat: 'Electronics' },
              { label: "Men's & Women's Fashion", cat: 'Fashion' },
              { label: 'Home, Kitchen & Pets', cat: 'Home & Kitchen' },
              { label: 'Large & Small Appliances', cat: 'Appliances' },
              { label: 'Beauty, Health & Grocery', cat: 'Beauty & Toys' }
            ].map((item) => (
              <div
                key={item.label}
                onClick={() => handleCategoryClick(item.cat)}
                className="flex items-center justify-between py-2 px-2 rounded-md hover:bg-slate-100 cursor-pointer font-medium"
              >
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            ))}
          </div>

          {/* Programs & Features */}
          <div className="space-y-2 border-b border-slate-200 pb-4">
            <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider">
              Programs & Features
            </h4>
            <Link
              to="/cart"
              onClick={onClose}
              className="flex items-center justify-between py-2 px-2 rounded-md hover:bg-slate-100 cursor-pointer font-medium block"
            >
              <span>Your Shopping Cart</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
            <Link
              to="/wishlist"
              onClick={onClose}
              className="flex items-center justify-between py-2 px-2 rounded-md hover:bg-slate-100 cursor-pointer font-medium block"
            >
              <span>Your Wishlist</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
            <Link
              to="/orders"
              onClick={onClose}
              className="flex items-center justify-between py-2 px-2 rounded-md hover:bg-slate-100 cursor-pointer font-medium block"
            >
              <span>Your Orders & History</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
            <Link
              to="/admin"
              onClick={onClose}
              className="flex items-center justify-between py-2 px-2 rounded-md hover:bg-slate-100 cursor-pointer font-medium block"
            >
              <span>Sell on Amazon Portal</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>

          {/* Help & Settings */}
          <div className="space-y-2 pb-4">
            <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider">
              Help & Settings
            </h4>
            <Link
              to={user ? "/profile" : "/login"}
              onClick={onClose}
              className="flex items-center justify-between py-2 px-2 rounded-md hover:bg-slate-100 cursor-pointer font-medium block"
            >
              <span>Your Account</span>
            </Link>
            <div className="py-2 px-2 text-slate-600 font-medium">
              <span>🇮🇳 India (English)</span>
            </div>
            {user ? (
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full text-left py-2 px-2 text-red-600 font-bold hover:bg-red-50 rounded-md cursor-pointer flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            ) : (
              <Link
                to="/login"
                onClick={onClose}
                className="w-full text-left py-2 px-2 text-[#007185] font-bold hover:bg-slate-50 rounded-md cursor-pointer flex items-center gap-2 block"
              >
                <LogIn className="w-4 h-4" /> Sign In
              </Link>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default AmazonDrawer;
