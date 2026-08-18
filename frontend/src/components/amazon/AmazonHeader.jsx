import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  ShoppingCart,
  Menu,
  ChevronDown,
  User,
  Heart,
  Package,
  Sparkles,
  Layers,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const AmazonHeader = ({
  searchQuery = '',
  onSearchChange,
  selectedCategory = 'All',
  onSelectCategory,
  onOpenDrawer,
  previewMode,
  onTogglePreviewMode
}) => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState({
    city: 'Bengaluru',
    pincode: '560001'
  });
  const [pincodeInput, setPincodeInput] = useState('');
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [localCategory, setLocalCategory] = useState(selectedCategory);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearchChange) onSearchChange(localSearch);
    if (onSelectCategory) onSelectCategory(localCategory);
    navigate(`/?search=${encodeURIComponent(localSearch)}&category=${encodeURIComponent(localCategory)}`);
  };

  const handlePincodeSubmit = (e) => {
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
    <header className="sticky top-0 z-50 bg-[#131921] text-white font-['Inter'] select-none">
      {/* ================= PRIMARY NAV BAR ================= */}
      <div className="max-w-[1500px] mx-auto px-2 sm:px-4 flex items-center justify-between h-[60px] gap-2 md:gap-4 text-xs">
        
        {/* Amazon / NexusCart Logo */}
        <Link
          to="/"
          className="flex items-center gap-1.5 p-1.5 rounded-sm hover:outline hover:outline-1 hover:outline-white transition-all shrink-0"
        >
          <div className="flex flex-col items-start leading-none">
            <div className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center font-['Outfit']">
              <span>amazon</span>
              <span className="text-[#febd69] font-bold text-xs ml-0.5">.in</span>
            </div>
            <div className="w-16 h-1.5 bg-[#febd69] rounded-full -mt-0.5 transform -rotate-1 shadow-sm" />
          </div>
        </Link>

        {/* Location Delivery Selector (Desktop) */}
        <div
          onClick={() => setShowLocationModal(true)}
          className="hidden lg:flex items-center gap-1.5 p-1.5 rounded-sm hover:outline hover:outline-1 hover:outline-white cursor-pointer transition-all shrink-0"
          title="Change delivery location"
        >
          <MapPin className="w-4 h-4 text-white -mt-2" />
          <div className="leading-tight">
            <div className="text-[11px] text-[#cccccc] font-normal">
              Delivering to {deliveryLocation.city} {deliveryLocation.pincode}
            </div>
            <div className="text-xs font-black text-white">Update location</div>
          </div>
        </div>

        {/* ================= SEARCH BAR ================= */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-3xl flex items-center h-10 rounded-[4px] overflow-hidden focus-within:ring-2 focus-within:ring-[#ff9900] bg-white transition-all"
        >
          {/* Category Dropdown */}
          <div className="relative bg-[#e6e6e6] hover:bg-[#d4d4d4] text-slate-800 border-r border-[#cdcdcd] h-full flex items-center px-2 cursor-pointer transition-colors shrink-0">
            <select
              value={localCategory}
              onChange={(e) => {
                setLocalCategory(e.target.value);
                if (onSelectCategory) onSelectCategory(e.target.value);
              }}
              className="bg-transparent text-slate-800 text-xs font-medium pr-4 outline-none cursor-pointer appearance-none"
            >
              <option value="All">All Categories</option>
              <option value="Mobiles">Mobiles</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Home & Kitchen">Home & Kitchen</option>
              <option value="Appliances">Appliances</option>
              <option value="Beauty & Toys">Beauty</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-600 pointer-events-none absolute right-1" />
          </div>

          {/* Search Input */}
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search Amazon.in"
            className="flex-1 px-3 py-2 text-slate-900 text-sm font-medium outline-none bg-white h-full placeholder:text-slate-500"
          />

          {/* Amazon Orange Search Button */}
          <button
            type="submit"
            className="bg-[#febd69] hover:bg-[#f3a847] text-slate-900 h-full px-4 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Search"
          >
            <Search className="w-5 h-5 stroke-[2.5]" />
          </button>
        </form>

        {/* ================= RIGHT CONTROLS ================= */}
        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          
          {/* Language Selector (Desktop) */}
          <div className="hidden md:flex items-center gap-1 p-2 rounded-sm hover:outline hover:outline-1 hover:outline-white cursor-pointer transition-all">
            <span className="text-base">🇮🇳</span>
            <span className="text-xs font-black">EN</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </div>

          {/* Account & Lists Hover Menu */}
          <div
            onMouseEnter={() => setShowAccountDropdown(true)}
            onMouseLeave={() => setShowAccountDropdown(false)}
            className="relative"
          >
            <Link
              to={user ? "/profile" : "/login"}
              className="flex flex-col p-1.5 sm:p-2 rounded-sm hover:outline hover:outline-1 hover:outline-white transition-all cursor-pointer leading-tight"
            >
              <span className="text-[11px] text-[#cccccc] font-normal truncate max-w-[100px]">
                {user ? `Hello, ${user.name.split(' ')[0]}` : 'Hello, sign in'}
              </span>
              <div className="flex items-center gap-0.5 text-xs font-black text-white">
                <span>Account & Lists</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
            </Link>

            {/* Account Dropdown Flyout */}
            {showAccountDropdown && (
              <div className="absolute right-0 top-full mt-1 w-64 bg-white text-slate-900 rounded-md shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in duration-150">
                {!user ? (
                  <div className="text-center pb-3 border-b border-slate-200 space-y-2">
                    <Link
                      to="/login"
                      className="block w-full py-2 px-4 rounded-lg bg-gradient-to-b from-[#f8e3a0] to-[#f3a847] hover:from-[#f5d471] hover:to-[#eab308] border border-[#a88734] text-slate-900 font-extrabold text-xs shadow-sm cursor-pointer"
                    >
                      Sign In
                    </Link>
                    <p className="text-[11px] text-slate-600">
                      New customer?{' '}
                      <Link to="/signup" className="text-[#007185] hover:underline font-bold">
                        Start here.
                      </Link>
                    </p>
                  </div>
                ) : (
                  <div className="pb-3 border-b border-slate-200 space-y-1">
                    <p className="text-xs font-black text-slate-900">Your Account</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    <button
                      onClick={logout}
                      className="text-xs text-red-600 hover:underline font-bold mt-1 block"
                    >
                      Sign Out
                    </button>
                  </div>
                )}

                <div className="pt-3 grid grid-cols-2 gap-4 text-xs font-medium text-slate-700">
                  <div className="space-y-2">
                    <p className="font-black text-slate-900 text-xs">Your Lists</p>
                    <Link to="/wishlist" className="block hover:text-[#c45500] hover:underline">
                      Wish List
                    </Link>
                    <Link to="/orders" className="block hover:text-[#c45500] hover:underline">
                      Saved Items
                    </Link>
                  </div>
                  <div className="space-y-2 border-l border-slate-100 pl-3">
                    <p className="font-black text-slate-900 text-xs">Your Account</p>
                    <Link to="/profile" className="block hover:text-[#c45500] hover:underline">
                      Your Profile
                    </Link>
                    <Link to="/orders" className="block hover:text-[#c45500] hover:underline">
                      Your Orders
                    </Link>
                    <Link to="/cart" className="block hover:text-[#c45500] hover:underline">
                      Your Cart
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Returns & Orders */}
          <Link
            to={user ? "/orders" : "/login"}
            className="hidden sm:flex flex-col p-1.5 sm:p-2 rounded-sm hover:outline hover:outline-1 hover:outline-white transition-all leading-tight"
          >
            <span className="text-[11px] text-[#cccccc] font-normal">Returns</span>
            <span className="text-xs font-black text-white">& Orders</span>
          </Link>

          {/* Shopping Cart */}
          <Link
            to="/cart"
            className="flex items-end p-1.5 sm:p-2 rounded-sm hover:outline hover:outline-1 hover:outline-white transition-all relative"
          >
            <div className="relative">
              <ShoppingCart className="w-8 h-8 text-white" />
              <span className="absolute -top-1 left-3.5 bg-[#f3a847] text-slate-950 font-black text-xs px-1.5 py-0.2 rounded-full min-w-[18px] text-center">
                {cartCount}
              </span>
            </div>
            <span className="font-black text-xs text-white hidden md:inline ml-1 mb-0.5">Cart</span>
          </Link>

          {/* Theme Preview Switcher Badge */}
          {onTogglePreviewMode && (
            <button
              onClick={onTogglePreviewMode}
              className="ml-1 px-2.5 py-1.5 rounded-md bg-[#232f3e] hover:bg-[#37475a] border border-[#f3a847]/50 text-[#febd69] font-black text-[10px] flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              title="Toggle between Amazon.in Theme and Neumorphic Soft-UI VIP Theme"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#febd69]" />
              <span className="hidden xl:inline">VIP Soft-UI View</span>
            </button>
          )}

        </div>
      </div>

      {/* ================= LOCATION PINCODE MODAL ================= */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#f3a847]" /> Choose your delivery location
              </h3>
              <button
                onClick={() => setShowLocationModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Delivery options and speeds may vary based on your selected pin code. Enter your 6-digit postal code below:
            </p>

            <form onSubmit={handlePincodeSubmit} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit Pincode (e.g. 560001)"
                value={pincodeInput}
                onChange={(e) => setPincodeInput(e.target.value)}
                className="flex-1 px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-[#f3a847] focus:ring-2 focus:ring-[#f3a847]/20"
                autoFocus
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                Apply
              </button>
            </form>

            <div className="pt-2 flex justify-between text-[11px] font-bold text-slate-500 border-t border-slate-100">
              <span>Popular: Bengaluru (560001)</span>
              <span>Mumbai (400001)</span>
              <span>Delhi (110001)</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default AmazonHeader;
