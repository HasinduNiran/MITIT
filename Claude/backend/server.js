// server.js
// Application entry point.
// Wires together: Express, middleware, routes, and the database connection.

require('dotenv').config(); // Must be first — loads .env variables into process.env

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');

// ─── Connect to MongoDB ───────────────────────────────────────────────────────
connectDB();

const app = express();

// ─── Security Middleware ──────────────────────────────────────────────────────

// helmet() sets ~15 security-related HTTP response headers automatically:
// X-Content-Type-Options, Strict-Transport-Security, X-Frame-Options, etc.
app.use(helmet());

// CORS: Only allow requests from the frontend origin defined in .env
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// ─── Body Parsing Middleware ──────────────────────────────────────────────────
// Parse incoming JSON request bodies (for POST/PUT endpoints)
app.use(express.json({ limit: '10kb' })); // Limit payload size to prevent DoS

// Parse URL-encoded form data (optional but safe to include)
app.use(express.urlencoded({ extended: false }));

// ─── Routes ───────────────────────────────────────────────────────────────────
// All authentication endpoints live under /api/auth
app.use('/api/auth', authRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
// Simple endpoint to confirm the server is running (useful for deployment checks)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
// Catch-all for routes that don't exist
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
// Express recognizes 4-argument functions as error handlers
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
