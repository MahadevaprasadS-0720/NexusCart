import React, { useState } from 'react';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Plus,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Save,
  Check,
  Edit3,
  X,
  Sparkles,
  Shield,
  Home as HomeIcon,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAddress } from '../context/AddressContext';
import { api } from '../services/api';

const UserProfile = () => {
  const { user } = useAuth();
  const {
    addresses,
    selectedAddressId,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    selectAddress,
    resolvePincode
  } = useAddress();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'addresses'

  const [profileData, setProfileData] = useState({
    name: user ? user.name : 'Mahadevaprasad',
    email: user ? user.email : 'user@example.com',
    phone: '+91 9876543210',
    role: user ? user.role : 'user'
  });

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  const [addressFormData, setAddressFormData] = useState({
    fullName: user ? user.name : '',
    phone: '+91 9876543210',
    address: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '',
    addressType: 'Home',
    isDefault: false
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');

    try {
      if (user && (user.uid || user.id)) {
        await api.updateUserProfile(user.uid || user.id, {
          name: profileData.name,
          phone: profileData.phone,
          addresses
        });
      }
      setSuccessMsg('Profile details successfully updated!');
    } catch (e) {
      setSuccessMsg('Profile updated locally!');
    } finally {
      setSaving(false);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const handleOpenAddModal = () => {
    setEditingAddressId(null);
    setAddressFormData({
      fullName: user ? user.name : '',
      phone: '+91 9876543210',
      address: '',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '',
      addressType: 'Home',
      isDefault: addresses.length === 0
    });
    setShowAddressModal(true);
  };

  const handleOpenEditModal = (addr) => {
    setEditingAddressId(addr.id);
    setAddressFormData({
      fullName: addr.fullName,
      phone: addr.phone,
      address: addr.address,
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      addressType: addr.addressType || 'Home',
      isDefault: addr.isDefault || false
    });
    setShowAddressModal(true);
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!addressFormData.postalCode || addressFormData.postalCode.length !== 6) {
      alert('Please enter a valid 6-digit postal PIN code.');
      return;
    }

    if (editingAddressId) {
      await updateAddress(editingAddressId, addressFormData);
      setSuccessMsg('Address updated successfully!');
    } else {
      await addAddress(addressFormData, addressFormData.isDefault);
      setSuccessMsg('New delivery address saved & set as active!');
    }

    setShowAddressModal(false);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handlePincodeInput = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    let city = addressFormData.city;
    let state = addressFormData.state;
    if (val.length === 6) {
      const res = resolvePincode(val);
      city = res.city;
      state = res.state;
    }
    setAddressFormData({
      ...addressFormData,
      postalCode: val,
      city,
      state
    });
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-8 font-['Inter'] space-y-6">
      
      {/* Header Profile Summary */}
      <div className="neu-card p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full neu-btn-circle bg-amber-500 text-white flex items-center justify-center text-2xl font-black shrink-0 shadow-sm">
          {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit']">
              {profileData.name}
            </h1>
            <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[11px] font-black neu-card-inset text-amber-700 w-fit mx-auto sm:mx-0">
              <Sparkles className="w-3 h-3 text-amber-500" /> NexusCart Verified
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-500">{profileData.email}</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 neu-card-inset p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'neu-btn text-amber-700 bg-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Personal Info
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'addresses'
                ? 'neu-btn text-amber-700 bg-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Saved Addresses ({addresses.length})</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMsg && (
        <div className="neu-card-inset p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-black flex items-center gap-2 border border-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* ================= TAB 1: PERSONAL INFO ================= */}
      {activeTab === 'profile' && (
        <div className="neu-card p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="text-base sm:text-lg font-black text-slate-900 font-['Outfit']">
              Personal & Account Information
            </h2>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-5 max-w-2xl">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="neu-input w-full pl-10 pr-4 py-3 text-xs font-bold text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Email Address (Login)</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  disabled
                  value={profileData.email}
                  className="neu-input w-full pl-10 pr-4 py-3 text-xs font-bold text-slate-500 bg-slate-100 cursor-not-allowed opacity-80"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Phone / Mobile</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="neu-input w-full pl-10 pr-4 py-3 text-xs font-bold text-slate-800"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="neu-btn-primary px-6 py-3 text-white font-black text-xs rounded-2xl flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving Changes...' : 'Save Profile Details'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= TAB 2: SAVED ADDRESSES PANEL ================= */}
      {activeTab === 'addresses' && (
        <div className="neu-card p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 font-['Outfit']">
                My Delivery Addresses ({addresses.length})
              </h2>
              <p className="text-xs text-slate-500 font-semibold">
                Manage your home, office, and preferred shipping locations
              </p>
            </div>

            <button
              onClick={handleOpenAddModal}
              className="neu-btn-primary px-5 py-2.5 text-white font-black text-xs rounded-2xl flex items-center gap-1.5 shadow-md cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Address</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {addresses.map((addr) => {
              const isSelected = selectedAddressId === addr.id;
              return (
                <div
                  key={addr.id}
                  className={`p-5 rounded-3xl space-y-3 transition-all relative border flex flex-col justify-between ${
                    isSelected
                      ? 'neu-card-inset bg-amber-50/40 border-amber-300'
                      : 'neu-card border-white/80'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-slate-900">{addr.fullName}</span>
                        {addr.addressType && (
                          <span className="text-[9px] font-black px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md">
                            {addr.addressType}
                          </span>
                        )}
                      </div>
                      {addr.isDefault && (
                        <span className="text-[9px] font-black px-2 py-0.5 bg-amber-500 text-white rounded-md">
                          Default
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {addr.address}
                    </p>
                    <p className="text-xs text-slate-900 font-black">
                      {addr.city}, {addr.state} - <span className="text-amber-600">{addr.postalCode}</span>
                    </p>
                    <p className="text-xs text-slate-500 font-bold flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" /> {addr.phone}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(addr)}
                        className="neu-btn p-2 rounded-xl text-slate-600 hover:text-amber-600 text-xs font-bold flex items-center gap-1 cursor-pointer"
                        title="Edit Address"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="neu-btn p-2 rounded-xl text-slate-500 hover:text-red-500 text-xs font-bold flex items-center gap-1 cursor-pointer"
                        title="Delete Address"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {isSelected ? (
                      <span className="text-xs font-black text-amber-700 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-amber-600 stroke-[3]" /> Active Deliver Here
                      </span>
                    ) : (
                      <button
                        onClick={() => selectAddress(addr.id)}
                        className="neu-btn px-3 py-1.5 rounded-xl text-[11px] font-black text-slate-700 hover:text-amber-600 cursor-pointer"
                      >
                        Deliver Here
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= ADD / EDIT ADDRESS MODAL ================= */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="neu-card p-6 sm:p-7 rounded-3xl w-full max-w-lg space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-black text-slate-900">
                  {editingAddressId ? 'Edit Delivery Address' : 'Add New Delivery Address'}
                </h3>
              </div>
              <button
                onClick={() => setShowAddressModal(false)}
                className="neu-btn w-7 h-7 rounded-lg flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddressSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Recipient's Name"
                    value={addressFormData.fullName}
                    onChange={(e) => setAddressFormData({ ...addressFormData, fullName: e.target.value })}
                    className="neu-input w-full p-2.5 text-xs font-bold text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Mobile Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="10-digit mobile number"
                    value={addressFormData.phone}
                    onChange={(e) => setAddressFormData({ ...addressFormData, phone: e.target.value })}
                    className="neu-input w-full p-2.5 text-xs font-bold text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Street Address, House No, Flat *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 402, Skyline Towers, MG Road"
                  value={addressFormData.address}
                  onChange={(e) => setAddressFormData({ ...addressFormData, address: e.target.value })}
                  className="neu-input w-full p-2.5 text-xs font-bold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">PIN Code *</label>
                  <input
                    type="text"
                    required
                    maxLength="6"
                    placeholder="6-digit PIN"
                    value={addressFormData.postalCode}
                    onChange={handlePincodeInput}
                    className="neu-input w-full p-2.5 text-xs font-black text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={addressFormData.city}
                    onChange={(e) => setAddressFormData({ ...addressFormData, city: e.target.value })}
                    className="neu-input w-full p-2.5 text-xs font-bold text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">State *</label>
                  <input
                    type="text"
                    required
                    placeholder="State"
                    value={addressFormData.state}
                    onChange={(e) => setAddressFormData({ ...addressFormData, state: e.target.value })}
                    className="neu-input w-full p-2.5 text-xs font-bold text-slate-800"
                  />
                </div>
              </div>

              {/* Address Type */}
              <div className="flex items-center gap-4 pt-1">
                <label className="text-xs font-bold text-slate-600">Address Type:</label>
                {['Home', 'Work', 'Other'].map(type => (
                  <label key={type} className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="addrType"
                      checked={addressFormData.addressType === type}
                      onChange={() => setAddressFormData({ ...addressFormData, addressType: type })}
                      className="accent-amber-500"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>

              {/* Default checkbox */}
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={addressFormData.isDefault}
                  onChange={(e) => setAddressFormData({ ...addressFormData, isDefault: e.target.checked })}
                  className="accent-amber-500"
                />
                <span>Set as default shipping address</span>
              </label>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="neu-btn-primary flex-1 py-3 text-white font-black text-xs rounded-xl shadow-md cursor-pointer"
                >
                  {editingAddressId ? 'Update Address' : 'Save Address'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="neu-btn px-4 py-3 text-xs font-bold text-slate-600 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserProfile;
