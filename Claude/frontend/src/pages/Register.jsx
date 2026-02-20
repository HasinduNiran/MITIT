// src/pages/Register.jsx
// Registration form with:
//   - Real-time field validation on blur
//   - Password strength indicator (4 levels: Weak → Fair → Good → Strong)
//   - Show/hide password toggle on both password fields
//   - Loading spinner during API call
//   - Toast notifications via AuthContext

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// ─── Password Strength Utility ────────────────────────────────────────────────
// Returns { score: 0-4, label, color } based on password characteristics.
const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' };

  let score = 0;
  if (password.length >= 8) score++;           // Length
  if (/[A-Z]/.test(password)) score++;         // Uppercase letter
  if (/[0-9]/.test(password)) score++;         // Number
  if (/[^A-Za-z0-9]/.test(password)) score++; // Special character

  const levels = [
    { label: 'Weak', color: 'bg-red-400' },
    { label: 'Fair', color: 'bg-orange-400' },
    { label: 'Good', color: 'bg-yellow-400' },
    { label: 'Strong', color: 'bg-green-500' },
    { label: 'Very Strong', color: 'bg-green-600' },
  ];

  return { score, ...levels[score] };
};

// ─── Per-field Validator ──────────────────────────────────────────────────────
const validateField = (name, value, formData) => {
  switch (name) {
    case 'name':
      if (!value) return 'Name is required';
      if (value.length < 2) return 'Name must be at least 2 characters';
      if (value.length > 50) return 'Name cannot exceed 50 characters';
      return '';
    case 'email':
      if (!value) return 'Email is required';
      if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value))
        return 'Enter a valid email address';
      return '';
    case 'password':
      if (!value) return 'Password is required';
      if (value.length < 6) return 'Password must be at least 6 characters';
      return '';
    case 'confirmPassword':
      if (!value) return 'Please confirm your password';
      if (value !== formData.password) return 'Passwords do not match';
      return '';
    default:
      return '';
  }
};

// Eye icon toggle for show/hide password
const EyeIcon = ({ open }) =>
  open ? (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );

// Inline error message with icon
const FieldError = ({ message }) => (
  <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
    {message}
  </p>
);

// ─── Register Component ────────────────────────────────────────────────────────
const Register = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({}); // Track which fields have been interacted with
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const passwordStrength = getPasswordStrength(formData.password);

  // ─── Handlers ─────────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Only show inline errors for fields already touched
    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value, { ...formData, [name]: value }),
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value, formData),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    const allFields = ['name', 'email', 'password', 'confirmPassword'];
    const newErrors = {};
    allFields.forEach((field) => {
      newErrors[field] = validateField(field, formData[field], formData);
    });

    setErrors(newErrors);
    setTouched({ name: true, email: true, password: true, confirmPassword: true });

    // Abort if any errors exist
    if (Object.values(newErrors).some((e) => e !== '')) return;

    setIsLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="auth-card">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Create your account</h1>
          <p className="text-slate-500 text-sm mt-1">Join thousands of users today</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">

          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="John Doe"
              className={`input-field ${errors.name ? 'input-error' : ''}`}
              autoComplete="name"
            />
            {errors.name && <FieldError message={errors.name} />}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="john@example.com"
              className={`input-field ${errors.email ? 'input-error' : ''}`}
              autoComplete="email"
            />
            {errors.email && <FieldError message={errors.email} />}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="At least 6 characters"
                className={`input-field pr-12 ${errors.password ? 'input-error' : ''}`}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>

            {/* Password Strength Indicator — 4 colored bars */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                        level <= passwordStrength.score
                          ? passwordStrength.color
                          : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <p
                  className={`text-xs font-medium ${
                    passwordStrength.score <= 1
                      ? 'text-red-500'
                      : passwordStrength.score === 2
                      ? 'text-orange-500'
                      : passwordStrength.score === 3
                      ? 'text-yellow-600'
                      : 'text-green-600'
                  }`}
                >
                  {passwordStrength.label}
                </p>
              </div>
            )}

            {errors.password && <FieldError message={errors.password} />}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Repeat your password"
                className={`input-field pr-12 ${errors.confirmPassword ? 'input-error' : ''}`}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                tabIndex={-1}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                <EyeIcon open={showConfirm} />
              </button>
            </div>
            {errors.confirmPassword && <FieldError message={errors.confirmPassword} />}
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={isLoading} className="btn-primary mt-2">
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Footer link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
