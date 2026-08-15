import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, MapPin, User, Heart, ShoppingCart, ShieldCheck, LogOut, Package, Sparkles } from 'lucide-react';
import { useAuth, isUserAdmin } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = ({ categories = [], onSearch }) => {
  const { user, logout } = useAuth();
  const { cartCount, wishlist } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  const isAdmin = isUserAdmin(user?.email) || user?.role === 'admin';

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm, selectedCategory);
    }
    navigate(`/?search=${encodeURIComponent(searchTerm)}&category=${encodeURIComponent(selectedCategory)}`);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/95 border-b border-slate-800 text-white shadow-lg transition-all duration-300">
      {/* Primary Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-500 to-amber-300 flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950" />
            </div>
            <div>
              <div className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1 font-['Outfit']">
                NexusCart <span className="bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">Prime</span>
              </div>
              <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400 hidden xs:flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-400" /> Enterprise Edition
              </div>
            </div>
          </Link>

          {/* Delivery Badge (Desktop) */}
          <div className="hidden lg:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 font-medium">Deliver to {user ? user.name.split(' ')[0] : 'Guest'}</div>
              <div className="font-bold text-slate-200">Bengaluru 560001</div>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl hidden md:flex items-center bg-slate-800/80 rounded-2xl border border-slate-700/60 focus-within:border-amber-400/80 focus-within:ring-2 focus-within:ring-amber-400/20 transition-all duration-300 overflow-hidden">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-800 text-slate-300 text-xs font-semibold px-3 py-3 border-r border-slate-700/60 outline-none cursor-pointer hover:bg-slate-700/50 transition-colors"
            >
              <option value="All">All Categories</option>
              <option value="Mobiles">Mobiles</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Home & Kitchen">Home Utilities</option>
              <option value="Appliances">Appliances</option>
            </select>

            <input
              type="text"
              placeholder="Search 10,000+ NexusCart deals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-sm text-white px-4 py-3 outline-none placeholder:text-slate-500"
            />

            <button type="submit" className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-5 py-3 font-bold transition-all flex items-center justify-center shrink-0 cursor-pointer">
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Actions Nav Links */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <Link to="/orders" className="hidden sm:flex flex-col items-center justify-center px-2.5 py-1 rounded-xl hover:bg-slate-800/60 text-slate-300 hover:text-white transition-all text-xs font-semibold">
              <Package className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5" />
              <span>Orders</span>
            </Link>

            <Link to="/wishlist" className="relative p-2 rounded-xl hover:bg-slate-800/60 text-slate-300 hover:text-white transition-all">
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 font-extrabold text-[10px] w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-md">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative p-2 sm:px-3 sm:py-2 rounded-xl bg-gradient-to-r from-amber-400/10 to-amber-400/20 border border-amber-400/30 text-amber-300 hover:text-amber-200 transition-all flex items-center gap-1.5">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="bg-amber-400 text-slate-950 font-extrabold text-xs px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
              <span className="hidden xl:inline text-xs font-bold">Cart</span>
            </Link>

            {/* Admin Switcher */}
            {isAdmin && (
              <Link to="/admin" className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-sky-500/20 border border-sky-400/40 text-sky-300 hover:bg-sky-500/30 font-bold text-xs flex items-center gap-1 transition-all">
                <ShieldCheck className="w-4 h-4" /> <span className="hidden sm:inline">Admin</span>
              </Link>
            )}

            {/* Profile User Dropdown / Login */}
            {user ? (
              <div className="flex items-center gap-1 sm:gap-2 pl-1 sm:pl-2 border-l border-slate-800">
                <Link to="/profile" className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-800/60 transition-all">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-800 border border-amber-400/40 flex items-center justify-center font-bold text-amber-400 text-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden md:inline text-xs font-bold text-slate-200">{user.name ? user.name.split(' ')[0] : 'User'}</span>
                </Link>
                <button onClick={logout} className="p-1.5 text-slate-400 hover:text-red-400 transition-colors cursor-pointer" title="Logout">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all flex items-center gap-1">
                <User className="w-4 h-4" /> <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Dedicated Search Input */}
        <div className="md:hidden pb-3 pt-1">
          <form onSubmit={handleSearchSubmit} className="flex items-center bg-slate-800/90 rounded-xl border border-slate-700/60 overflow-hidden">
            <input
              type="text"
              placeholder="Search 10,000+ products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-xs text-white px-3.5 py-2.5 outline-none placeholder:text-slate-500"
            />
            <button type="submit" className="bg-amber-400 text-slate-950 px-3.5 py-2.5 font-bold transition-all flex items-center justify-center shrink-0">
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
