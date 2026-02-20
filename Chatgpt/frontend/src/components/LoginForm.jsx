// frontend/src/components/LoginForm.jsx
// Login form with real-time validation, loading spinner, and remember-me.

import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

function Spinner() {
  return <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />;
}

function validateEmail(email) {
  // Simple, pragmatic email check for client UX.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [touched, setTouched] = useState({ email: false, password: false });
  const [loading, setLoading] = useState(false);

  // Prefill remembered email.
  useEffect(() => {
    const remembered = localStorage.getItem("remembered_email");
    if (remembered) setEmail(remembered);
  }, []);

  const errors = useMemo(() => {
    const next = {};

    if (!email) next.email = "Email is required";
    else if (!validateEmail(email)) next.email = "Enter a valid email";

    if (!password) next.password = "Password is required";

    return next;
  }, [email, password]);

  const canSubmit = Object.keys(errors).length === 0 && !loading;

  async function onSubmit(e) {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (!canSubmit) return;

    setLoading(true);
    try {
      await login({ email, password });

      if (rememberMe) localStorage.setItem("remembered_email", email);
      else localStorage.removeItem("remembered_email");

      navigate(redirectTo, { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.message || "Login failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-700">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          placeholder="you@company.com"
          type="email"
          autoComplete="email"
        />
        {touched.email && errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email}</p> : null}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Password</label>
        <div className="relative mt-1">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 pr-11 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            placeholder="••••••••"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute inset-y-0 right-0 grid w-11 place-items-center text-slate-500 hover:text-slate-700"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {/* Eye icon */}
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              {showPassword ? (
                <path d="M3 3l18 18M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58M9.88 5.09A9.94 9.94 0 0112 5c5 0 9 5 9 7 0 .64-1.07 2.55-2.98 4.2M6.12 6.12C3.73 7.73 2 10.2 2 12c0 2 4 7 10 7 1.09 0 2.12-.15 3.08-.42" />
              ) : (
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
              )}
              {!showPassword ? <circle cx="12" cy="12" r="3" /> : null}
            </svg>
          </button>
        </div>
        {touched.password && errors.password ? <p className="mt-1 text-xs text-red-600">{errors.password}</p> : null}
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          Remember Me
        </label>
        <span className="text-sm text-slate-500">JWT expires in 1 hour</span>
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? <Spinner /> : null}
        {loading ? "Signing in..." : "Sign in"}
      </button>

      <p className="text-center text-sm text-slate-600">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="font-medium text-indigo-700 hover:text-indigo-800">
          Create one
        </Link>
      </p>
    </form>
  );
}
