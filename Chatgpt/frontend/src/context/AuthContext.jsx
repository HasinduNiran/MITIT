// frontend/src/context/AuthContext.jsx
// Global auth state (token + user profile) with login/register/logout helpers.

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import api from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("auth_token"));
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Fetch current user when token exists.
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        if (!token) {
          if (!cancelled) {
            setUser(null);
            setInitializing(false);
          }
          return;
        }

        const res = await api.get("/api/auth/profile");
        if (!cancelled) {
          setUser(res.data.user);
          setInitializing(false);
        }
      } catch (err) {
        // Token may be expired/invalid.
        localStorage.removeItem("auth_token");
        if (!cancelled) {
          setToken(null);
          setUser(null);
          setInitializing(false);
        }
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, [token]);

  async function refreshProfile() {
    const res = await api.get("/api/auth/profile");
    setUser(res.data.user);
  }

  async function login({ email, password }) {
    const res = await api.post("/api/auth/login", { email, password });

    localStorage.setItem("auth_token", res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);

    toast.success("Welcome back!");
  }

  async function register({ name, email, password }) {
    const res = await api.post("/api/auth/register", { name, email, password });

    localStorage.setItem("auth_token", res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);

    toast.success("Account created successfully");
  }

  function logout() {
    localStorage.removeItem("auth_token");
    setToken(null);
    setUser(null);
    toast.success("Logged out");
  }

  const value = useMemo(
    () => ({
      token,
      user,
      initializing,
      login,
      register,
      logout,
      refreshProfile,
      isAuthenticated: Boolean(token),
    }),
    [token, user, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
