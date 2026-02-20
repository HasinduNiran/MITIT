// src/components/Navbar.jsx
// Top navigation bar with brand logo and conditional auth links.
// Shows Sign In / Sign Up when logged out; shows user name + Sign Out when logged in.

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Simple lock icon SVG (inline, no external icon library needed)
const LockIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // Mobile hamburger menu state

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* ── Brand Logo ── */}
          <Link
            to={isAuthenticated ? '/dashboard' : '/'}
            className="flex items-center gap-2 text-blue-600 font-bold text-xl hover:text-blue-700 transition-colors"
          >
            <span className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-1.5 rounded-lg">
              <LockIcon />
            </span>
            AuthSystem
          </Link>

          {/* ── Desktop Navigation ── */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Show user's name with avatar initial */}
                <div className="flex items-center gap-2 text-slate-600 text-sm">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-slate-500 hover:text-red-500 font-medium text-sm px-4 py-2 rounded-lg hover:bg-red-50 transition-all"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-slate-600 hover:text-blue-600 font-medium text-sm px-4 py-2 rounded-lg hover:bg-blue-50 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            className="sm:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* ── Mobile Menu Dropdown ── */}
        {menuOpen && (
          <div className="sm:hidden pb-4 animate-fadeIn">
            {isAuthenticated ? (
              <div className="flex flex-col gap-1">
                <div className="px-3 py-2 text-sm text-slate-500">
                  Signed in as <span className="font-medium text-slate-800">{user?.name}</span>
                </div>
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2 text-sm text-blue-600 font-semibold hover:bg-blue-50 rounded-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
