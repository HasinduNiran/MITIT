// frontend/src/components/Navbar.jsx
// Top navigation bar with auth-aware links.

import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "rounded-md px-3 py-2 text-sm font-medium transition-colors",
          isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-700 hover:bg-slate-50 hover:text-slate-900",
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  function onLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-600 text-white shadow-sm">S</div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-slate-900">SecureAuth</div>
            <div className="text-xs text-slate-500">Authentication</div>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          {!isAuthenticated ? (
            <>
              <NavItem to="/login">Login</NavItem>
              <NavItem to="/register">Register</NavItem>
            </>
          ) : (
            <>
              <NavItem to="/dashboard">Profile</NavItem>
              <button
                type="button"
                onClick={onLogout}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Logout
              </button>
              <div className="hidden text-sm text-slate-600 sm:block">
                <span className="text-slate-400">Signed in as </span>
                <span className="font-medium text-slate-800">{user?.name || user?.email}</span>
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
