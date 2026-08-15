import React, { createContext, useContext, useState, useEffect } from 'react';
import { signUpUser, signInUser, signInAdmin, signOutUser, signInWithGoogle, onAuthChange } from '../services/firebaseAuth';
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
    const saved = sessionStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => sessionStorage.getItem('token') || '');
  const [role, setRole] = useState(() => {
    const savedUser = sessionStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      return isUserAdmin(parsed.email) ? 'admin' : 'user';
    }
    return 'user';
  });
  const [loading, setLoading] = useState(true);

  // Subscribe to Firebase Authentication State Changes (Session Isolated)
  useEffect(() => {
    seedInitialDataIfEmpty();

    const unsubscribe = onAuthChange((firebaseUser) => {
      if (firebaseUser && firebaseUser.email) {
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
        // Complete purge on tab closure or logout
        setUser(null);
        setRole('user');
        setToken('');
        sessionStorage.clear();
        localStorage.clear();
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
