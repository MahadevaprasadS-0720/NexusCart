import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, isUserAdmin } from '../context/AuthContext';
import { auth } from '../firebaseConfig';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center font-['Inter']">
        <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-lg border border-slate-200">
          <div className="w-5 h-5 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-700 font-extrabold text-sm">Verifying Firebase session...</span>
        </div>
      </div>
    );
  }

  const currentAuthUser = auth.currentUser || user;

  // If no user is logged in, redirect to login page
  if (!currentAuthUser || !user) {
    return <Navigate to="/login" replace />;
  }

  // Admin Route Access Guard
  if (adminOnly) {
    const userIsAdmin = isAdmin || isUserAdmin(currentAuthUser.email) || user?.role === 'admin';
    if (!userIsAdmin) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
