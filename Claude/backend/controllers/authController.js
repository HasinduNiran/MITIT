// controllers/authController.js
// Business logic for authentication routes:
//   register  → validate → check duplicate → create user → return JWT
//   login     → validate → find user → compare password → return JWT
//   getProfile → protected → return user from req.user

const jwt = require('jsonwebtoken');
const Joi = require('joi');
const User = require('../models/User');

// ─── Helper: Generate JWT ─────────────────────────────────────────────────────
// Signs a JWT with the user's MongoDB _id as the payload.
// Expiry comes from the JWT_EXPIRE env variable (e.g. "1h").
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '1h',
  });
};

// ─── Joi Validation Schemas ───────────────────────────────────────────────────
// Defined once and reused. Joi provides detailed, user-friendly error messages.

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name cannot exceed 50 characters',
    'any.required': 'Name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required',
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

// ─── @route   POST /api/auth/register ────────────────────────────────────────
// @desc    Register a new user
// @access  Public
const register = async (req, res) => {
  // Step 1: Validate request body against Joi schema
  const { error, value } = registerSchema.validate(req.body, {
    abortEarly: false, // Return ALL validation errors, not just the first
  });

  if (error) {
    const messages = error.details.map((d) => d.message);
    return res.status(400).json({ success: false, message: messages[0] });
  }

  const { name, email, password } = value;

  try {
    // Step 2: Check for duplicate email (case-insensitive due to lowercase: true on schema)
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    // Step 3: Create user — password hashing happens in the pre-save hook (models/User.js)
    const user = await User.create({ name, email, password });

    // Step 4: Generate JWT and return it with safe user data (no password)
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

// ─── @route   POST /api/auth/login ───────────────────────────────────────────
// @desc    Authenticate user and return JWT
// @access  Public
const login = async (req, res) => {
  // Step 1: Validate input
  const { error, value } = loginSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const messages = error.details.map((d) => d.message);
    return res.status(400).json({ success: false, message: messages[0] });
  }

  const { email, password } = value;

  try {
    // Step 2: Find user — must explicitly select password since schema has select: false
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      // Use a generic message to prevent user enumeration attacks
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Step 3: Compare entered password with stored bcrypt hash
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Step 4: Issue JWT
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// ─── @route   GET /api/auth/profile ──────────────────────────────────────────
// @desc    Get current authenticated user's profile
// @access  Private (requires valid JWT via protect middleware)
const getProfile = async (req, res) => {
  // req.user is populated by the protect middleware in middleware/auth.js
  const user = req.user;

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
};

module.exports = { register, login, getProfile };
