// middleware/auth.js
// JWT authentication middleware.
// Attaches the decoded user payload to req.user so downstream
// controllers know who is making the request.

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Tokens are sent in the Authorization header as "Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized — no token provided',
    });
  }

  try {
    // Verify the token signature and expiry against JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the full user document (excluding password) to the request
    // so route handlers can use req.user.name, req.user.email, etc.
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to this token no longer exists',
      });
    }

    next();
  } catch (error) {
    // Covers TokenExpiredError, JsonWebTokenError, NotBeforeError
    return res.status(401).json({
      success: false,
      message: 'Not authorized — token invalid or expired',
    });
  }
};

module.exports = { protect };
