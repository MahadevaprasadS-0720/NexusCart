import React, { useState, useEffect } from 'react';
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
  Edit3,
  X,
  Sparkles,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const UserProfile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'addresses'

  const [profileData, setProfileData] = useState({
    name: user ? user.name : 'Alex Johnson',
    email: user ? user.email : 'alex@example.com',
    phone: '+91 9876543210',
    role: user ? user.role : 'user'
  });

  const [addresses, setAddresses] = useState([
    {
      id: 'addr-1',
      fullName: user ? user.name : 'Alex Johnson',
      phone: '+91 9876543210',
      address: 'Flat 402, Skyline Towers, MG Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560001',
      isDefault: true
    }
  ]);

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: user ? user.name : '',
    phone: '+91 9876543210',
    address: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '',
    isDefault: false
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (user && (user.uid || user.id)) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    try {
      const res = await api.getUserProfile(user.uid || user.id);
      if (res.success && res.profile) {
        setProfileData({
          name: res.profile.name || user.name,
          email: res.profile.email || user.email,
          phone: res.profile.phone || '+91 9876543210',
          role: res.profile.role || user.role || 'user'
        });

        if (res.profile.addresses && res.profile.addresses.length) {
          setAddresses(res.profile.addresses);
        }
      }
    } catch (e) {}
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');

    try {
      await api.updateUserProfile(user.uid || user.id, {
        name: profileData.name,
        phone: profileData.phone,
        addresses
      });
      setSuccessMsg('Profile details successfully updated in Firestore!');
    } catch (e) {
      setSuccessMsg('Profile updated locally!');
    } finally {
      setSaving(false);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const createdAddress = {
      ...newAddress,
      id: `addr-${Date.now()}`
    };

    let updatedList = [...addresses];
    if (createdAddress.isDefault) {
      updatedList = updatedList.map(a => ({ ...a, isDefault: false }));
    }
    updatedList.push(createdAddress);

    setAddresses(updatedList);
    setShowAddressModal(false);

    try {
      await api.updateUserProfile(user.uid || user.id, { addresses: updatedList });
      setSuccessMsg('New shipping address saved to Firestore!');
    } catch (e) {}
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleDeleteAddress = async (id) => {
    const updatedList = addresses.filter(a => a.id !== id);
    setAddresses(updatedList);

    try {
      await api.updateUserProfile(user.uid || user.id, { addresses: updatedList });
    } catch (e) {}
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-8 font-['Inter'] space-y-6">
      {/* Header Profile Summary */}
      <div className="neu-card p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full neu-btn-circle bg-amber-500 text-white flex items-center justify-center text-2xl font-black shrink-0 shadow-sm">
          {profileData.name.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit']">
              {profileData.name}
            </h1>
            <span className="neu-badge px-3 py-0.5 text-[10px] font-black text-amber-700 uppercase self-center sm:self-auto">
              {profileData.role === 'admin' ? 'Store Administrator' : 'Verified Prime Member'}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-semibold">
            {profileData.email} • {profileData.phone}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex neu-card p-1.5 rounded-2xl gap-2">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'profile'
              ? 'neu-card-inset text-amber-700 font-black shadow-inner'
              : 'neu-btn text-slate-600 hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4 text-amber-500" /> Personal Profile
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'addresses'
              ? 'neu-card-inset text-amber-700 font-black shadow-inner'
              : 'neu-btn text-slate-600 hover:text-slate-900'
          }`}
        >
          <MapPin className="w-4 h-4 text-blue-500" /> Saved Addresses ({addresses.length})
        </button>
      </div>

      {/* Notification Toast */}
      {successMsg && (
        <div className="neu-card p-4 rounded-2xl text-xs font-black text-emerald-800 bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 shadow-sm animate-float">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* TAB 1: PERSONAL DETAILS */}
      {activeTab === 'profile' && (
        <form onSubmit={handleProfileSave} className="neu-card p-6 sm:p-8 rounded-3xl space-y-6">
          <h3 className="text-base font-black text-slate-900 font-['Outfit']">
            Edit Personal Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="neu-input w-full px-4 py-2.5 text-xs font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address (Read-only)
              </label>
              <input
                type="email"
                disabled
                value={profileData.email}
                className="neu-card-inset w-full px-4 py-2.5 text-xs font-semibold text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="neu-input w-full px-4 py-2.5 text-xs font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Account Role
              </label>
              <input
                type="text"
                disabled
                value={profileData.role === 'admin' ? 'Store Administrator' : 'Verified Customer'}
                className="neu-card-inset w-full px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="neu-btn-primary px-6 py-2.5 rounded-2xl text-xs font-black text-white flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: SAVED ADDRESSES */}
      {activeTab === 'addresses' && (
        <div className="neu-card p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900 font-['Outfit']">
                Saved Shipping Addresses ({addresses.length})
              </h3>
              <p className="text-xs text-slate-500">Manage destination addresses for fast one-click checkout</p>
            </div>

            <button
              onClick={() => setShowAddressModal(true)}
              className="neu-btn-primary px-4 py-2 rounded-2xl text-xs font-black text-white flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Address
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="neu-card p-5 rounded-2xl flex flex-col justify-between space-y-3 relative"
              >
                {addr.isDefault && (
                  <span className="absolute top-3 right-3 neu-badge px-2.5 py-0.5 text-[9px] font-black text-amber-600 uppercase">
                    Default
                  </span>
                )}

                <div className="space-y-1 text-xs">
                  <div className="font-black text-sm text-slate-900">{addr.fullName}</div>
                  <div className="text-slate-600 leading-relaxed">{addr.address}</div>
                  <div className="text-slate-600">{addr.city}, {addr.state} - {addr.postalCode}</div>
                  <div className="text-slate-400 font-bold pt-1">Phone: {addr.phone}</div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="neu-btn p-2 rounded-xl text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                    title="Delete Address"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD ADDRESS MODAL */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="neu-card p-6 sm:p-8 rounded-3xl w-full max-w-lg space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-slate-900">Add New Delivery Address</h3>
              <button
                onClick={() => setShowAddressModal(false)}
                className="neu-btn w-8 h-8 rounded-xl flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="space-y-4">
              <div>
                <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newAddress.fullName}
                  onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                  className="neu-input w-full px-4 py-2.5 text-xs font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">
                  Street Address & Flat / Building *
                </label>
                <input
                  type="text"
                  required
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                  className="neu-input w-full px-4 py-2.5 text-xs font-semibold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="neu-input w-full px-4 py-2.5 text-xs font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    Postal Pincode
                  </label>
                  <input
                    type="text"
                    required
                    value={newAddress.postalCode}
                    onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                    className="neu-input w-full px-4 py-2.5 text-xs font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="neu-btn px-5 py-2.5 rounded-2xl text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="neu-btn-primary px-6 py-2.5 rounded-2xl text-xs font-black text-white shadow-md"
                >
                  Save Address
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
