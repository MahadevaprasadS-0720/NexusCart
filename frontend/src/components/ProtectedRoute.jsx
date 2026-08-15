import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, token, role } = useAuth();

  // If not logged in at all
  if (!token && !user) {
    return <Navigate to="/login" replace />;
  }

  // If route is restricted to admins only
  if (adminOnly) {
    const isAdmin = role === 'admin' || (user && user.role === 'admin');
    if (!isAdmin) {
      alert('Access Denied: You need Administrator privileges to access the Admin Dashboard.');
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
