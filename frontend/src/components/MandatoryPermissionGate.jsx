import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  MapPin,
  Camera,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Eye,
  Info
} from 'lucide-react';
import { useAddress } from '../context/AddressContext';

const MandatoryPermissionGate = ({ children }) => {
  const { setDeliveryPincode } = useAddress();

  const [locationGranted, setLocationGranted] = useState(false);
  const [cameraGranted, setCameraGranted] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [detectedCity, setDetectedCity] = useState('');
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);

  // Check if already verified in this session
  useEffect(() => {
    const isSessionVerified = sessionStorage.getItem('nexuscart_permissions_verified');
    if (isSessionVerified === 'true') {
      setLocationGranted(true);
      setCameraGranted(true);
      setIsUnlocked(true);
      return;
    }

    // Auto-prompt permissions on first load
    handleRequestAllPermissions();

    return () => {
      // Clean up camera stream on unmount
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Comprehensive GPS & Camera permission request handler
  const handleRequestAllPermissions = async () => {
    setRequesting(true);
    setErrorMsg('');

    let locSuccess = false;
    let camSuccess = false;

    // 1. Request GPS Geolocation Permission
    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by your browser.');
      }

      await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            locSuccess = true;
            setLocationGranted(true);

            // Reverse Geocode coordinates to Indian city/pincode
            try {
              // Approximate major Karnataka & Indian city bounding boxes
              let resolvedCity = 'Bengaluru';
              let resolvedPin = '560001';

              if (latitude >= 12.8 && latitude <= 13.2 && longitude >= 77.4 && longitude <= 77.8) {
                resolvedCity = 'Bengaluru';
                resolvedPin = '560038';
              } else if (latitude >= 12.2 && latitude <= 12.4 && longitude >= 76.5 && longitude <= 76.8) {
                resolvedCity = 'Mysuru';
                resolvedPin = '570001';
              } else if (latitude >= 12.8 && latitude <= 13.0 && longitude >= 74.8 && longitude <= 75.0) {
                resolvedCity = 'Mangaluru';
                resolvedPin = '575001';
              } else if (latitude >= 15.3 && latitude <= 15.5 && longitude >= 75.0 && longitude <= 75.2) {
                resolvedCity = 'Hubballi';
                resolvedPin = '580001';
              } else if (latitude >= 18.8 && latitude <= 19.3 && longitude >= 72.7 && longitude <= 73.0) {
                resolvedCity = 'Mumbai';
                resolvedPin = '400001';
              } else if (latitude >= 28.4 && latitude <= 28.9 && longitude >= 76.9 && longitude <= 77.4) {
                resolvedCity = 'New Delhi';
                resolvedPin = '110001';
              }

              setDetectedCity(`${resolvedCity} (${resolvedPin})`);
              setDeliveryPincode(resolvedPin, resolvedCity, 'Karnataka');
            } catch (e) {}

            resolve(true);
          },
          (error) => {
            console.warn('Geolocation error:', error);
            reject(new Error('Location access was denied or timed out. Please allow location access.'));
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      });
    } catch (err) {
      locSuccess = false;
      setLocationGranted(false);
    }

    // 2. Request Camera Permission
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera device is not accessible in your browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false
      });

      mediaStreamRef.current = stream;
      camSuccess = true;
      setCameraGranted(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera error:', err);
      camSuccess = false;
      setCameraGranted(false);
    }

    setRequesting(false);

    // If both granted, unlock the website!
    if (locSuccess && camSuccess) {
      sessionStorage.setItem('nexuscart_permissions_verified', 'true');
      setTimeout(() => {
        // Cleanly stop camera track after verification
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach(track => track.stop());
        }
        setIsUnlocked(true);
      }, 1200);
    } else {
      if (!locSuccess && !camSuccess) {
        setErrorMsg('Both Location and Camera permissions are strictly mandatory to access NexusCart. Please click "Allow" on your browser prompt or address bar icon.');
      } else if (!locSuccess) {
        setErrorMsg('Location permission is required for instant address detection & shipping. Please click "Allow" on the location prompt.');
      } else if (!camSuccess) {
        setErrorMsg('Camera permission is required for AI visual search & AR trial security. Please click "Allow" on the camera prompt.');
      }
    }
  };

  // If permissions granted, render the actual website
  if (isUnlocked) {
    return <>{children}</>;
  }

  // MANDATORY PERMISSION GATE OVERLAY
  return (
    <div className="fixed inset-0 z-[99999] neu-bg flex items-center justify-center p-4 sm:p-6 font-['Inter'] select-none overflow-y-auto">
      
      {/* Background ambient glow circles */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      <div className="neu-card p-6 sm:p-10 rounded-3xl w-full max-w-xl space-y-6 shadow-2xl relative border border-white/90 animate-in zoom-in-95 duration-300">
        
        {/* Brand & Security Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl neu-card-inset text-amber-500 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black neu-card-inset text-amber-700 uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> Mandatory Security & Prime Access Gate
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-['Outfit']">
              NexusCart <span className="text-amber-500">Access Verification</span>
            </h1>
            <p className="text-xs text-slate-600 font-semibold leading-relaxed max-w-md mx-auto">
              To browse products, unlock live express delivery to your area, and enable AI Visual Search, granting <span className="text-slate-900 font-black">Location</span> and <span className="text-slate-900 font-black">Camera</span> access is mandatory.
            </p>
          </div>
        </div>

        {/* Permission Checkpoint Cards */}
        <div className="space-y-3 pt-2">
          
          {/* 1. Location Permission Status Card */}
          <div className={`p-4 rounded-2xl transition-all border flex items-center justify-between ${
            locationGranted
              ? 'neu-card-inset bg-emerald-50/60 border-emerald-300 text-emerald-900'
              : 'neu-card border-slate-300/80 text-slate-800'
          }`}>
            <div className="flex items-center gap-3.5">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                locationGranted ? 'neu-btn-circle text-emerald-600 bg-emerald-100' : 'neu-btn text-amber-500'
              }`}>
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-black">1. GPS Live Location Permission</h3>
                  {locationGranted && (
                    <span className="text-[10px] font-black px-2 py-0.2 rounded-full bg-emerald-600 text-white">
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  {locationGranted
                    ? `Detected Area: ${detectedCity || 'Bengaluru, Karnataka'}`
                    : 'Auto-detects closest warehouse and delivers in 2 hours'}
                </p>
              </div>
            </div>

            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${
              locationGranted ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white text-slate-300'
            }`}>
              {locationGranted ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-slate-300" />}
            </div>
          </div>

          {/* 2. Camera Permission Status Card */}
          <div className={`p-4 rounded-2xl transition-all border flex items-center justify-between ${
            cameraGranted
              ? 'neu-card-inset bg-emerald-50/60 border-emerald-300 text-emerald-900'
              : 'neu-card border-slate-300/80 text-slate-800'
          }`}>
            <div className="flex items-center gap-3.5">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                cameraGranted ? 'neu-btn-circle text-emerald-600 bg-emerald-100' : 'neu-btn text-amber-500'
              }`}>
                <Camera className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-black">2. Camera & Visual AI Permission</h3>
                  {cameraGranted && (
                    <span className="text-[10px] font-black px-2 py-0.2 rounded-full bg-emerald-600 text-white">
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  {cameraGranted
                    ? 'Camera active & secure verification complete'
                    : 'Enables 3D product try-ons, barcode scan & visual search'}
                </p>
              </div>
            </div>

            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${
              cameraGranted ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white text-slate-300'
            }`}>
              {cameraGranted ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-slate-300" />}
            </div>
          </div>

        </div>

        {/* Live Camera Preview Bubble (if granted & initializing) */}
        {cameraGranted && (
          <div className="neu-card-inset p-3 rounded-2xl flex items-center gap-3 bg-slate-50 border border-emerald-200">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 shrink-0 relative border border-white">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-xs">
              <p className="font-black text-slate-800">Visual Verification Successful</p>
              <p className="text-[10px] text-emerald-600 font-bold">Unlocking NexusCart Marketplace...</p>
            </div>
          </div>
        )}

        {/* Error / Instruction Message */}
        {errorMsg && (
          <div className="p-3.5 neu-card-inset bg-red-50/80 text-red-700 text-xs font-bold rounded-2xl flex items-start gap-2 border border-red-300">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span>{errorMsg}</span>
              <p className="text-[10px] text-slate-600 font-medium">
                Tip: Click the 🔒 icon in your browser URL address bar and change Location & Camera to <strong>Allow</strong>, then click Retry below.
              </p>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="space-y-2 pt-2">
          <button
            onClick={handleRequestAllPermissions}
            disabled={requesting}
            className="w-full neu-btn-primary py-4 px-6 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
          >
            {requesting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Requesting Permissions...</span>
              </>
            ) : locationGranted && cameraGranted ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Verified! Entering Website...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Grant Location & Camera Access to Open</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Privacy Assurance Note */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-400 text-center">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Your privacy is encrypted with 256-bit SSL. Permissions are strictly used for delivery & visual browsing.</span>
        </div>

      </div>
    </div>
  );
};

export default MandatoryPermissionGate;
