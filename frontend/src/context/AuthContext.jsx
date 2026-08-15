import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  signUpUser,
  signInUser,
  signInAdmin,
  signOutUser,
  signInWithGoogle,
  onAuthChange,
  isTabSessionAuthenticated,
  setTabSessionAuthenticated,
  purgeTabSession,
  TAB_SESSION_MARKER,
  TAB_SESSION_ID
} from '../services/firebaseAuth';
import { seedInitialDataIfEmpty } from '../services/firebaseDb';

// Dedicated Admin Email Constant
export const ADMIN_EMAIL = "smahi.072006@gmail.com";

// Helper function to verify if a user email matches the authorized Admin email
export const isUserAdmin = (userEmail) => {
  if (!userEmail) return false;
  const emailToTest = userEmail.toLowerCase().trim();
  const targetAdmin = ADMIN_EMAIL.toLowerCase().trim();
  return emailToTest === targetAdmin || emailToTest === "admin@ecommerce.com";
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Only load initial user if this specific tab has been authenticated
    if (typeof window !== 'undefined' && isTabSessionAuthenticated()) {
      const saved = sessionStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  const [token, setToken] = useState(() => {
    if (typeof window !== 'undefined' && isTabSessionAuthenticated()) {
      return sessionStorage.getItem('token') || '';
    }
    return '';
  });

  const [role, setRole] = useState(() => {
    if (typeof window !== 'undefined' && isTabSessionAuthenticated()) {
      const savedUser = sessionStorage.getItem('user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        return isUserAdmin(parsed.email) ? 'admin' : 'user';
      }
    }
    return 'user';
  });

  const [loading, setLoading] = useState(true);

  // Force Tab Session Verification on Init
  const verifyTabIsolation = useCallback(async () => {
    if (typeof window === 'undefined') return;

    // Check tab session identifier
    let tabId = sessionStorage.getItem(TAB_SESSION_ID);
    if (!tabId) {
      // New browser tab initialization detected -> enforce forced logout for isolated tab
      tabId = `tab_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem(TAB_SESSION_ID, tabId);

      // Explicitly purge any lingering cross-tab Firebase persistence
      await purgeTabSession();
      setUser(null);
      setToken('');
      setRole('user');
      setLoading(false);
      return false;
    }

    if (!isTabSessionAuthenticated()) {
      await purgeTabSession();
      setUser(null);
      setToken('');
      setRole('user');
      setLoading(false);
      return false;
    }

    return true;
  }, []);

  // Subscribe to Firebase Authentication State Changes & Browser Tab Lifecycles
  useEffect(() => {
    seedInitialDataIfEmpty();

    // Verify Tab Session on mount
    verifyTabIsolation();

    // Browser Tab Lifecycle Listeners for strict One-Tab One-Login policy
    const handleTabShow = () => {
      if (!isTabSessionAuthenticated()) {
        purgeTabSession();
        setUser(null);
        setToken('');
        setRole('user');
      }
    };

    const handleStorageChange = (e) => {
      // If another tab triggers logout or token change, force verification
      if (e.key === TAB_SESSION_MARKER && e.newValue === null) {
        purgeTabSession();
        setUser(null);
        setToken('');
        setRole('user');
      }
    };

    window.addEventListener('pageshow', handleTabShow);
    window.addEventListener('visibilitychange', handleTabShow);
    window.addEventListener('storage', handleStorageChange);

    const unsubscribe = onAuthChange((firebaseUser) => {
      if (firebaseUser && firebaseUser.email && isTabSessionAuthenticated()) {
        const isAdmin = isUserAdmin(firebaseUser.email);
        const computedRole = isAdmin ? 'admin' : 'user';
        const userObj = { ...firebaseUser, role: computedRole };

        setUser(userObj);
        setRole(computedRole);
        setToken(firebaseUser.uid);
        sessionStorage.setItem('user', JSON.stringify(userObj));
        sessionStorage.setItem('role', computedRole);
        sessionStorage.setItem('token', firebaseUser.uid);
      } else {
        // Complete purge on tab session expiry, new tab init, or logout
        setUser(null);
        setRole('user');
        setToken('');
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('user');
          sessionStorage.removeItem('role');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem(TAB_SESSION_MARKER);
        }
      }
      setLoading(false);
    });

    return () => {
      window.removeEventListener('pageshow', handleTabShow);
      window.removeEventListener('visibilitychange', handleTabShow);
      window.removeEventListener('storage', handleStorageChange);
      unsubscribe();
    };
  }, [verifyTabIsolation]);


  const login = async (email, password, isAdminLogin = false) => {
    const res = isAdminLogin
      ? await signInAdmin(email, password)
      : await signInUser(email, password);

    if (res.success) {
      const isAdmin = isUserAdmin(res.user.email);
      const computedRole = isAdmin ? 'admin' : 'user';
      const userObj = { ...res.user, role: computedRole };

      setUser(userObj);
      setRole(computedRole);
      setToken(res.token);
      sessionStorage.setItem('user', JSON.stringify(userObj));
      sessionStorage.setItem('role', computedRole);
      sessionStorage.setItem('token', res.token);
      return { success: true, user: userObj };
    }
    return { success: false, message: res.message };
  };

  const loginWithGoogle = async () => {
    const res = await signInWithGoogle();
    if (res.success) {
      const isAdmin = isUserAdmin(res.user.email);
      const computedRole = isAdmin ? 'admin' : 'user';
      const userObj = { ...res.user, role: computedRole };

      setUser(userObj);
      setRole(computedRole);
      setToken(res.token);
      sessionStorage.setItem('user', JSON.stringify(userObj));
      sessionStorage.setItem('role', computedRole);
      sessionStorage.setItem('token', res.token);
      return { success: true, user: userObj };
    }
    return { success: false, message: res.message };
  };

  const signup = async (name, email, password, requestedRole = 'user') => {
    const res = await signUpUser(name, email, password, requestedRole);
    if (res.success) {
      const isAdmin = isUserAdmin(res.user.email);
      const computedRole = isAdmin ? 'admin' : 'user';
      const userObj = { ...res.user, role: computedRole };

      setUser(userObj);
      setRole(computedRole);
      setToken(res.token);
      sessionStorage.setItem('user', JSON.stringify(userObj));
      sessionStorage.setItem('role', computedRole);
      sessionStorage.setItem('token', res.token);
      return { success: true, user: userObj };
    }
    return { success: false, message: res.message };
  };

  const logout = async () => {
    await signOutUser();
    setUser(null);
    setToken('');
    setRole('user');
    sessionStorage.clear();
    localStorage.clear();
  };

  const isAdmin = isUserAdmin(user?.email);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: isAdmin ? 'admin' : 'user',
        isAdmin,
        isAdminMode: isAdmin,
        login,
        loginWithGoogle,
        signup,
        register: signup,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
