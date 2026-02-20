// src/pages/Dashboard.jsx
// Profile / Dashboard page — only accessible to authenticated users.
// Displays user profile info fetched live from GET /api/auth/profile,
// with a loading skeleton, profile card, and security status overview.

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProfile } from '../services/api';
import toast from 'react-hot-toast';

// Format ISO date string to human-readable form
const formatDate = (isoString) => {
  if (!isoString) return 'Unknown';
  return new Date(isoString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Get initials from a name (e.g. "John Doe" → "JD")
const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Fetch fresh profile data from the API on mount.
  // This confirms the JWT is still valid and gets the latest server-side data.
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        setProfileData(response.data.user);
      } catch {
        // 401 errors are handled globally by the Axios interceptor in services/api.js
        toast.error('Failed to load profile data');
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Use API response if available, fall back to cached context data
  const displayUser = profileData || user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">

        {/* ── Welcome Header ── */}
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-3xl font-bold text-slate-800">
            Welcome back,{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {displayUser?.name?.split(' ')[0]}
            </span>
            !
          </h1>
          <p className="text-slate-500 mt-1">Here&apos;s your account overview</p>
        </div>

        {isLoadingProfile ? (
          // Loading skeleton — shown while API call is in flight
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-8">
            <div className="animate-pulse space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-slate-200 rounded-full" />
                <div className="space-y-2 flex-1">
                  <div className="h-5 bg-slate-200 rounded w-1/3" />
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
              <div className="h-px bg-slate-100" />
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-3 bg-slate-200 rounded w-1/3" />
                    <div className="h-4 bg-slate-200 rounded w-2/3" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-slideUp">

            {/* ── Profile Card ── */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
              {/* Blue gradient banner at the top of the card */}
              <div className="h-28 bg-gradient-to-r from-blue-600 to-indigo-600" />

              <div className="px-8 pb-8">
                {/* Avatar — overlaps the gradient banner */}
                <div className="-mt-12 mb-4 flex items-end justify-between">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-white text-2xl font-bold">
                    {getInitials(displayUser?.name)}
                  </div>
                  {/* Verified badge */}
                  <span className="mb-1 inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-slate-800">{displayUser?.name}</h2>
                <p className="text-slate-500 text-sm mt-0.5">{displayUser?.email}</p>

                <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Account ID */}
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
                      Account ID
                    </p>
                    <p className="text-sm text-slate-700 font-mono bg-slate-50 px-3 py-2 rounded-lg truncate">
                      {displayUser?.id}
                    </p>
                  </div>
                  {/* Member Since */}
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
                      Member Since
                    </p>
                    <p className="text-sm font-medium text-slate-700">
                      {formatDate(displayUser?.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Security Status Card ── */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Security Status
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Password Encryption', value: 'bcrypt (salt rounds: 12)' },
                  { label: 'Session Token', value: 'JWT — 1 hour expiry' },
                  { label: 'Transport Security', value: 'Helmet HTTP headers' },
                  { label: 'Rate Limiting', value: '5 requests / 15 minutes' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
                  >
                    <span className="text-sm text-slate-600">{item.label}</span>
                    <span className="flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Sign Out Button ── */}
            <button
              onClick={handleLogout}
              className="w-full py-3 px-6 border-2 border-red-200 text-red-500 font-semibold rounded-xl hover:bg-red-50 hover:border-red-300 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>

          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
