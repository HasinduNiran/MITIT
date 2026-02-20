// src/components/ProtectedRoute.jsx
// Route guard for authenticated pages.
//
// While auth state is being restored from localStorage (isLoading = true),
// shows a full-screen spinner to avoid a flash-redirect to /login.
// Once loaded, redirects unauthenticated users to /login, passing
// the attempted URL via state so post-login redirect is possible.

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show a loading screen while localStorage state is being restored
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          {/* Blue spinner ring */}
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-500 text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to /login.
  // Pass current location in state so login page can redirect back after success.
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
