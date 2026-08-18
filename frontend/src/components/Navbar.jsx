import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  MapPin,
  User,
  Heart,
  ShoppingCart,
  ShieldCheck,
  LogOut,
  Package,
  Sparkles,
  Search,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { useAuth, isUserAdmin } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useFilters } from '../context/FilterContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount, wishlist } = useCart();
  const {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    activeFiltersCount,
    setIsFilterDrawerOpen
  } = useFilters();

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState({
    city: 'Bengaluru',
    pincode: '560001'
  });
  const [pincodeInput, setPincodeInput] = useState('');

  const isAdmin = isUserAdmin(user?.email) || user?.role === 'admin';

  const handleUpdatePincode = (e) => {
    e.preventDefault();
    if (pincodeInput.trim().length >= 6) {
      setDeliveryLocation({
        city: pincodeInput.startsWith('560')
          ? 'Bengaluru'
          : pincodeInput.startsWith('400')
          ? 'Mumbai'
          : pincodeInput.startsWith('110')
          ? 'Delhi'
          : 'Karnataka',
        pincode: pincodeInput.trim()
      });
      setShowLocationModal(false);
      setPincodeInput('');
    }
  };

  return (
    <header className="sticky top-0 z-50 neu-nav text-slate-800 transition-all duration-300 font-['Inter'] w-full">
      {/* Primary Top Bar - Edge-to-Edge Full Screen */}
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
          
          {/* Brand Logo with Neumorphic Circle */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="neu-btn-circle text-amber-500 group-hover:text-amber-600 transition-colors shrink-0">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="font-extrabold text-lg sm:text-2xl tracking-tight text-slate-800 flex items-center gap-1 font-['Outfit']">
                NexusCart <span className="text-amber-500 font-black">Prime</span>
              </div>
              <div className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-slate-400 hidden xs:flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-500" /> Enterprise Edition
              </div>
            </div>
          </Link>

          {/* Delivery Badge (Desktop) - Inset Soft UI */}
          <div
            onClick={() => setShowLocationModal(true)}
            className="hidden xl:flex items-center gap-2.5 px-3 py-1.5 neu-card-inset text-xs cursor-pointer hover:border-amber-400 transition-all shrink-0"
            title="Click to change delivery pincode"
          >
            <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
            <div>
              <div className="text-[9px] text-slate-500 font-medium">Deliver to {user ? user.name.split(' ')[0] : 'Guest'}</div>
              <div className="font-extrabold text-slate-700 text-xs">{deliveryLocation.city} {deliveryLocation.pincode}</div>
            </div>
          </div>

          {/* Middle: Integrated Search, Filters & Sort Control Bar (Replaced directly in Top Bar) */}
          <div className="flex-1 max-w-3xl hidden md:flex items-center gap-2">
            
            {/* Search Input Box */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search 10,000+ NexusCart products by name, brand, or model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full neu-input text-slate-900 text-xs font-semibold pl-9 pr-8 py-2.5 outline-none placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Trigger Button for Filters Drawer */}
            <button
              type="button"
              onClick={() => setIsFilterDrawerOpen(true)}
              className={`neu-btn px-3.5 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer shrink-0 transition-all ${
                activeFiltersCount > 0
                  ? 'neu-card-inset text-amber-700 border border-amber-400 shadow-xs'
                  : 'text-slate-700 hover:text-amber-600'
              }`}
              title="Refine Catalog Filters"
            >
              <SlidersHorizontal className="w-4 h-4 text-amber-500" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-amber-500 text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Quick Sort Selector */}
            <div className="flex items-center gap-1 shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="neu-btn text-slate-800 text-xs font-extrabold px-3 py-2.5 outline-none cursor-pointer rounded-xl"
              >
                <option value="featured">✨ Featured & Deals</option>
                <option value="price-asc">💵 Price: Low to High</option>
                <option value="price-desc">💰 Price: High to Low</option>
                <option value="rating-desc">⭐ Highest Rating</option>
                <option value="discount-desc">🔥 Biggest Discount</option>
                <option value="name-asc">🔤 Title: A-Z</option>
              </select>
            </div>

          </div>

          {/* Actions Nav Links - Neumorphic Tactile Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link to="/orders" className="hidden sm:flex flex-col items-center justify-center px-3.5 py-1.5 neu-btn text-slate-600 hover:text-amber-600 transition-all text-xs font-bold">
              <Package className="w-4 h-4 mb-0.5 text-slate-500" />
              <span>Orders</span>
            </Link>

            {/* Wishlist Circle */}
            <Link to="/wishlist" className="relative neu-btn-circle text-slate-600 hover:text-red-500 transition-colors" title="Wishlist">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <Link to="/cart" className="relative px-4 py-2 neu-btn text-slate-700 hover:text-amber-600 transition-all flex items-center gap-2 font-extrabold text-xs" title="Shopping Cart">
              <ShoppingCart className="w-4 h-4 text-amber-500" />
              {cartCount > 0 && (
                <span className="bg-amber-500 text-white font-black text-[10px] px-2 py-0.5 rounded-full shadow-sm">
                  {cartCount}
                </span>
              )}
              <span className="hidden lg:inline">Cart</span>
            </Link>

            {/* Admin Switcher */}
            {isAdmin && (
              <Link to="/admin" className="px-3.5 py-2 neu-btn text-sky-600 font-extrabold text-xs flex items-center gap-1.5 hover:text-sky-700 transition-all">
                <ShieldCheck className="w-4 h-4 text-sky-500" /> <span className="hidden sm:inline">Admin</span>
              </Link>
            )}

            {/* Profile User Dropdown / Login */}
            {user ? (
              <div className="flex items-center gap-1 sm:gap-2 pl-1 sm:pl-2">
                <Link to="/profile" className="flex items-center gap-2 p-1 neu-btn rounded-full pr-3 hover:text-amber-600 transition-all">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-extrabold text-xs shadow-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden md:inline text-xs font-extrabold text-slate-700">{user.name ? user.name.split(' ')[0] : 'User'}</span>
                </Link>
                <button onClick={logout} className="neu-btn p-2 text-slate-500 hover:text-red-500 transition-colors cursor-pointer" title="Logout">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="neu-btn-primary px-5 py-2.5 text-white font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-sm">
                <User className="w-4 h-4" /> <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Search & Filter Bar */}
        <div className="md:hidden pb-3 pt-1 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search 10,000+ products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full neu-input text-xs text-slate-800 font-semibold pl-8 pr-7 py-2 outline-none placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsFilterDrawerOpen(true)}
            className="neu-btn px-3 py-2 text-xs font-black text-slate-700 flex items-center gap-1 shrink-0"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-amber-500 text-white font-black text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

      </div>

      {/* LOCATION SELECTOR MODAL */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="neu-card p-6 rounded-3xl w-full max-w-sm space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-black text-slate-900">Choose Delivery Location</h3>
              </div>
              <button
                onClick={() => setShowLocationModal(false)}
                className="neu-btn w-7 h-7 rounded-lg flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Enter your 6-digit delivery pincode to check product availability and fast shipping options.
            </p>

            <form onSubmit={handleUpdatePincode} className="space-y-3">
              <input
                type="text"
                placeholder="e.g. 560001, 400001, 110001"
                maxLength="6"
                value={pincodeInput}
                onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                className="neu-input w-full px-4 py-2.5 text-xs font-black text-slate-800 tracking-wider"
              />

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="neu-btn-primary flex-1 py-2.5 text-white font-black text-xs rounded-xl"
                >
                  Apply Pin Code
                </button>
                <button
                  type="button"
                  onClick={() => setShowLocationModal(false)}
                  className="neu-btn px-4 py-2.5 text-xs font-bold text-slate-600 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
