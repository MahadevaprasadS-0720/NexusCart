import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { useAuth, isUserAdmin } from '../context/AuthContext';
import { isTabSessionAuthenticated } from '../services/firebaseAuth';
import { auth } from '../firebaseConfig';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user: contextUser, loading: contextLoading } = useAuth();
  const [authState, setAuthState] = useState({
    isChecking: true,
    isAuthenticated: false,
    isAdminAuthorized: false
  });

  useEffect(() => {
    // Listen directly to live Firebase Auth state with token validation
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // Must have active Firebase user AND valid tab-isolated session
      if (!firebaseUser || !isTabSessionAuthenticated()) {
        setAuthState({
          isChecking: false,
          isAuthenticated: false,
          isAdminAuthorized: false
        });
        return;
      }

      try {
        // Validate fresh JWT token from Firebase auth server
        const token = await firebaseUser.getIdToken();
        if (!token) {
          setAuthState({
            isChecking: false,
            isAuthenticated: false,
            isAdminAuthorized: false
          });
          return;
        }

        const isAdmin = isUserAdmin(firebaseUser.email);
        setAuthState({
          isChecking: false,
          isAuthenticated: true,
          isAdminAuthorized: isAdmin
        });
      } catch (err) {
        setAuthState({
          isChecking: false,
          isAuthenticated: false,
          isAdminAuthorized: false
        });
      }
    });

    return () => unsubscribe();
  }, []);

  if (contextLoading || authState.isChecking) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-slate-500 font-bold text-sm">Verifying session token & tab credentials...</div>
      </div>
    );
  }

  // Redirect to login if user is not authenticated or tab session is invalid
  if (!authState.isAuthenticated || !contextUser) {
    return <Navigate to="/login" replace />;
  }

  // Admin Route Guard
  if (adminOnly && !authState.isAdminAuthorized) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

