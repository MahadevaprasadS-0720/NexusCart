import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signUpUser,
  signInUser,
  signInAdmin,
  signOutUser,
  signInWithGoogle,
  onAuthChange
} from '../services/firebaseAuth';
import { seedInitialDataIfEmpty } from '../services/firebaseDb';

// Dedicated Admin Email Constant
export const ADMIN_EMAIL = "smahi.072006@gmail.com";

// Helper function to verify if a user email matches authorized Admin credentials
export const isUserAdmin = (userEmail) => {
  if (!userEmail) return false;
  const emailToTest = userEmail.toLowerCase().trim();
  const targetAdmin = ADMIN_EMAIL.toLowerCase().trim();
  return emailToTest === targetAdmin || emailToTest === "admin@ecommerce.com";
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('user') || localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  const [token, setToken] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('token') || localStorage.getItem('token') || '';
    }
    return '';
  });

  const [role, setRole] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedUser = sessionStorage.getItem('user') || localStorage.getItem('user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        return isUserAdmin(parsed.email) ? 'admin' : (parsed.role || 'user');
      }
    }
    return 'user';
  });

  const [loading, setLoading] = useState(true);

  // Subscribe to Firebase Authentication State Changes
  useEffect(() => {
    seedInitialDataIfEmpty().catch(() => {});

    const unsubscribe = onAuthChange((firebaseUser) => {
      if (firebaseUser && firebaseUser.email) {
        const isAdmin = isUserAdmin(firebaseUser.email) || firebaseUser.role === 'admin';
        const computedRole = isAdmin ? 'admin' : 'user';
        const userObj = { ...firebaseUser, role: computedRole };

        setUser(userObj);
        setRole(computedRole);
        setToken(firebaseUser.uid);

        if (typeof window !== 'undefined') {
          sessionStorage.setItem('user', JSON.stringify(userObj));
          sessionStorage.setItem('role', computedRole);
          sessionStorage.setItem('token', firebaseUser.uid);
          localStorage.setItem('user', JSON.stringify(userObj));
          localStorage.setItem('role', computedRole);
          localStorage.setItem('token', firebaseUser.uid);
        }
      } else {
        setUser(null);
        setRole('user');
        setToken('');
        if (typeof window !== 'undefined') {
          sessionStorage.clear();
          localStorage.clear();
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password, isAdminLogin = false) => {
    const res = isAdminLogin
      ? await signInAdmin(email, password)
      : await signInUser(email, password);

    if (res.success) {
      const isAdmin = isUserAdmin(res.user.email) || res.user.role === 'admin';
      const computedRole = isAdmin ? 'admin' : 'user';
      const userObj = { ...res.user, role: computedRole };

      setUser(userObj);
      setRole(computedRole);
      setToken(res.token);

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('user', JSON.stringify(userObj));
        sessionStorage.setItem('role', computedRole);
        sessionStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(userObj));
        localStorage.setItem('role', computedRole);
        localStorage.setItem('token', res.token);
      }
      return { success: true, user: userObj };
    }
    return { success: false, message: res.message };
  };

  const loginWithGoogle = async () => {
    const res = await signInWithGoogle();
    if (res.success) {
      const isAdmin = isUserAdmin(res.user.email) || res.user.role === 'admin';
      const computedRole = isAdmin ? 'admin' : 'user';
      const userObj = { ...res.user, role: computedRole };

      setUser(userObj);
      setRole(computedRole);
      setToken(res.token);

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('user', JSON.stringify(userObj));
        sessionStorage.setItem('role', computedRole);
        sessionStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(userObj));
        localStorage.setItem('role', computedRole);
        localStorage.setItem('token', res.token);
      }
      return { success: true, user: userObj };
    }
    return { success: false, message: res.message };
  };

  const signup = async (name, email, password, requestedRole = 'user') => {
    const res = await signUpUser(name, email, password, requestedRole);
    if (res.success) {
      const isAdmin = isUserAdmin(res.user.email) || res.user.role === 'admin';
      const computedRole = isAdmin ? 'admin' : 'user';
      const userObj = { ...res.user, role: computedRole };

      setUser(userObj);
      setRole(computedRole);
      setToken(res.token);

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('user', JSON.stringify(userObj));
        sessionStorage.setItem('role', computedRole);
        sessionStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(userObj));
        localStorage.setItem('role', computedRole);
        localStorage.setItem('token', res.token);
      }
      return { success: true, user: userObj };
    }
    return { success: false, message: res.message };
  };

  const logout = async () => {
    await signOutUser();
    setUser(null);
    setToken('');
    setRole('user');
    if (typeof window !== 'undefined') {
      sessionStorage.clear();
      localStorage.clear();
    }
  };

  const isAdmin = isUserAdmin(user?.email) || role === 'admin';

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
