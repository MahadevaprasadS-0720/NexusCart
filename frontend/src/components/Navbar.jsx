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
  X,
  Check,
  Plus,
  Navigation
} from 'lucide-react';
import { useAuth, isUserAdmin } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useFilters } from '../context/FilterContext';
import { useAddress } from '../context/AddressContext';

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

  const {
    addresses,
    selectedAddressId,
    deliveryLocation,
    selectAddress,
    setDeliveryPincode,
    addAddress,
    resolvePincode
  } = useAddress();

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [pincodeInput, setPincodeInput] = useState('');
  const [cityInput, setCityInput] = useState('');
  const [pincodeError, setPincodeError] = useState('');
  const [locationSuccess, setLocationSuccess] = useState('');
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);

  const [newAddrData, setNewAddrData] = useState({
    fullName: user ? user.name : '',
    phone: '+91 9876543210',
    address: '',
    city: '',
    state: '',
    postalCode: ''
  });

  const isAdmin = isUserAdmin(user?.email) || user?.role === 'admin';

  // Handle quick pincode submission
  const handleUpdatePincode = (e) => {
    e.preventDefault();
    setPincodeError('');
    const cleanPin = pincodeInput.trim().replace(/\D/g, '');

    if (cleanPin.length !== 6) {
      setPincodeError('Please enter a valid 6-digit Indian Postal PIN Code.');
      return;
    }

    const updated = setDeliveryPincode(cleanPin, cityInput.trim());
    setLocationSuccess(`Delivery location updated to ${updated.city} (${updated.pincode})!`);
    setTimeout(() => {
      setLocationSuccess('');
      setShowLocationModal(false);
      setPincodeInput('');
      setCityInput('');
    }, 1200);
  };

  // Handle quick add full address
  const handleSaveNewAddress = async (e) => {
    e.preventDefault();
    if (!newAddrData.postalCode || newAddrData.postalCode.length !== 6) {
      setPincodeError('Valid 6-digit PIN Code is required.');
      return;
    }

    await addAddress(newAddrData, true);
    setLocationSuccess('New address added & set as active delivery location!');
    setTimeout(() => {
      setLocationSuccess('');
      setShowAddAddressForm(false);
      setShowLocationModal(false);
    }, 1200);
  };

  // Auto-fill city/state when typing 6-digit pincode in add form
  const handlePincodeChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    setPincodeInput(val);
    if (val.length === 6) {
      const res = resolvePincode(val);
      if (res.valid) {
        setCityInput(res.city);
        setPincodeError('');
      }
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

          {/* Delivery Location Badge (Desktop) - Inset Soft UI - Clickable */}
          <div
            onClick={() => {
              setShowLocationModal(true);
              setShowAddAddressForm(false);
              setPincodeError('');
            }}
            className="hidden xl:flex items-center gap-2.5 px-3.5 py-2 neu-card-inset text-xs cursor-pointer hover:border-amber-400 transition-all shrink-0 rounded-2xl group"
            title="Click to change your delivery location or select address"
          >
            <div className="w-7 h-7 rounded-xl neu-btn-circle text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-medium">Deliver to {user ? user.name.split(' ')[0] : 'Guest'}</div>
              <div className="font-extrabold text-slate-800 text-xs flex items-center gap-1">
                <span>{deliveryLocation.city}</span>
                <span className="text-amber-600 font-bold">{deliveryLocation.pincode}</span>
              </div>
            </div>
          </div>

          {/* Middle: Integrated Search, Filters & Sort Control Bar */}
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

        {/* Mobile Location & Search Row */}
        <div className="md:hidden pb-3 pt-1 flex flex-col gap-2">
          
          {/* Mobile Quick Location Trigger */}
          <div
            onClick={() => {
              setShowLocationModal(true);
              setShowAddAddressForm(false);
            }}
            className="flex items-center justify-between px-3 py-1.5 neu-card-inset text-[11px] font-bold text-slate-700 cursor-pointer rounded-xl"
          >
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="text-slate-500">Deliver to {user ? user.name.split(' ')[0] : 'Guest'}:</span>
              <span className="font-extrabold text-slate-900">{deliveryLocation.city} ({deliveryLocation.pincode})</span>
            </div>
            <span className="text-[10px] text-amber-600 font-extrabold shrink-0 underline">Change</span>
          </div>

          <div className="flex items-center gap-2">
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

      </div>

      {/* COMPREHENSIVE ADDRESS & DELIVERY LOCATION MODAL */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="neu-card p-6 sm:p-7 rounded-3xl w-full max-w-lg space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl neu-btn-circle text-amber-500 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 font-['Outfit']">Choose Delivery Location</h3>
                  <p className="text-xs text-slate-500 font-medium">Select a delivery address or enter any Indian PIN code</p>
                </div>
              </div>

              <button
                onClick={() => setShowLocationModal(false)}
                className="neu-btn w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Success Alert */}
            {locationSuccess && (
              <div className="p-3 neu-card-inset bg-emerald-50 text-emerald-700 text-xs font-black rounded-2xl flex items-center gap-2 border border-emerald-300">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{locationSuccess}</span>
              </div>
            )}

            {/* Quick PIN Code Form */}
            {!showAddAddressForm && (
              <div className="space-y-4">
                <form onSubmit={handleUpdatePincode} className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-700 flex items-center justify-between">
                    <span>Enter Indian Pincode:</span>
                    {cityInput && (
                      <span className="text-[11px] text-amber-600 font-black">
                        Detected: {cityInput}
                      </span>
                    )}
                  </label>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. 560001, 570001, 400001, 110001"
                      maxLength="6"
                      value={pincodeInput}
                      onChange={handlePincodeChange}
                      className="neu-input flex-1 px-4 py-2.5 text-xs font-black text-slate-800 tracking-wider placeholder:text-slate-400"
                    />
                    <button
                      type="submit"
                      className="neu-btn-primary px-5 py-2.5 text-white font-black text-xs rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Apply</span>
                    </button>
                  </div>

                  {pincodeError && (
                    <p className="text-xs font-bold text-red-500">{pincodeError}</p>
                  )}
                </form>

                {/* Saved Addresses List */}
                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      Saved Delivery Addresses ({addresses.length})
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowAddAddressForm(true)}
                      className="text-xs font-black text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add New Address
                    </button>
                  </div>

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {addresses.map((addr) => {
                      const isSelected = selectedAddressId === addr.id;
                      return (
                        <div
                          key={addr.id}
                          onClick={() => {
                            selectAddress(addr.id);
                            setLocationSuccess(`Switched delivery to ${addr.city} (${addr.postalCode})!`);
                            setTimeout(() => {
                              setLocationSuccess('');
                              setShowLocationModal(false);
                            }, 1000);
                          }}
                          className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                            isSelected
                              ? 'neu-card-inset bg-amber-50/50 border-amber-300 text-slate-900'
                              : 'neu-btn text-slate-700 hover:border-amber-400'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-slate-900">{addr.fullName}</span>
                                {addr.addressType && (
                                  <span className="text-[9px] font-black px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md">
                                    {addr.addressType}
                                  </span>
                                )}
                                {addr.isDefault && (
                                  <span className="text-[9px] font-black px-2 py-0.5 bg-amber-500 text-white rounded-md">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-600 font-medium line-clamp-1">{addr.address}</p>
                              <p className="text-[11px] text-slate-800 font-bold">
                                {addr.city}, {addr.state} - <span className="text-amber-600">{addr.postalCode}</span>
                              </p>
                            </div>

                            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                              isSelected ? 'bg-amber-500 border-amber-500 text-white' : 'border-slate-300 bg-white'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Add New Full Address Form */}
            {showAddAddressForm && (
              <form onSubmit={handleSaveNewAddress} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-800">Add Complete Delivery Address</h4>
                  <button
                    type="button"
                    onClick={() => setShowAddAddressForm(false)}
                    className="text-xs text-slate-500 hover:text-slate-800 underline font-bold"
                  >
                    Back to saved addresses
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    required
                    value={newAddrData.fullName}
                    onChange={(e) => setNewAddrData({ ...newAddrData, fullName: e.target.value })}
                    className="neu-input p-2.5 text-xs font-bold text-slate-800"
                  />
                  <input
                    type="text"
                    placeholder="Mobile Number *"
                    required
                    value={newAddrData.phone}
                    onChange={(e) => setNewAddrData({ ...newAddrData, phone: e.target.value })}
                    className="neu-input p-2.5 text-xs font-bold text-slate-800"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Street Address, House No, Flat *"
                  required
                  value={newAddrData.address}
                  onChange={(e) => setNewAddrData({ ...newAddrData, address: e.target.value })}
                  className="neu-input w-full p-2.5 text-xs font-bold text-slate-800"
                />

                <div className="grid grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    placeholder="PIN Code *"
                    required
                    maxLength="6"
                    value={newAddrData.postalCode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      let city = newAddrData.city;
                      let state = newAddrData.state;
                      if (val.length === 6) {
                        const resolved = resolvePincode(val);
                        city = resolved.city;
                        state = resolved.state;
                      }
                      setNewAddrData({ ...newAddrData, postalCode: val, city, state });
                    }}
                    className="neu-input p-2.5 text-xs font-black text-slate-800"
                  />
                  <input
                    type="text"
                    placeholder="City *"
                    required
                    value={newAddrData.city}
                    onChange={(e) => setNewAddrData({ ...newAddrData, city: e.target.value })}
                    className="neu-input p-2.5 text-xs font-bold text-slate-800"
                  />
                  <input
                    type="text"
                    placeholder="State *"
                    required
                    value={newAddrData.state}
                    onChange={(e) => setNewAddrData({ ...newAddrData, state: e.target.value })}
                    className="neu-input p-2.5 text-xs font-bold text-slate-800"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="neu-btn-primary flex-1 py-3 text-white font-black text-xs rounded-xl shadow-md cursor-pointer"
                  >
                    Save & Deliver Here
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddAddressForm(false)}
                    className="neu-btn px-4 py-3 text-xs font-bold text-slate-600 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
