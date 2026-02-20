// backend/routes/auth.js
// Auth routes with rate limiting.

const express = require("express");
const rateLimit = require("express-rate-limit");

const auth = require("../middleware/auth");
const { register, login, profile } = require("../controllers/authController");

const router = express.Router();

// Rate limiting: max 5 requests per 15 minutes on auth routes.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests. Please try again later." },
});

// Apply limiter to all auth endpoints.
router.use(authLimiter);

router.post("/register", register);
router.post("/login", login);
router.get("/profile", auth, profile);

module.exports = router;
