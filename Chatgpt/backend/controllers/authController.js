// backend/controllers/authController.js
// Auth controller functions (register, login, profile).

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const User = require("../models/User");

const SALT_ROUNDS = 12;

// --- Validation schemas ---
const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().trim().email().max(254).required(),
  password: Joi.string().min(8).max(128).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email().max(254).required(),
  password: Joi.string().min(8).max(128).required(),
});

function signToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    const err = new Error("JWT_SECRET is not set in environment variables");
    err.statusCode = 500;
    throw err;
  }

  // Minimal claims: subject = user id.
  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      name: user.name,
    },
    secret,
    {
      expiresIn: "1h",
      issuer: "secureauth",
      audience: "secureauth-frontend",
    }
  );
}

// POST /api/auth/register
async function register(req, res, next) {
  try {
    // Validate input
    const { value, error } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ message: "Validation error", details: error.details.map((d) => d.message) });
    }

    const { name, email, password } = value;

    // Check if user already exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
    });

    // Optional: return JWT so frontend can log in immediately.
    const token = signToken(user);

    return res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    // Handle duplicate key errors (race condition on unique index)
    if (err && err.code === 11000) {
      return res.status(409).json({ message: "Email is already registered" });
    }
    return next(err);
  }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { value, error } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ message: "Validation error", details: error.details.map((d) => d.message) });
    }

    const { email, password } = value;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Avoid revealing whether email exists.
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken(user);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    return next(err);
  }
}

// GET /api/auth/profile (protected)
async function profile(req, res, next) {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId).select("_id name email createdAt updatedAt");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  register,
  login,
  profile,
};
