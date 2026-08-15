import React, { createContext, useContext, useState, useEffect } from 'react';
import { signUpUser, signInUser, signInAdmin, signOutUser, onAuthChange } from '../services/firebaseAuth';
import { seedInitialDataIfEmpty } from '../services/firebaseDb';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [role, setRole] = useState(() => localStorage.getItem('role') || 'user');
  const [loading, setLoading] = useState(true);

  // Subscribe to Firebase Authentication State Changes
  useEffect(() => {
    // Seed initial data on startup if Firestore is fresh
    seedInitialDataIfEmpty();

    const unsubscribe = onAuthChange((firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setRole(firebaseUser.role || 'user');
        setToken(firebaseUser.uid);
        localStorage.setItem('user', JSON.stringify(firebaseUser));
        localStorage.setItem('role', firebaseUser.role || 'user');
        localStorage.setItem('token', firebaseUser.uid);
      } else {
        // Keep cached guest user if available
        const saved = localStorage.getItem('user');
        if (!saved) {
          setUser(null);
          setRole('user');
          setToken('');
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
      setUser(res.user);
      setRole(res.user.role);
      setToken(res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      localStorage.setItem('role', res.user.role);
      localStorage.setItem('token', res.token);
      return { success: true, user: res.user };
    }
    return { success: false, message: res.message };
  };

  const signup = async (name, email, password, requestedRole = 'user') => {
    const res = await signUpUser(name, email, password, requestedRole);
    if (res.success) {
      setUser(res.user);
      setRole(res.user.role);
      setToken(res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      localStorage.setItem('role', res.user.role);
      localStorage.setItem('token', res.token);
      return { success: true, user: res.user };
    }
    return { success: false, message: res.message };
  };

  const logout = async () => {
    await signOutUser();
    setUser(null);
    setToken('');
    setRole('user');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('adminDemo');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        isAdminMode: role === 'admin' || (user && user.role === 'admin'),
        login,
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
