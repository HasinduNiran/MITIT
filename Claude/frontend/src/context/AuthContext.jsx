// src/context/AuthContext.jsx
// Global authentication state using React Context.
//
// Provides: { user, token, isAuthenticated, isLoading, login, register, logout }
// to any component in the tree without prop drilling.
//
// On mount, it restores auth state from localStorage so the user
// stays logged in across page refreshes.

import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { loginUser, registerUser } from '../services/api';

// Create the context (default value is undefined; checked in useAuth hook)
const AuthContext = createContext(undefined);

// ─── AuthProvider Component ───────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // True while restoring state

  // ─── Restore Auth State on Mount ────────────────────────────────────────────
  // Reads token and user from localStorage (persisted from previous session).
  // The isLoading flag prevents ProtectedRoute from redirecting before check.
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        // If stored JSON is malformed, clear it
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      }
    }

    setIsLoading(false); // Done restoring; ProtectedRoute can now check state
  }, []);

  // ─── Persist Auth State Helper ───────────────────────────────────────────────
  const persistAuth = (newToken, newUser) => {
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('authUser', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  // ─── Login ────────────────────────────────────────────────────────────────────
  const login = async (credentials) => {
    const response = await loginUser(credentials);
    const { token: newToken, user: newUser } = response.data;
    persistAuth(newToken, newUser);
    toast.success(`Welcome back, ${newUser.name}!`);
    return response.data;
  };

  // ─── Register ────────────────────────────────────────────────────────────────
  const register = async (userData) => {
    const response = await registerUser(userData);
    const { token: newToken, user: newUser } = response.data;
    persistAuth(newToken, newUser);
    toast.success(`Account created! Welcome, ${newUser.name}!`);
    return response.data;
  };

  // ─── Logout ───────────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setToken(null);
    setUser(null);
    toast.success('You have been signed out');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token, // Convert token presence to boolean
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ─── useAuth Hook ─────────────────────────────────────────────────────────────
// Custom hook for consuming AuthContext. Throws if used outside AuthProvider.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
};
