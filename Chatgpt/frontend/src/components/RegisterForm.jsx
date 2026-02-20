// frontend/src/components/RegisterForm.jsx
// Register form with password strength, show/hide password, real-time validation.

import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

function Spinner() {
  return <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function passwordStrength(password) {
  // Simple scoring for UX guidance (not a cryptographic measure).
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (!password) return { label: "", score: 0 };
  if (score <= 2) return { label: "Weak", score: 1 };
  if (score <= 4) return { label: "Good", score: 2 };
  return { label: "Strong", score: 3 };
}

function StrengthBar({ level, label }) {
  const bars = [0, 1, 2];
  const active = level;
  const colors = ["bg-red-500", "bg-amber-500", "bg-emerald-500"];

  return (
    <div className="mt-2">
      <div className="flex gap-2">
        {bars.map((idx) => (
          <div
            key={idx}
            className={
              "h-2 flex-1 rounded-full " +
              (idx < active ? colors[Math.max(active - 1, 0)] : "bg-slate-200")
            }
          />
        ))}
      </div>
      {label ? <p className="mt-1 text-xs text-slate-600">Password strength: {label}</p> : null}
    </div>
  );
}

export default function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [touched, setTouched] = useState({ name: false, email: false, password: false, confirmPassword: false });
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => passwordStrength(password), [password]);

  const errors = useMemo(() => {
    const next = {};

    if (!name.trim()) next.name = "Name is required";
    else if (name.trim().length < 2) next.name = "Name must be at least 2 characters";

    if (!email) next.email = "Email is required";
    else if (!validateEmail(email)) next.email = "Enter a valid email";

    if (!password) next.password = "Password is required";
    else if (password.length < 8) next.password = "Password must be at least 8 characters";

    if (!confirmPassword) next.confirmPassword = "Confirm your password";
    else if (confirmPassword !== password) next.confirmPassword = "Passwords do not match";

    return next;
  }, [name, email, password, confirmPassword]);

  const canSubmit = Object.keys(errors).length === 0 && !loading;

  async function onSubmit(e) {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirmPassword: true });

    if (!canSubmit) return;

    setLoading(true);
    try {
      await register({ name: name.trim(), email, password });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.message || "Registration failed";
      const details = err?.response?.data?.details;
      if (Array.isArray(details) && details.length) toast.error(details[0]);
      else toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-700">Full name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          placeholder="Jane Doe"
          type="text"
          autoComplete="name"
        />
        {touched.name && errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name}</p> : null}
      </div>

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
            placeholder="Create a strong password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute inset-y-0 right-0 grid w-11 place-items-center text-slate-500 hover:text-slate-700"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
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
        <StrengthBar level={strength.score} label={strength.label} />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Confirm password</label>
        <div className="relative mt-1">
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, confirmPassword: true }))}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 pr-11 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            placeholder="Repeat your password"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((s) => !s)}
            className="absolute inset-y-0 right-0 grid w-11 place-items-center text-slate-500 hover:text-slate-700"
            aria-label={showConfirm ? "Hide password" : "Show password"}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              {showConfirm ? (
                <path d="M3 3l18 18M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58M9.88 5.09A9.94 9.94 0 0112 5c5 0 9 5 9 7 0 .64-1.07 2.55-2.98 4.2M6.12 6.12C3.73 7.73 2 10.2 2 12c0 2 4 7 10 7 1.09 0 2.12-.15 3.08-.42" />
              ) : (
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
              )}
              {!showConfirm ? <circle cx="12" cy="12" r="3" /> : null}
            </svg>
          </button>
        </div>
        {touched.confirmPassword && errors.confirmPassword ? (
          <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? <Spinner /> : null}
        {loading ? "Creating account..." : "Create account"}
      </button>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-indigo-700 hover:text-indigo-800">
          Sign in
        </Link>
      </p>
    </form>
  );
}
