// src/App.jsx
// Root component. Sets up React Router and wraps the entire app in AuthProvider.
//
// Route structure:
//   /          → redirect to /login
//   /register  → Register page (public)
//   /login     → Login page (public)
//   /dashboard → Dashboard page (protected — requires auth)
//   *          → 404 fallback

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

const App = () => {
  return (
    // AuthProvider wraps BrowserRouter so Navbar (which uses useNavigate)
    // has access to both auth context AND router context simultaneously.
    <AuthProvider>
      <BrowserRouter>
        {/* Navbar renders on every page */}
        <Navbar />

        <Routes>
          {/* Root → redirect to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public routes — accessible without authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected route — ProtectedRoute handles the auth guard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 fallback for unknown routes */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-slate-200">404</h1>
                  <p className="text-slate-500 mt-2 mb-6">Page not found</p>
                  <a
                    href="/login"
                    className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
                  >
                    Go to Login
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
