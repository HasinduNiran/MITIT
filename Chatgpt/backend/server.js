// backend/server.js
// Main Express app entrypoint (security middleware, routes, error handling).

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");

const app = express();

// --- Security & platform settings ---
// If deployed behind a reverse proxy (Render, Nginx, etc.), this helps rate-limits and IP detection.
app.set("trust proxy", 1);

// Add common security headers.
app.use(helmet());

// CORS - locked down to the frontend origin.
const frontendOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
app.use(
  cors({
    origin: frontendOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// JSON body parser.
app.use(express.json({ limit: "10kb" }));

// Request logging (helpful in dev and basic production logs).
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// --- Routes ---
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "secureauth-backend" });
});

app.use("/api/auth", authRoutes);

// --- 404 handler ---
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// --- Central error handler ---
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;

  // Never leak stack traces in production.
  const payload = {
    message: err.message || "Internal Server Error",
  };

  if (process.env.NODE_ENV !== "production") {
    payload.stack = err.stack;
  }

  res.status(status).json(payload);
});

// --- Startup ---
const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${PORT}`);
    // eslint-disable-next-line no-console
    console.log(`CORS allowed origin: ${frontendOrigin}`);
  });
})();
