import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, MapPin, Plus, Trash2, CheckCircle2, ShieldCheck, Save, Edit3, X } from 'lucide-react';
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
    phone: '+91 ',
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
    <div style={{ maxWidth: '950px', margin: '2.5rem auto', padding: '0 1.5rem' }}>
      {/* Header Profile Summary */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: '16px', padding: '2rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <div style={{ width: '70px', height: '70px', background: '#2874f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: '800' }}>
          {profileData.name.charAt(0).toUpperCase()}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{profileData.name}</h1>
            <span style={{ background: profileData.role === 'admin' ? '#0284c7' : '#16a34a', color: '#fff', fontSize: '0.72rem', fontWeight: '800', padding: '2px 8px', borderRadius: '12px', textTransform: 'uppercase' }}>
              {profileData.role === 'admin' ? 'Store Administrator' : 'Verified Customer'}
            </span>
          </div>
          <div style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '4px' }}>
            {profileData.email} • {profileData.phone}
          </div>
        </div>
      </div>

      {/* Profile & Address Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #e2e8f0', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('profile')}
          style={{
            padding: '0.8rem 1.4rem',
            border: 'none',
            background: 'none',
            fontWeight: '800',
            fontSize: '0.95rem',
            cursor: 'pointer',
            color: activeTab === 'profile' ? '#2874f0' : '#64748b',
            borderBottom: activeTab === 'profile' ? '3px solid #2874f0' : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <User size={18} /> Personal Details
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          style={{
            padding: '0.8rem 1.4rem',
            border: 'none',
            background: 'none',
            fontWeight: '800',
            fontSize: '0.95rem',
            cursor: 'pointer',
            color: activeTab === 'addresses' ? '#2874f0' : '#64748b',
            borderBottom: activeTab === 'addresses' ? '3px solid #2874f0' : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <MapPin size={18} /> Saved Delivery Addresses ({addresses.length})
        </button>
      </div>

      {successMsg && (
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', color: '#15803d', padding: '0.8rem 1.2rem', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={20} /> {successMsg}
        </div>
      )}

      {/* Tab 1: Personal Details */}
      {activeTab === 'profile' && (
        <form onSubmit={handleProfileSave} style={{ background: '#ffffff', borderRadius: '12px', padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={16} /> Full Name
            </label>
            <input
              type="text"
              required
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '0.3rem', fontSize: '0.95rem' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Phone size={16} /> Phone Number
            </label>
            <input
              type="text"
              required
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '0.3rem', fontSize: '0.95rem' }}
            />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Mail size={16} /> Email Address (Managed by Firebase Auth)
            </label>
            <input
              type="email"
              disabled
              value={profileData.email}
              style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #e2e8f0', marginTop: '0.3rem', fontSize: '0.95rem', background: '#f8fafc', color: '#64748b' }}
            />
          </div>

          <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                background: 'linear-gradient(135deg, #2874f0 0%, #1e5ec8 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '0.75rem 1.8rem',
                borderRadius: '8px',
                fontWeight: '800',
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Save size={18} /> {saving ? 'Saving to Firestore...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Saved Delivery Addresses */}
      {activeTab === 'addresses' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>Saved Shipping Locations</h3>
            <button
              onClick={() => setShowAddressModal(true)}
              style={{
                background: '#2874f0',
                color: '#ffffff',
                border: 'none',
                padding: '0.65rem 1.2rem',
                borderRadius: '8px',
                fontWeight: '800',
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <Plus size={18} /> Add New Address
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.2rem' }}>
            {addresses.map((addr) => (
              <div key={addr.id} style={{ background: '#ffffff', borderRadius: '12px', padding: '1.2rem', border: addr.isDefault ? '2px solid #2874f0' : '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.04)', position: 'relative' }}>
                {addr.isDefault && (
                  <span style={{ position: 'absolute', top: '12px', right: '12px', background: '#eff6ff', color: '#2874f0', fontSize: '0.72rem', fontWeight: '800', padding: '2px 8px', borderRadius: '12px' }}>
                    Default Address
                  </span>
                )}
                <div style={{ fontWeight: '800', fontSize: '1rem', color: '#0f172a', marginBottom: '0.4rem' }}>{addr.fullName}</div>
                <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.5' }}>
                  <div>{addr.address}</div>
                  <div>{addr.city}, {addr.state} - {addr.postalCode}</div>
                  <div style={{ marginTop: '0.4rem', fontWeight: '600', color: '#0f172a' }}>Phone: {addr.phone}</div>
                </div>

                <div style={{ marginTop: '1rem', paddingTop: '0.8rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', fontWeight: '700' }}
                  >
                    <Trash2 size={16} /> Delete Address
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Address Modal */}
      {showAddressModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: '1rem' }}>
          <div style={{ background: '#ffffff', width: '100%', maxWidth: '500px', borderRadius: '16px', padding: '2rem', border: '1px solid #cbd5e1', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', paddingBottom: '0.8rem', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>Add New Shipping Address</h3>
              <button onClick={() => setShowAddressModal(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddAddress} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569' }}>Full Name</label>
                <input
                  type="text"
                  required
                  value={newAddress.fullName}
                  onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '0.2rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569' }}>Phone Number</label>
                <input
                  type="text"
                  required
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '0.2rem' }}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569' }}>Street Address / Flat No.</label>
                <input
                  type="text"
                  required
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '0.2rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569' }}>City</label>
                <input
                  type="text"
                  required
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '0.2rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569' }}>PIN Code</label>
                <input
                  type="text"
                  required
                  value={newAddress.postalCode}
                  onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '0.2rem' }}
                />
              </div>

              <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.4rem' }}>
                <input
                  type="checkbox"
                  id="chkDefault"
                  checked={newAddress.isDefault}
                  onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                />
                <label htmlFor="chkDefault" style={{ fontSize: '0.85rem', fontWeight: '600', color: '#0f172a', cursor: 'pointer' }}>
                  Set as default delivery address
                </label>
              </div>

              <div style={{ gridColumn: 'span 2', display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
                <button
                  type="submit"
                  style={{ flex: 1, background: '#16a34a', color: '#ffffff', border: 'none', padding: '0.75rem', borderRadius: '8px', fontWeight: '800', cursor: 'pointer' }}
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
