import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, isUserAdmin } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-slate-500 font-bold text-sm">Verifying authentication & admin credentials...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin Route Access Guard based purely on matching email
  if (adminOnly) {
    const isAdmin = isUserAdmin(user.email);
    if (!isAdmin) {
      // Redirect regular users away from admin dashboard
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
