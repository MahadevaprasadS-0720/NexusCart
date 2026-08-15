import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingBag, Lock, Mail, UserCheck, User, Sparkles, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { useAuth, isUserAdmin } from '../context/AuthContext';

// Helper to format clean, user-friendly auth errors
const formatAuthError = (error) => {
  const code = error?.code || error?.message || '';
  if (code.includes('user-not-found') || code.includes('invalid-credential') || code.includes('wrong-password')) {
    return 'Invalid email address or password. Please check your credentials.';
  }
  if (code.includes('email-already-in-use')) {
    return 'An account with this email address already exists. Please sign in instead.';
  }
  if (code.includes('weak-password')) {
    return 'Password is too weak. Please use at least 6 characters.';
  }
  if (code.includes('popup-closed-by-user')) {
    return 'Google sign-in was cancelled.';
  }
  return 'Authentication failed. Please verify your details.';
};

const Login = ({ initialMode = 'login' }) => {
  const [searchParams] = useSearchParams();
  const isAdminInitial = searchParams.get('admin') === 'true';

  const [authMode, setAuthMode] = useState(initialMode); // 'login' | 'signup'

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Signup extra state
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  // Instant Auto-Redirect if user is already signed in
  useEffect(() => {
    if (user && user.email) {
      const isAdmin = isUserAdmin(user.email) || user.role === 'admin';
      navigate(isAdmin ? '/admin' : '/', { replace: true });
    }
  }, [user, navigate]);

  // Direct Sign In / Sign Up Form Submission Handler with Console Error Logging
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (authMode === 'signup') {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please re-enter.');
        return;
      }

      setLoading(true);
      try {
        console.log('[Firebase Auth] Creating user:', email);
        // Direct Firebase Auth Registration
        const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        const newUser = userCredential.user;

        // Update profile displayName
        await updateProfile(newUser, { displayName: name.trim() }).catch(() => {});

        // Save user profile doc in Firestore silently
        setDoc(doc(db, 'users', newUser.uid), {
          uid: newUser.uid,
          id: newUser.uid,
          name: name.trim(),
          email: newUser.email.toLowerCase(),
          role: 'user',
          createdAt: new Date().toISOString()
        }, { merge: true }).catch(() => {});

        const isAdmin = isUserAdmin(newUser.email);
        setLoading(false);
        navigate(isAdmin ? '/admin' : '/', { replace: true });
      } catch (err) {
        setLoading(false);
        console.error('[Firebase Auth Error Code]:', err.code, '[Message]:', err.message, err);
        setError(formatAuthError(err));
      }
      return;
    }

    // Direct Firebase Auth Login
    setLoading(true);
    try {
      console.log('[Firebase Auth] Signing in user:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const loggedUser = userCredential.user;

      const isAdmin = isUserAdmin(loggedUser.email);
      setLoading(false);
      navigate(isAdmin ? '/admin' : '/', { replace: true });
    } catch (err) {
      setLoading(false);
      console.error('[Firebase Auth Error Code]:', err.code, '[Message]:', err.message, err);
      setError(formatAuthError(err));
    }
  };

  // Direct Google Social Auth Sign In Handler
  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      console.log('[Firebase Auth] Google Sign-In popup opening...');
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const googleUser = userCredential.user;

      setDoc(doc(db, 'users', googleUser.uid), {
        uid: googleUser.uid,
        id: googleUser.uid,
        name: googleUser.displayName || 'NexusCart Member',
        email: googleUser.email ? googleUser.email.toLowerCase() : '',
        role: 'user',
        createdAt: new Date().toISOString()
      }, { merge: true }).catch(() => {});

      const isAdmin = isUserAdmin(googleUser.email);
      setGoogleLoading(false);
      navigate(isAdmin ? '/admin' : '/', { replace: true });
    } catch (err) {
      setGoogleLoading(false);
      console.error('[Firebase Auth Error Code]:', err.code, '[Message]:', err.message, err);
      setError(formatAuthError(err));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-['Inter']">
      
      {/* Centered Glass Container */}
      <div className="w-full max-w-5xl bg-white/90 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        
        {/* Left Hero Panel (Desktop) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          
          {/* Subtle Grid Decor */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 space-y-6">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 flex items-center justify-center shadow-lg shadow-amber-400/20 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-6 h-6 text-slate-950" />
              </div>
              <div className="font-extrabold text-2xl font-['Outfit'] tracking-tight">
                NexusCart <span className="text-amber-400">Prime</span>
              </div>
            </Link>

            <div className="space-y-2 pt-4">
              <span className="px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-extrabold tracking-wider uppercase inline-flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Enterprise Edition
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight font-['Outfit'] leading-tight">
                Welcome to Your Ultimate Shopping Destination
              </h2>
              <p className="text-sm text-slate-300 font-medium leading-relaxed">
                Sign in to access 10,000+ lightning deals, fast express shipping, and seamless order tracking.
              </p>
            </div>
          </div>

          {/* Value Props Bullet Points */}
          <div className="relative z-10 space-y-3 pt-8 border-t border-slate-800 text-xs text-slate-300 font-medium">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>100% Safe Payments with Firebase Authorization</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Instant Order Confirmation & Tracking</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>24x7 Dedicated Customer Support</span>
            </div>
          </div>

        </div>

        {/* Right Form Panel */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-white">
          
          {/* Tab Switcher */}
          <div className="flex bg-slate-100/80 p-1.5 rounded-2xl mb-8 border border-slate-200/80 max-w-xs mx-auto w-full">
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setError(''); }}
              className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'login'
                  ? 'bg-white text-slate-900 shadow-md shadow-slate-950/5'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4 text-amber-500" /> Sign In
            </button>

            <button
              type="button"
              onClick={() => { setAuthMode('signup'); setError(''); }}
              className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'signup'
                  ? 'bg-white text-slate-900 shadow-md shadow-slate-950/5'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4 text-blue-500" /> Register
            </button>
          </div>

          <div className="mb-6 text-center">
            <h3 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
              {authMode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
            </h3>
            <p className="text-xs font-medium text-slate-500 mt-1">
              {authMode === 'signup'
                ? 'Sign up in seconds to start shopping prime marketplace deals'
                : 'Enter your account details to access your orders and wishlist'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-xs font-bold mb-6 text-center">
              {error}
            </div>
          )}

          {/* Main Auth Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            
            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-slate-50 text-slate-900 text-sm font-semibold pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 text-slate-900 text-sm font-semibold pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 text-slate-900 text-sm font-semibold pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 text-slate-900 text-sm font-semibold pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full font-extrabold text-sm py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] active:scale-98 cursor-pointer bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Authenticating with Firebase...
                </>
              ) : (
                <>
                  {authMode === 'signup' ? 'Create Account' : 'Sign In to NexusCart'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Google Social Authentication */}
          <div className="mt-6 space-y-4">
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider absolute">OR</span>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs py-3 px-4 rounded-xl border border-slate-200 flex items-center justify-center gap-3 transition-all shadow-sm hover:shadow cursor-pointer"
            >
              {googleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Sign in with Google</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Login;
