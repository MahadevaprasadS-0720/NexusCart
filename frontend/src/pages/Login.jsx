import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ShoppingBag, 
  Lock, 
  Mail, 
  UserCheck, 
  User, 
  Sparkles, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Zap, 
  KeyRound,
  ArrowLeft
} from 'lucide-react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { useAuth, isUserAdmin } from '../context/AuthContext';

// Helper to format clean, user-friendly auth errors for mobile & desktop
const formatAuthError = (error) => {
  const code = (error?.code || error?.message || '').toLowerCase();
  
  if (code.includes('database') || code.includes('closing') || code.includes('hidden') || code.includes('internal error')) {
    return 'Authentication failed. Please verify your email address and password.';
  }
  if (code.includes('user-not-found') || code.includes('invalid-credential') || code.includes('wrong-password')) {
    return 'Invalid email address or password. Please check your credentials.';
  }
  if (code.includes('email-already-in-use')) {
    return 'An account with this email address already exists. Please sign in instead.';
  }
  if (code.includes('weak-password')) {
    return 'Password is too weak. Please use at least 6 characters.';
  }
  if (code.includes('popup-blocked')) {
    return 'Google sign-in popup was blocked by your browser. Please allow popups or sign in with email.';
  }
  if (code.includes('popup-closed-by-user')) {
    return 'Google sign-in popup was closed before completing.';
  }
  return 'Authentication failed. Please verify your details.';
};

const Login = ({ initialMode = 'login' }) => {
  const [searchParams] = useSearchParams();
  const [authMode, setAuthMode] = useState(initialMode); // 'login' | 'signup'

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Signup extra state
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & Feedback state
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  // Instant Auto-Redirect if user is already signed in
  useEffect(() => {
    if (user && user.email) {
      const isAdmin = isUserAdmin(user.email) || user.role === 'admin';
      navigate(isAdmin ? '/admin' : '/', { replace: true });
    }
  }, [user, navigate]);

  // Quick Demo Auto-Fill
  const handleQuickFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  // Mobile-Optimized Form Submit Handler
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const cleanEmail = email.trim();

    // Password Reset Flow
    if (forgotPasswordMode) {
      if (!cleanEmail) {
        setError('Please enter your email address to receive password reset instructions.');
        return;
      }
      setLoading(true);
      try {
        await sendPasswordResetEmail(auth, cleanEmail);
        setLoading(false);
        setResetSent(true);
        setSuccessMessage('Password reset link sent to your email! Please check your inbox.');
      } catch (err) {
        setLoading(false);
        setError(formatAuthError(err));
      }
      return;
    }

    // Sign Up Flow
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
        console.log('[Firebase Auth] Registering user:', cleanEmail);
        const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        const newUser = userCredential.user;

        await updateProfile(newUser, { displayName: name.trim() }).catch(() => {});

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
        console.error('[Firebase Auth Error Code]:', err.code, err.message);
        setError(formatAuthError(err));
      }
      return;
    }

    // Sign In Login Flow
    setLoading(true);
    try {
      console.log('[Firebase Auth] Signing in user:', cleanEmail);
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const loggedUser = userCredential.user;

      const isAdmin = isUserAdmin(loggedUser.email);
      setLoading(false);
      navigate(isAdmin ? '/admin' : '/', { replace: true });
    } catch (err) {
      setLoading(false);
      console.error('[Firebase Auth Error Code]:', err.code, err.message);
      setError(formatAuthError(err));
    }
  };

  // Google Social Auth Sign In Handler
  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      console.log('[Firebase Auth] Opening Google Sign In Popup...');
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      
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
      console.error('[Firebase Auth Google Error]:', err.code, err.message);
      setError(formatAuthError(err));
    }
  };

  return (
    <div className="min-h-screen neu-bg py-8 sm:py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-['Inter'] relative overflow-hidden">
      
      {/* Soft Ambient Background Orbs */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-amber-200/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-sky-200/40 blur-3xl pointer-events-none" />

      {/* Main Neumorphic Card Container */}
      <div className="w-full max-w-4xl neu-card p-6 sm:p-10 md:p-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Branding & Highlights Column */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6 sm:space-y-8">
          
          <div>
            {/* Store Brand Link */}
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="neu-btn-circle text-amber-500 hover:text-amber-600 transition-colors">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-extrabold text-2xl font-['Outfit'] text-slate-800 tracking-tight flex items-center gap-1.5">
                  NexusCart <span className="text-amber-500 font-black">Prime</span>
                </h1>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
                  Official Storefront
                </p>
              </div>
            </Link>

            <div className="mt-8 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 neu-badge text-[11px] font-extrabold text-amber-600">
                <Sparkles className="w-3.5 h-3.5" /> Next-Gen Soft UI Auth
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-['Outfit'] leading-snug">
                {authMode === 'signup' ? 'Join NexusCart Today.' : 'Welcome to Seamless Shopping.'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                Access over 10,000+ lightning deals, fast express delivery, smart wishlist, and instant checkout.
              </p>
            </div>
          </div>

          {/* Neumorphic Value Props */}
          <div className="neu-card-inset p-4 space-y-3">
            <div className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>256-Bit Encrypted Secure Login</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
              <Zap className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Instant Order Tracking & Rewards</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
              <span>Verified Buyer & Admin Access</span>
            </div>
          </div>

          {/* Quick Demo Fill Pills for Testing */}
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
              ⚡ Quick Fill Credentials:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('smahi.072006@gmail.com', 'admin123')}
                className="neu-btn px-3 py-1.5 text-[11px] font-bold text-slate-700 flex items-center gap-1 hover:text-amber-600"
                title="Fill Admin credentials"
              >
                <KeyRound className="w-3 h-3 text-amber-500" /> Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('john@example.com', 'password123')}
                className="neu-btn px-3 py-1.5 text-[11px] font-bold text-slate-700 flex items-center gap-1 hover:text-sky-600"
                title="Fill Customer credentials"
              >
                <User className="w-3 h-3 text-sky-500" /> Demo User
              </button>
            </div>
          </div>

        </div>

        {/* Right Form Neumorphic Column */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          
          {/* Neumorphic Tab Switcher */}
          {!forgotPasswordMode && (
            <div className="neu-card-inset p-1.5 flex mb-6 max-w-xs mx-auto w-full">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setError(''); setSuccessMessage(''); }}
                className={`flex-1 py-2.5 px-4 font-extrabold text-xs transition-all flex items-center justify-center gap-2 ${
                  authMode === 'login' ? 'neu-tab-active' : 'neu-tab-inactive'
                }`}
              >
                <UserCheck className="w-4 h-4 text-amber-500" /> Sign In
              </button>

              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setError(''); setSuccessMessage(''); }}
                className={`flex-1 py-2.5 px-4 font-extrabold text-xs transition-all flex items-center justify-center gap-2 ${
                  authMode === 'signup' ? 'neu-tab-active' : 'neu-tab-inactive'
                }`}
              >
                <User className="w-4 h-4 text-sky-500" /> Register
              </button>
            </div>
          )}

          {/* Form Header */}
          <div className="text-center mb-6">
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 font-['Outfit']">
              {forgotPasswordMode
                ? 'Reset Your Password'
                : authMode === 'signup'
                ? 'Create New Account'
                : 'Sign In to Your Account'}
            </h3>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              {forgotPasswordMode
                ? 'Enter your registered email address to receive reset instructions'
                : authMode === 'signup'
                ? 'Fill in your details below to create your free account'
                : 'Enter your credentials to manage orders and wishlist'}
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="neu-card-inset bg-red-50/50 border border-red-200/60 text-red-600 px-4 py-3 rounded-2xl text-xs font-bold mb-5 text-center leading-snug">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="neu-card-inset bg-emerald-50/50 border border-emerald-200/60 text-emerald-700 px-4 py-3 rounded-2xl text-xs font-bold mb-5 text-center leading-snug">
              {successMessage}
            </div>
          )}

          {/* Main Auth Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            
            {/* Full Name (Sign Up Only) */}
            {authMode === 'signup' && !forgotPasswordMode && (
              <div>
                <label className="block text-xs font-extrabold text-slate-600 mb-1.5 ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Mahadeva Prasad"
                    className="neu-input w-full text-sm font-semibold pl-11 pr-4 py-3.5 placeholder:text-slate-400 placeholder:font-normal"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-xs font-extrabold text-slate-600 mb-1.5 ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  inputMode="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="neu-input w-full text-sm font-semibold pl-11 pr-4 py-3.5 placeholder:text-slate-400 placeholder:font-normal"
                />
              </div>
            </div>

            {/* Password */}
            {!forgotPasswordMode && (
              <div>
                <div className="flex items-center justify-between mb-1.5 ml-1">
                  <label className="block text-xs font-extrabold text-slate-600">
                    Password
                  </label>
                  {authMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => { setForgotPasswordMode(true); setError(''); setSuccessMessage(''); }}
                      className="text-[11px] font-bold text-amber-600 hover:text-amber-700 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoCapitalize="none"
                    autoCorrect="off"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="neu-input w-full text-sm font-semibold pl-11 pr-12 py-3.5 placeholder:text-slate-400 placeholder:font-normal"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Confirm Password (Sign Up Only) */}
            {authMode === 'signup' && !forgotPasswordMode && (
              <div>
                <label className="block text-xs font-extrabold text-slate-600 mb-1.5 ml-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoCapitalize="none"
                    autoCorrect="off"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="neu-input w-full text-sm font-semibold pl-11 pr-12 py-3.5 placeholder:text-slate-400 placeholder:font-normal"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                    title={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="neu-btn-primary w-full font-black text-sm min-h-[50px] py-3.5 px-6 flex items-center justify-center gap-2 mt-3 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                  <span>Processing...</span>
                </>
              ) : forgotPasswordMode ? (
                <>
                  <span>Send Password Reset Link</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : authMode === 'signup' ? (
                <>
                  <span>Create Free Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Sign In to NexusCart</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Back to Login from Forgot Password */}
            {forgotPasswordMode && (
              <button
                type="button"
                onClick={() => { setForgotPasswordMode(false); setError(''); setSuccessMessage(''); }}
                className="w-full text-center text-xs font-extrabold text-slate-600 hover:text-slate-900 py-2 flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Sign In
              </button>
            )}
          </form>

          {/* Social Sign-In (Google) */}
          {!forgotPasswordMode && (
            <div className="mt-6 space-y-4">
              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-300 w-full" />
                <span className="neu-bg px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest absolute">
                  OR CONTINUE WITH
                </span>
              </div>

              <div className="flex justify-center gap-4 pt-1">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                  className="neu-btn w-full py-3 px-4 font-extrabold text-xs text-slate-700 flex items-center justify-center gap-3 cursor-pointer"
                >
                  {googleLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
                  ) : (
                    <>
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                      <span>Continue with Google</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Footer Terms */}
          <p className="text-[11px] text-center text-slate-400 font-medium mt-6">
            By continuing, you agree to NexusCart's{' '}
            <span className="text-slate-600 font-bold underline cursor-pointer">Conditions of Use</span> and{' '}
            <span className="text-slate-600 font-bold underline cursor-pointer">Privacy Notice</span>.
          </p>

        </div>

      </div>

    </div>
  );
};

export default Login;
