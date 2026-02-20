// routes/auth.js
// Express router for all /api/auth/* endpoints.
// Rate limiter is applied only to the two public auth routes
// (register and login) to prevent brute-force attacks.

const express = require('express');
const rateLimit = require('express-rate-limit');
const { register, login, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// ─── Rate Limiter ─────────────────────────────────────────────────────────────
// Allows max 5 requests per 15 minutes per IP on public auth routes.
// Returns a JSON error (not HTML) when the limit is exceeded.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes in milliseconds
  max: 5,                    // Maximum requests per window per IP
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again in 15 minutes.',
  },
  standardHeaders: true,  // Adds RateLimit-* headers to responses
  legacyHeaders: false,   // Disables the deprecated X-RateLimit-* headers
});

// ─── Routes ───────────────────────────────────────────────────────────────────
// POST /api/auth/register — rate limited, public
router.post('/register', authLimiter, register);

// POST /api/auth/login — rate limited, public
router.post('/login', authLimiter, login);

// GET /api/auth/profile — private, requires valid Bearer JWT
router.get('/profile', protect, getProfile);

module.exports = router;
