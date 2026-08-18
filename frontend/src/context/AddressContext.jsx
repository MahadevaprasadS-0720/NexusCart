import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

const AddressContext = createContext(null);

// Comprehensive Indian Pincode Resolver
export const resolvePincodeDetails = (pincodeStr, customCity = '', customState = '') => {
  const pin = String(pincodeStr).trim();
  if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
    return {
      pincode: pin,
      city: customCity || 'Bengaluru',
      state: customState || 'Karnataka',
      valid: false
    };
  }

  // Exact District / City Pincode Ranges
  const prefix2 = pin.substring(0, 2);
  const prefix3 = pin.substring(0, 3);

  // Karnataka
  if (prefix3 >= '560' && prefix3 <= '562') return { pincode: pin, city: 'Bengaluru', state: 'Karnataka', valid: true };
  if (prefix3 === '570' || prefix3 === '571') return { pincode: pin, city: 'Mysuru', state: 'Karnataka', valid: true };
  if (prefix3 === '575' || prefix3 === '574') return { pincode: pin, city: 'Mangaluru', state: 'Karnataka', valid: true };
  if (prefix3 === '580' || prefix3 === '581') return { pincode: pin, city: 'Hubballi-Dharwad', state: 'Karnataka', valid: true };
  if (prefix3 === '583') return { pincode: pin, city: 'Ballari', state: 'Karnataka', valid: true };
  if (prefix3 === '577') return { pincode: pin, city: 'Shivamogga', state: 'Karnataka', valid: true };
  if (prefix3 === '573') return { pincode: pin, city: 'Hassan', state: 'Karnataka', valid: true };
  if (prefix3 === '572') return { pincode: pin, city: 'Tumakuru', state: 'Karnataka', valid: true };
  if (prefix3 === '585') return { pincode: pin, city: 'Kalaburagi', state: 'Karnataka', valid: true };
  if (prefix3 === '586') return { pincode: pin, city: 'Vijayapura', state: 'Karnataka', valid: true };
  if (prefix3 === '590' || prefix3 === '591') return { pincode: pin, city: 'Belagavi', state: 'Karnataka', valid: true };
  if (prefix3 === '584') return { pincode: pin, city: 'Raichur', state: 'Karnataka', valid: true };
  if (prefix3 === '587') return { pincode: pin, city: 'Bagalkote', state: 'Karnataka', valid: true };

  // Maharashtra
  if (prefix3 >= '400' && prefix3 <= '401') return { pincode: pin, city: 'Mumbai', state: 'Maharashtra', valid: true };
  if (prefix3 === '411' || prefix3 === '412') return { pincode: pin, city: 'Pune', state: 'Maharashtra', valid: true };
  if (prefix3 === '440') return { pincode: pin, city: 'Nagpur', state: 'Maharashtra', valid: true };
  if (prefix3 === '431') return { pincode: pin, city: 'Aurangabad', state: 'Maharashtra', valid: true };
  if (prefix3 === '422') return { pincode: pin, city: 'Nashik', state: 'Maharashtra', valid: true };

  // Delhi NCR
  if (prefix2 === '11') return { pincode: pin, city: 'New Delhi', state: 'Delhi', valid: true };
  if (prefix3 === '201') return { pincode: pin, city: 'Noida / Ghaziabad', state: 'Uttar Pradesh', valid: true };
  if (prefix3 === '122') return { pincode: pin, city: 'Gurugram', state: 'Haryana', valid: true };
  if (prefix3 === '121') return { pincode: pin, city: 'Faridabad', state: 'Haryana', valid: true };

  // Tamil Nadu
  if (prefix3 >= '600' && prefix3 <= '603') return { pincode: pin, city: 'Chennai', state: 'Tamil Nadu', valid: true };
  if (prefix3 === '641') return { pincode: pin, city: 'Coimbatore', state: 'Tamil Nadu', valid: true };
  if (prefix3 === '625') return { pincode: pin, city: 'Madurai', state: 'Tamil Nadu', valid: true };

  // Telangana & AP
  if (prefix3 >= '500' && prefix3 <= '502') return { pincode: pin, city: 'Hyderabad', state: 'Telangana', valid: true };
  if (prefix3 === '530') return { pincode: pin, city: 'Visakhapatnam', state: 'Andhra Pradesh', valid: true };
  if (prefix3 === '520') return { pincode: pin, city: 'Vijayawada', state: 'Andhra Pradesh', valid: true };

  // West Bengal
  if (prefix3 >= '700' && prefix3 <= '702') return { pincode: pin, city: 'Kolkata', state: 'West Bengal', valid: true };

  // Gujarat
  if (prefix3 >= '380' && prefix3 <= '382') return { pincode: pin, city: 'Ahmedabad', state: 'Gujarat', valid: true };
  if (prefix3 === '395') return { pincode: pin, city: 'Surat', state: 'Gujarat', valid: true };
  if (prefix3 === '390') return { pincode: pin, city: 'Vadodara', state: 'Gujarat', valid: true };

  // Rajasthan
  if (prefix3 === '302') return { pincode: pin, city: 'Jaipur', state: 'Rajasthan', valid: true };

  // Kerala
  if (prefix3 === '682') return { pincode: pin, city: 'Kochi', state: 'Kerala', valid: true };
  if (prefix3 === '695') return { pincode: pin, city: 'Thiruvananthapuram', state: 'Kerala', valid: true };

  // Zone State Fallback Mapping
  const stateByZone = {
    '11': { city: customCity || 'Delhi', state: 'Delhi' },
    '12': { city: customCity || 'Haryana', state: 'Haryana' },
    '13': { city: customCity || 'Haryana', state: 'Haryana' },
    '14': { city: customCity || 'Punjab', state: 'Punjab' },
    '15': { city: customCity || 'Punjab', state: 'Punjab' },
    '16': { city: customCity || 'Chandigarh', state: 'Chandigarh' },
    '17': { city: customCity || 'Himachal Pradesh', state: 'Himachal Pradesh' },
    '18': { city: customCity || 'Jammu & Kashmir', state: 'Jammu & Kashmir' },
    '19': { city: customCity || 'Jammu & Kashmir', state: 'Jammu & Kashmir' },
    '20': { city: customCity || 'Uttar Pradesh', state: 'Uttar Pradesh' },
    '21': { city: customCity || 'Uttar Pradesh', state: 'Uttar Pradesh' },
    '22': { city: customCity || 'Lucknow', state: 'Uttar Pradesh' },
    '24': { city: customCity || 'Uttarakhand', state: 'Uttarakhand' },
    '25': { city: customCity || 'Meerut', state: 'Uttar Pradesh' },
    '26': { city: customCity || 'Uttarakhand', state: 'Uttarakhand' },
    '27': { city: customCity || 'Uttar Pradesh', state: 'Uttar Pradesh' },
    '28': { city: customCity || 'Agra', state: 'Uttar Pradesh' },
    '30': { city: customCity || 'Jaipur', state: 'Rajasthan' },
    '31': { city: customCity || 'Udaipur', state: 'Rajasthan' },
    '32': { city: customCity || 'Kota', state: 'Rajasthan' },
    '34': { city: customCity || 'Jodhpur', state: 'Rajasthan' },
    '36': { city: customCity || 'Rajkot', state: 'Gujarat' },
    '37': { city: customCity || 'Gujarat', state: 'Gujarat' },
    '38': { city: customCity || 'Ahmedabad', state: 'Gujarat' },
    '39': { city: customCity || 'Surat', state: 'Gujarat' },
    '40': { city: customCity || 'Mumbai', state: 'Maharashtra' },
    '41': { city: customCity || 'Pune', state: 'Maharashtra' },
    '42': { city: customCity || 'Nashik', state: 'Maharashtra' },
    '43': { city: customCity || 'Aurangabad', state: 'Maharashtra' },
    '44': { city: customCity || 'Nagpur', state: 'Maharashtra' },
    '45': { city: customCity || 'Indore', state: 'Madhya Pradesh' },
    '46': { city: customCity || 'Bhopal', state: 'Madhya Pradesh' },
    '47': { city: customCity || 'Gwalior', state: 'Madhya Pradesh' },
    '48': { city: customCity || 'Jabalpur', state: 'Madhya Pradesh' },
    '49': { city: customCity || 'Raipur', state: 'Chhattisgarh' },
    '50': { city: customCity || 'Hyderabad', state: 'Telangana' },
    '51': { city: customCity || 'Tirupati', state: 'Andhra Pradesh' },
    '52': { city: customCity || 'Vijayawada', state: 'Andhra Pradesh' },
    '53': { city: customCity || 'Visakhapatnam', state: 'Andhra Pradesh' },
    '56': { city: customCity || 'Bengaluru', state: 'Karnataka' },
    '57': { city: customCity || 'Mysuru', state: 'Karnataka' },
    '58': { city: customCity || 'Hubballi', state: 'Karnataka' },
    '59': { city: customCity || 'Belagavi', state: 'Karnataka' },
    '60': { city: customCity || 'Chennai', state: 'Tamil Nadu' },
    '61': { city: customCity || 'Thanjavur', state: 'Tamil Nadu' },
    '62': { city: customCity || 'Madurai', state: 'Tamil Nadu' },
    '63': { city: customCity || 'Vellore', state: 'Tamil Nadu' },
    '64': { city: customCity || 'Coimbatore', state: 'Tamil Nadu' },
    '67': { city: customCity || 'Kozhikode', state: 'Kerala' },
    '68': { city: customCity || 'Kochi', state: 'Kerala' },
    '69': { city: customCity || 'Thiruvananthapuram', state: 'Kerala' },
    '70': { city: customCity || 'Kolkata', state: 'West Bengal' },
    '71': { city: customCity || 'Howrah', state: 'West Bengal' },
    '72': { city: customCity || 'Midnapore', state: 'West Bengal' },
    '73': { city: customCity || 'Siliguri', state: 'West Bengal' },
    '75': { city: customCity || 'Bhubaneswar', state: 'Odisha' },
    '76': { city: customCity || 'Cuttack', state: 'Odisha' },
    '78': { city: customCity || 'Guwahati', state: 'Assam' },
    '79': { city: customCity || 'North East', state: 'Assam' },
    '80': { city: customCity || 'Patna', state: 'Bihar' },
    '81': { city: customCity || 'Bhagalpur', state: 'Bihar' },
    '82': { city: customCity || 'Gaya', state: 'Bihar' },
    '83': { city: customCity || 'Ranchi', state: 'Jharkhand' },
    '84': { city: customCity || 'Muzaffarpur', state: 'Bihar' }
  };

  const zoneMatch = stateByZone[prefix2];
  if (zoneMatch) {
    return {
      pincode: pin,
      city: customCity || zoneMatch.city,
      state: customState || zoneMatch.state,
      valid: true
    };
  }

  return {
    pincode: pin,
    city: customCity || 'India',
    state: customState || 'Karnataka',
    valid: true
  };
};

export const AddressProvider = ({ children }) => {
  const { user } = useAuth();

  // Initial Addresses
  const [addresses, setAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem('nexuscart_addresses');
      if (saved) return JSON.parse(saved);
    } catch (e) {}

    return [
      {
        id: 'addr-default-1',
        fullName: user?.name || 'Mahadevaprasad',
        phone: '+91 9876543210',
        address: 'No 45, 2nd Cross, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560038',
        country: 'India',
        isDefault: true,
        addressType: 'Home'
      }
    ];
  });

  // Active Selected Address for Checkout & Delivery
  const [selectedAddressId, setSelectedAddressId] = useState(() => {
    try {
      const savedId = localStorage.getItem('nexuscart_selected_address_id');
      if (savedId) return savedId;
    } catch (e) {}
    return 'addr-default-1';
  });

  // Current Delivery Location (used in Navbar & fast shipping estimates)
  const [deliveryLocation, setDeliveryLocation] = useState(() => {
    try {
      const savedLoc = localStorage.getItem('nexuscart_delivery_location');
      if (savedLoc) return JSON.parse(savedLoc);
    } catch (e) {}
    return {
      city: 'Bengaluru',
      pincode: '560038',
      state: 'Karnataka',
      address: 'Indiranagar'
    };
  });

  // Sync with Firestore profile if user is logged in
  useEffect(() => {
    if (user && (user.uid || user.id)) {
      loadUserAddressesFromAPI();
    }
  }, [user]);

  // Persist to localStorage whenever addresses change
  useEffect(() => {
    try {
      localStorage.setItem('nexuscart_addresses', JSON.stringify(addresses));
    } catch (e) {}
  }, [addresses]);

  // Persist active address ID
  useEffect(() => {
    try {
      localStorage.setItem('nexuscart_selected_address_id', selectedAddressId);
    } catch (e) {}
  }, [selectedAddressId]);

  // Persist delivery location
  useEffect(() => {
    try {
      localStorage.setItem('nexuscart_delivery_location', JSON.stringify(deliveryLocation));
    } catch (e) {}
  }, [deliveryLocation]);

  const loadUserAddressesFromAPI = async () => {
    try {
      const res = await api.getUserProfile(user.uid || user.id);
      if (res.success && res.profile && res.profile.addresses && res.profile.addresses.length) {
        setAddresses(res.profile.addresses);
        const def = res.profile.addresses.find(a => a.isDefault) || res.profile.addresses[0];
        if (def) {
          setSelectedAddressId(def.id);
          setDeliveryLocation({
            city: def.city || 'Bengaluru',
            pincode: def.postalCode || '560001',
            state: def.state || 'Karnataka',
            address: def.address || ''
          });
        }
      }
    } catch (e) {}
  };

  // Currently selected address object
  const selectedAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0] || {
    id: 'temp',
    fullName: user?.name || 'Guest User',
    phone: '+91 9876543210',
    address: 'Current Location',
    city: deliveryLocation.city,
    state: deliveryLocation.state,
    postalCode: deliveryLocation.pincode,
    country: 'India',
    isDefault: true
  };

  // Add Address
  const addAddress = async (newAddrData, setAsDefault = true) => {
    const resolved = resolvePincodeDetails(newAddrData.postalCode || '560001', newAddrData.city, newAddrData.state);
    
    const newAddressObj = {
      id: `addr-${Date.now()}`,
      fullName: newAddrData.fullName || user?.name || 'Customer',
      phone: newAddrData.phone || '+91 9876543210',
      address: newAddrData.address || '',
      city: newAddrData.city || resolved.city,
      state: newAddrData.state || resolved.state,
      postalCode: newAddrData.postalCode || resolved.pincode,
      country: newAddrData.country || 'India',
      addressType: newAddrData.addressType || 'Home',
      isDefault: setAsDefault || newAddrData.isDefault || addresses.length === 0
    };

    let updatedList = [...addresses];
    if (newAddressObj.isDefault) {
      updatedList = updatedList.map(a => ({ ...a, isDefault: false }));
    }
    updatedList.unshift(newAddressObj);

    setAddresses(updatedList);
    setSelectedAddressId(newAddressObj.id);

    // Update live delivery location everywhere
    setDeliveryLocation({
      city: newAddressObj.city,
      pincode: newAddressObj.postalCode,
      state: newAddressObj.state,
      address: newAddressObj.address
    });

    if (user && (user.uid || user.id)) {
      try {
        await api.updateUserProfile(user.uid || user.id, { addresses: updatedList });
      } catch (e) {}
    }

    return newAddressObj;
  };

  // Update Address
  const updateAddress = async (id, updatedData) => {
    const resolved = resolvePincodeDetails(updatedData.postalCode || '560001', updatedData.city, updatedData.state);

    const updatedList = addresses.map(addr => {
      if (addr.id === id) {
        return {
          ...addr,
          ...updatedData,
          city: updatedData.city || resolved.city,
          state: updatedData.state || resolved.state,
          postalCode: updatedData.postalCode || resolved.pincode
        };
      }
      return addr;
    });

    setAddresses(updatedList);

    // If updated address is the currently selected one, update delivery location
    if (selectedAddressId === id) {
      const active = updatedList.find(a => a.id === id);
      if (active) {
        setDeliveryLocation({
          city: active.city,
          pincode: active.postalCode,
          state: active.state,
          address: active.address
        });
      }
    }

    if (user && (user.uid || user.id)) {
      try {
        await api.updateUserProfile(user.uid || user.id, { addresses: updatedList });
      } catch (e) {}
    }
  };

  // Delete Address
  const deleteAddress = async (id) => {
    const updatedList = addresses.filter(a => a.id !== id);
    setAddresses(updatedList);

    if (selectedAddressId === id) {
      const nextAddr = updatedList[0];
      if (nextAddr) {
        setSelectedAddressId(nextAddr.id);
        setDeliveryLocation({
          city: nextAddr.city,
          pincode: nextAddr.postalCode,
          state: nextAddr.state,
          address: nextAddr.address
        });
      }
    }

    if (user && (user.uid || user.id)) {
      try {
        await api.updateUserProfile(user.uid || user.id, { addresses: updatedList });
      } catch (e) {}
    }
  };

  // Set Default Address
  const setDefaultAddress = async (id) => {
    const updatedList = addresses.map(a => ({
      ...a,
      isDefault: a.id === id
    }));
    setAddresses(updatedList);
    setSelectedAddressId(id);

    const active = updatedList.find(a => a.id === id);
    if (active) {
      setDeliveryLocation({
        city: active.city,
        pincode: active.postalCode,
        state: active.state,
        address: active.address
      });
    }

    if (user && (user.uid || user.id)) {
      try {
        await api.updateUserProfile(user.uid || user.id, { addresses: updatedList });
      } catch (e) {}
    }
  };

  // Select Active Address for Current Session & Checkout
  const selectAddress = (id) => {
    setSelectedAddressId(id);
    const active = addresses.find(a => a.id === id);
    if (active) {
      setDeliveryLocation({
        city: active.city,
        pincode: active.postalCode,
        state: active.state,
        address: active.address
      });
    }
  };

  // Quick Pincode Location Setter (from Navbar or Product page)
  const setDeliveryPincode = (pincode, customCity = '', customState = '') => {
    const res = resolvePincodeDetails(pincode, customCity, customState);
    const newLoc = {
      city: res.city,
      pincode: res.pincode,
      state: res.state,
      address: customCity ? `${customCity}, ${res.state}` : res.city
    };
    setDeliveryLocation(newLoc);

    // Also update current active address pincode/city if exists
    if (selectedAddress) {
      updateAddress(selectedAddress.id, {
        postalCode: res.pincode,
        city: res.city,
        state: res.state
      });
    }

    return newLoc;
  };

  const value = {
    addresses,
    selectedAddress,
    selectedAddressId,
    deliveryLocation,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    selectAddress,
    setDeliveryPincode,
    resolvePincode: resolvePincodeDetails
  };

  return (
    <AddressContext.Provider value={value}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error('useAddress must be used within an AddressProvider');
  }
  return context;
};
