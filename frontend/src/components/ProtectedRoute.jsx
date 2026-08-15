import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, isUserAdmin } from '../context/AuthContext';
import { auth } from '../firebaseConfig';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-slate-500 font-bold text-sm">Verifying Firebase session credentials...</div>
      </div>
    );
  }

  // Strict live check against Firebase Auth server object
  const currentAuthUser = auth.currentUser || user;

  if (!currentAuthUser) {
    return <Navigate to="/login" replace />;
  }

  // Admin Route Access Guard based strictly on matching auth server email
  if (adminOnly) {
    const isAdmin = isUserAdmin(currentAuthUser.email);
    if (!isAdmin) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
