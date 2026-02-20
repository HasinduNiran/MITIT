// src/services/api.js
// Axios instance with base URL and JWT interceptor.
//
// Request interceptor: Automatically attaches the JWT from localStorage
//   to every outgoing request as a Bearer token.
// Response interceptor: Redirects to /login on 401 responses
//   (token expired or invalid) and clears stale auth data.

import axios from 'axios';

// Base URL comes from the .env file (VITE_API_URL=http://localhost:5000/api)
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor ───────────────────────────────────────────────────────
// Runs before every request. Reads the token from localStorage and
// injects it into the Authorization header.
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
// Runs after every response. Handles global 401 (unauthorized) errors
// by clearing auth state and redirecting to login.
API.interceptors.response.use(
  (response) => response, // Pass through successful responses unchanged
  (error) => {
    if (error.response?.status === 401) {
      // Clear stale auth data
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      // Redirect to login (using window.location for simplicity outside React Router)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth API Functions ────────────────────────────────────────────────────────
// Thin wrappers around Axios calls to keep components clean.

export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getProfile = () => API.get('/auth/profile');

export default API;
