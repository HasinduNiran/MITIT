# Sri Lanka Institute of Information Technology

## Faculty of Computing

---

### Module: Modern Trends in Information Technology (MTIT)

### Assignment: Full-Stack Authentication System — AI Tool Comparison

---

**Submitted by:**

| Field | Details |
|-------|---------|
| **Student Name** | *(Your Name)* |
| **Student ID** | *(Your Student ID)* |
| **Intake** | *(Your Intake)* |
| **Date** | February 2026 |

---

# Table of Contents

1. [Introduction](#1-introduction)
2. [Tool 1 – ChatGPT Implementation](#2-tool-1--chatgpt-implementation)
   - 2.1 [Overview](#21-overview)
   - 2.2 [Technology Stack](#22-technology-stack)
   - 2.3 [Project Structure](#23-project-structure)
   - 2.4 [Backend Implementation](#24-backend-implementation)
   - 2.5 [Frontend Implementation](#25-frontend-implementation)
   - 2.6 [Security Features](#26-security-features)
   - 2.7 [Screenshots](#27-screenshots)
3. [Tool 2 – Claude Implementation](#3-tool-2--claude-implementation)
   - 3.1 [Overview](#31-overview)
   - 3.2 [Technology Stack](#32-technology-stack)
   - 3.3 [Project Structure](#33-project-structure)
   - 3.4 [Backend Implementation](#34-backend-implementation)
   - 3.5 [Frontend Implementation](#35-frontend-implementation)
   - 3.6 [Security Features](#36-security-features)
   - 3.7 [Screenshots](#37-screenshots)
4. [Comparison of ChatGPT vs Claude](#4-comparison-of-chatgpt-vs-claude)
   - 4.1 [Code Quality & Structure](#41-code-quality--structure)
   - 4.2 [Security Implementation](#42-security-implementation)
   - 4.3 [Frontend UI/UX](#43-frontend-uiux)
   - 4.4 [Feature Comparison Table](#44-feature-comparison-table)
5. [Conclusion](#5-conclusion)
6. [References](#6-references)

---

# 1. Introduction

This assignment evaluates and compares two leading AI code-generation tools — **ChatGPT (OpenAI)** and **Claude (Anthropic)** — by tasking each with generating a complete full-stack authentication system. The objective is to assess how each AI tool approaches the same problem, including code structure, security practices, UI/UX design, and overall code quality.

Both implementations feature:
- A **Node.js/Express** backend with **MongoDB** (Mongoose) for data persistence
- **JWT-based authentication** with bcrypt password hashing
- **Input validation** using Joi
- **Rate limiting** and **security headers** (Helmet)
- A **React** frontend with **Tailwind CSS**, **React Router**, and **Axios**
- Protected routes, toast notifications, and responsive design

The application functionality includes user registration, login, profile viewing, and logout — constituting a standard authentication flow suitable for production-grade web applications.

---

# 2. Tool 1 – ChatGPT Implementation

## 2.1 Overview

The ChatGPT-generated implementation follows a clean MVC-inspired architecture. The project is named **"SecureAuth"** and is split into a backend API server and a React single-page application frontend. ChatGPT produced well-commented code with clear separation of concerns and a professional naming convention throughout.

## 2.2 Technology Stack

| Layer | Technologies |
|-------|-------------|
| **Backend Runtime** | Node.js with Express.js |
| **Database** | MongoDB via Mongoose ODM |
| **Authentication** | JWT (jsonwebtoken), bcrypt |
| **Validation** | Joi |
| **Security** | Helmet, CORS, express-rate-limit |
| **Logging** | Morgan |
| **Frontend Framework** | React 18 |
| **Routing** | React Router DOM v6 |
| **HTTP Client** | Axios |
| **Styling** | Tailwind CSS v3 |
| **Notifications** | react-hot-toast |
| **Build Tool** | Vite |

## 2.3 Project Structure

```
Chatgpt/
├── README.md
├── backend/
│   ├── server.js                 # Express app entry point
│   ├── package.json
│   ├── .env.sample
│   ├── config/
│   │   └── db.js                 # MongoDB connection setup
│   ├── controllers/
│   │   └── authController.js     # Register, login, profile handlers
│   ├── middleware/
│   │   └── auth.js               # JWT verification middleware
│   ├── models/
│   │   └── User.js               # Mongoose User schema
│   └── routes/
│       └── auth.js               # Auth routes + rate limiter
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── main.jsx              # React entry point
        ├── App.jsx               # Router + route definitions
        ├── index.css             # Tailwind base styles
        ├── lib/
        │   └── api.js            # Axios instance + JWT interceptor
        ├── context/
        │   └── AuthContext.jsx   # Global auth state provider
        ├── components/
        │   ├── Dashboard.jsx     # Profile card component
        │   ├── LoginForm.jsx     # Login form with validation
        │   ├── RegisterForm.jsx  # Register form + password strength
        │   ├── Navbar.jsx        # Navigation bar
        │   └── ProtectedRoute.jsx# Auth guard wrapper
        └── pages/
            ├── DashboardPage.jsx # Dashboard page layout
            ├── LoginPage.jsx     # Login page layout
            └── RegisterPage.jsx  # Register page layout
```

## 2.4 Backend Implementation

### 2.4.1 Server Entry Point (`server.js`)

The main Express application configures security middleware, JSON parsing, request logging, and route mounting. Key characteristics:

- Uses `helmet()` for security headers
- CORS is restricted to the frontend origin via `FRONTEND_ORIGIN` environment variable
- JSON body size limited to 10KB to prevent DoS
- Morgan logging in dev/combined mode
- Central 404 and error handlers
- Async startup with `connectDB()` awaited before listening

```javascript
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");

const app = express();

app.set("trust proxy", 1);
app.use(helmet());

const frontendOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
app.use(
  cors({
    origin: frontendOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/", (req, res) => {
  res.json({ status: "ok", service: "secureauth-backend" });
});

app.use("/api/auth", authRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const payload = { message: err.message || "Internal Server Error" };
  if (process.env.NODE_ENV !== "production") {
    payload.stack = err.stack;
  }
  res.status(status).json(payload);
});

const PORT = process.env.PORT || 5000;
(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
    console.log(`CORS allowed origin: ${frontendOrigin}`);
  });
})();
```

### 2.4.2 Database Configuration (`config/db.js`)

Handles MongoDB connection with proper error handling and a clean exit on failure:

```javascript
const mongoose = require("mongoose");

async function connectDB() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    const err = new Error("MONGO_URI is not set in environment variables");
    err.statusCode = 500;
    throw err;
  }
  try {
    await mongoose.connect(mongoUri, {
      autoIndex: process.env.NODE_ENV !== "production",
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
```

### 2.4.3 User Model (`models/User.js`)

Defines the Mongoose schema with validation constraints. Stores the password as a pre-hashed field (`passwordHash`):

```javascript
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    passwordHash: {
      type: String,
      required: true,
      minlength: 60,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
```

### 2.4.4 Auth Controller (`controllers/authController.js`)

Contains three endpoint handlers — `register`, `login`, and `profile`. Key design decisions:

- **Joi validation schemas** defined at module level with `abortEarly: false`
- **bcrypt** hashing with 12 salt rounds
- **JWT signing** includes `sub`, `email`, `name` claims with `iss` and `aud` fields
- 1-hour token expiry
- Generic "Invalid email or password" message prevents user enumeration
- Duplicate email handling covers both Mongoose unique check and race condition (error code 11000)

```javascript
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const User = require("../models/User");

const SALT_ROUNDS = 12;

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
  return jwt.sign(
    { sub: user._id.toString(), email: user.email, name: user.name },
    secret,
    { expiresIn: "1h", issuer: "secureauth", audience: "secureauth-frontend" }
  );
}

async function register(req, res, next) {
  try {
    const { value, error } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map((d) => d.message),
      });
    }
    const { name, email, password } = value;
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "Email is already registered" });
    }
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
    });
    const token = signToken(user);
    return res.status(201).json({
      message: "Registration successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt },
    });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({ message: "Email is already registered" });
    }
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    const { value, error } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map((d) => d.message),
      });
    }
    const { email, password } = value;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
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
      user: { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt },
    });
  } catch (err) {
    return next(err);
  }
}

async function profile(req, res, next) {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const user = await User.findById(userId).select("_id name email createdAt updatedAt");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({
      user: { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt, updatedAt: user.updatedAt },
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { register, login, profile };
```

### 2.4.5 JWT Middleware (`middleware/auth.js`)

Verifies the Bearer token and attaches the decoded payload to `req.user`:

```javascript
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid Authorization header" });
  }
  const token = header.split(" ")[1];
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ message: "JWT_SECRET is not configured" });
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = auth;
```

### 2.4.6 Routes with Rate Limiting (`routes/auth.js`)

Applies rate limiting (5 requests per 15 minutes) to all auth routes:

```javascript
const express = require("express");
const rateLimit = require("express-rate-limit");
const auth = require("../middleware/auth");
const { register, login, profile } = require("../controllers/authController");

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests. Please try again later." },
});

router.use(authLimiter);
router.post("/register", register);
router.post("/login", login);
router.get("/profile", auth, profile);

module.exports = router;
```

## 2.5 Frontend Implementation

### 2.5.1 Application Entry (`main.jsx` & `App.jsx`)

The React app is bootstrapped with `BrowserRouter` and `AuthProvider` wrapping the entire application. The `App` component defines routes:

```jsx
// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
```

```jsx
// App.jsx
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Toaster position="top-right" toastOptions={{
        duration: 4000,
        className: "!bg-slate-900 !text-white",
      }} />
      <main className="px-4 py-10">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
```

### 2.5.2 Auth Context (`context/AuthContext.jsx`)

Manages global authentication state including token, user profile, and initialization:

- **On mount:** Checks `localStorage` for saved token, fetches fresh profile from `/api/auth/profile`
- **login/register:** Calls API, stores token in localStorage, updates state
- **logout:** Clears token and user state
- **refreshProfile:** Fetches latest profile data from the server

```jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("auth_token"));
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        if (!token) {
          if (!cancelled) { setUser(null); setInitializing(false); }
          return;
        }
        const res = await api.get("/api/auth/profile");
        if (!cancelled) { setUser(res.data.user); setInitializing(false); }
      } catch (err) {
        localStorage.removeItem("auth_token");
        if (!cancelled) { setToken(null); setUser(null); setInitializing(false); }
      }
    }
    init();
    return () => { cancelled = true; };
  }, [token]);

  async function refreshProfile() {
    const res = await api.get("/api/auth/profile");
    setUser(res.data.user);
  }

  async function login({ email, password }) {
    const res = await api.post("/api/auth/login", { email, password });
    localStorage.setItem("auth_token", res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    toast.success("Welcome back!");
  }

  async function register({ name, email, password }) {
    const res = await api.post("/api/auth/register", { name, email, password });
    localStorage.setItem("auth_token", res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    toast.success("Account created successfully");
  }

  function logout() {
    localStorage.removeItem("auth_token");
    setToken(null);
    setUser(null);
    toast.success("Logged out");
  }

  const value = useMemo(() => ({
    token, user, initializing, login, register, logout, refreshProfile,
    isAuthenticated: Boolean(token),
  }), [token, user, initializing]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
```

### 2.5.3 API Service (`lib/api.js`)

Configures Axios with base URL and JWT interceptor:

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### 2.5.4 Login Form (`components/LoginForm.jsx`)

Features include:
- Real-time email/password validation using `useMemo`
- "Remember Me" checkbox that saves email to localStorage
- Show/hide password toggle with SVG eye icon
- Loading spinner during API call
- Redirect to originally intended URL after login

### 2.5.5 Register Form (`components/RegisterForm.jsx`)

Features include:
- Full name, email, password, and confirm password fields
- Password strength indicator (Weak/Good/Strong) with animated color bars
- Real-time validation on blur and keystroke
- Show/hide toggle on both password fields

### 2.5.6 Dashboard (`components/Dashboard.jsx`)

Displays authenticated user profile in a card layout:
- Name, Email, Created, Updated fields
- "Refresh" button to re-fetch profile from the server

### 2.5.7 Navbar (`components/Navbar.jsx`)

Responsive navigation with:
- Brand logo with initial "S" badge
- Conditional links: Login/Register when unauthenticated, Profile/Logout when authenticated
- "Signed in as" display for the current user

### 2.5.8 Protected Route (`components/ProtectedRoute.jsx`)

Route guard that:
- Shows a full-page loading spinner during initialization
- Redirects to `/login` with the attempted path saved in `state.from`

## 2.6 Security Features

| Feature | Implementation |
|---------|---------------|
| **Password Hashing** | bcrypt with 12 salt rounds |
| **JWT Authentication** | 1-hour expiry, includes issuer and audience claims |
| **Input Validation** | Joi schemas with min/max length constraints |
| **Rate Limiting** | 5 requests per 15 minutes on all auth endpoints |
| **Security Headers** | Helmet middleware (~15 headers) |
| **CORS** | Restricted to frontend origin only |
| **Request Size Limit** | JSON body limited to 10KB |
| **Error Handling** | Stack traces hidden in production |
| **User Enumeration Prevention** | Generic "Invalid email or password" message |
| **Duplicate Email Protection** | Both pre-check and MongoDB unique index error handling |

## 2.7 Screenshots

*(Manually insert screenshots here)*

- **Screenshot 1:** Register Page
- **Screenshot 2:** Login Page
- **Screenshot 3:** Dashboard Page (authenticated)
- **Screenshot 4:** Navbar (authenticated state)
- **Screenshot 5:** Validation errors on form
- **Screenshot 6:** Toast notifications

---

# 3. Tool 2 – Claude Implementation

## 3.1 Overview

The Claude-generated implementation follows a similar MVC architecture but with some distinct design choices. The project is named **"AuthSystem"** and features a more polished UI with gradients, avatar initials, loading skeletons, and a security status display. Claude's code includes extensive inline comments explaining the reasoning behind each design decision.

## 3.2 Technology Stack

| Layer | Technologies |
|-------|-------------|
| **Backend Runtime** | Node.js with Express.js |
| **Database** | MongoDB via Mongoose ODM |
| **Authentication** | JWT (jsonwebtoken), bcryptjs |
| **Validation** | Joi |
| **Security** | Helmet, CORS, express-rate-limit |
| **Frontend Framework** | React 18 |
| **Routing** | React Router DOM v6 |
| **HTTP Client** | Axios |
| **Styling** | Tailwind CSS v3, Inter font (Google Fonts) |
| **Notifications** | react-hot-toast |
| **Build Tool** | Vite |

## 3.3 Project Structure

```
Claude/
├── README.md
├── backend/
│   ├── server.js                 # Express app entry point
│   ├── package.json
│   ├── .env.example
│   ├── config/
│   │   └── db.js                 # MongoDB connection via Mongoose
│   ├── models/
│   │   └── User.js               # Mongoose schema + bcrypt pre-save hook
│   ├── middleware/
│   │   └── auth.js               # JWT protect middleware
│   ├── controllers/
│   │   └── authController.js     # register, login, getProfile handlers
│   └── routes/
│       └── auth.js               # Express router + rate limiter
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js            # Vite + dev proxy configuration
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── main.jsx              # React entry point + Toaster
        ├── App.jsx               # Router + route definitions
        ├── index.css             # Tailwind + custom component classes
        ├── services/
        │   └── api.js            # Axios instance + request/response interceptors
        ├── context/
        │   └── AuthContext.jsx   # Global auth state + login/register/logout
        ├── components/
        │   ├── Navbar.jsx        # Responsive navigation with mobile menu
        │   └── ProtectedRoute.jsx# Auth guard with loading spinner
        └── pages/
            ├── Login.jsx         # Login form page
            ├── Register.jsx      # Register form + password strength
            └── Dashboard.jsx     # User profile + security status
```

## 3.4 Backend Implementation

### 3.4.1 Server Entry Point (`server.js`)

Similar structure to ChatGPT's version but with some differences:
- No Morgan logging
- Includes URL-encoded body parsing
- A `/health` endpoint for deployment monitoring
- Synchronous `connectDB()` call (not awaited)

```javascript
require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');

connectDB();

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));

app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
```

### 3.4.2 Database Configuration (`config/db.js`)

Connects to MongoDB with proper error handling. Claude's version includes comments about specific bug fixes applied:

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### 3.4.3 User Model (`models/User.js`)

A key difference from ChatGPT: Claude uses a **pre-save hook** for password hashing and an **instance method** for password comparison. The `password` field has `select: false` to exclude it from queries by default:

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
```

### 3.4.4 Auth Controller (`controllers/authController.js`)

Similar to ChatGPT but with differences:
- Uses `bcryptjs` (pure JS) instead of `bcrypt` (native)
- JWT payload contains only `{ id }` (simpler claims)
- Token expiry configurable via `JWT_EXPIRE` env variable
- Custom Joi error messages for user-friendly feedback
- Password is stored via the model's pre-save hook rather than manual hashing

```javascript
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '1h',
  });
};

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

const register = async (req, res) => {
  const { error, value } = registerSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message);
    return res.status(400).json({ success: false, message: messages[0] });
  }
  const { name, email, password } = value;
  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' });
    }
    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt },
    });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

const login = async (req, res) => {
  const { error, value } = loginSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message);
    return res.status(400).json({ success: false, message: messages[0] });
  }
  const { email, password } = value;
  try {
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const token = generateToken(user._id);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

const getProfile = async (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user: { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt },
  });
};

module.exports = { register, login, getProfile };
```

### 3.4.5 JWT Middleware (`middleware/auth.js`)

Claude's middleware fetches the full user document from the database on every request, providing fresh user data:

```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized — no token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User belonging to this token no longer exists' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized — token invalid or expired' });
  }
};

module.exports = { protect };
```

### 3.4.6 Routes with Rate Limiting (`routes/auth.js`)

Rate limiter is applied per-route rather than globally to the router:

```javascript
const express = require('express');
const rateLimit = require('express-rate-limit');
const { register, login, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again in 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/profile', protect, getProfile);

module.exports = router;
```

## 3.5 Frontend Implementation

### 3.5.1 Application Entry (`main.jsx` & `App.jsx`)

Claude places the `Toaster` in `main.jsx` (outside the App component) for truly global notification support. The `AuthProvider` wraps `BrowserRouter`:

```jsx
// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Toaster position="top-right" toastOptions={{
      duration: 4000,
      style: { background: '#1e293b', color: '#f8fafc', borderRadius: '12px', fontSize: '14px' },
      success: { iconTheme: { primary: '#4ade80', secondary: '#1e293b' } },
      error: { iconTheme: { primary: '#f87171', secondary: '#1e293b' } },
    }} />
    <App />
  </React.StrictMode>
);
```

```jsx
// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-slate-200">404</h1>
                <p className="text-slate-500 mt-2 mb-6">Page not found</p>
                <a href="/login" className="text-blue-600 font-medium hover:text-blue-700">Go to Login</a>
              </div>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
```

### 3.5.2 Auth Context (`context/AuthContext.jsx`)

Claude's approach differs by storing user data in `localStorage` (not just the token). This avoids an API call on page refresh but may show stale data:

```jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { loginUser, registerUser } from '../services/api';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      }
    }
    setIsLoading(false);
  }, []);

  const persistAuth = (newToken, newUser) => {
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('authUser', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const login = async (credentials) => {
    const response = await loginUser(credentials);
    const { token: newToken, user: newUser } = response.data;
    persistAuth(newToken, newUser);
    toast.success(`Welcome back, ${newUser.name}!`);
    return response.data;
  };

  const register = async (userData) => {
    const response = await registerUser(userData);
    const { token: newToken, user: newUser } = response.data;
    persistAuth(newToken, newUser);
    toast.success(`Account created! Welcome, ${newUser.name}!`);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setToken(null);
    setUser(null);
    toast.success('You have been signed out');
  };

  const value = {
    user, token, isAuthenticated: !!token, isLoading,
    login, register, logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used inside an AuthProvider');
  return context;
};
```

### 3.5.3 API Service (`services/api.js`)

Claude adds both request and response interceptors. The response interceptor handles 401 errors globally by clearing auth state and redirecting:

```javascript
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getProfile = () => API.get('/auth/profile');

export default API;
```

### 3.5.4 Login Page (`pages/Login.jsx`)

A complete single-file page component with:
- Gradient background and card layout
- Eye icon SVG for password visibility toggle
- Custom `FieldError` component with error icon
- `useEffect` redirect if already authenticated
- Per-field validation on blur with `validateField` function

### 3.5.5 Register Page (`pages/Register.jsx`)

Features a more detailed registration flow:
- 4-level password strength indicator (Weak/Fair/Good/Strong) with colored bars
- Scoring based on: length >= 8, uppercase, numbers, special characters
- Show/hide toggle on both password and confirm password fields

### 3.5.6 Dashboard Page (`pages/Dashboard.jsx`)

The most visually distinct component with:
- Blue gradient banner at the top of the profile card
- Avatar with user initials
- "Verified" badge
- Account ID display with mono font
- **Security Status** section showing bcrypt, JWT, Helmet, and rate limiting info
- Loading skeleton with animated pulse effect
- Live profile data fetched from the API

### 3.5.7 Navbar (`components/Navbar.jsx`)

More feature-rich than ChatGPT's version:
- Lock icon SVG brand logo
- Gradient avatar circle with user initial
- Mobile hamburger menu with animated dropdown
- Different color scheme for sign-out button (red on hover)

### 3.5.8 Custom CSS Classes (`index.css`)

Claude defines reusable Tailwind component classes:
- `.btn-primary` — gradient button with hover/focus states
- `.input-field` — standard form input styling
- `.input-error` — red border for validation errors
- `.auth-card` — card container with animation

## 3.6 Security Features

| Feature | Implementation |
|---------|---------------|
| **Password Hashing** | bcryptjs with 12 salt rounds (pre-save hook) |
| **JWT Authentication** | Configurable expiry via `JWT_EXPIRE` env variable |
| **Input Validation** | Joi schemas with custom error messages |
| **Rate Limiting** | 5 requests per 15 minutes on register and login only |
| **Security Headers** | Helmet middleware |
| **CORS** | Restricted to `CLIENT_URL` origin |
| **Request Size Limit** | JSON body limited to 10KB |
| **Password Exclusion** | `select: false` on password field in Mongoose schema |
| **User Enumeration Prevention** | Generic "Invalid email or password" message |
| **401 Auto-redirect** | Axios response interceptor clears auth on expired token |
| **Email Regex Validation** | Both Joi and Mongoose schema level |

## 3.7 Screenshots

*(Manually insert screenshots here)*

- **Screenshot 1:** Register Page
- **Screenshot 2:** Login Page
- **Screenshot 3:** Dashboard Page (authenticated) with profile card and security status
- **Screenshot 4:** Navbar (authenticated state with avatar initial)
- **Screenshot 5:** Validation errors on form
- **Screenshot 6:** Toast notifications
- **Screenshot 7:** Mobile responsive view with hamburger menu
- **Screenshot 8:** 404 Page

---

# 4. Comparison of ChatGPT vs Claude

## 4.1 Code Quality & Structure

| Aspect | ChatGPT | Claude |
|--------|---------|--------|
| **Architecture** | Page/Component separation (pages wrap components) | Single-file page components |
| **Component Pattern** | Functional components with hooks | Functional components with hooks |
| **State Management** | Context + `useMemo` for value memoization | Context with simple state |
| **Auth Persistence** | Token in localStorage, profile fetched from API on refresh | Both token AND user JSON in localStorage |
| **Comment Style** | Minimal but sufficient | Extensive with section headers and explanations |
| **Naming Convention** | `camelCase` functions, descriptive names | `camelCase` with `const` arrow functions |
| **Error Handling** | Uses `next(err)` pattern for Express error chain | Try/catch with direct error responses |
| **Password Storage** | Manual hashing in controller (`passwordHash` field) | Pre-save hook in model (`password` field with `select: false`) |
| **Module System** | CommonJS (backend), ESM (frontend) | CommonJS (backend), ESM (frontend) |

## 4.2 Security Implementation

| Security Aspect | ChatGPT | Claude |
|-----------------|---------|--------|
| **bcrypt Library** | `bcrypt` (native C++ addon — faster) | `bcryptjs` (pure JavaScript — more portable) |
| **Salt Rounds** | 12 | 12 |
| **Minimum Password Length** | 8 characters | 6 characters |
| **Maximum Password Length** | 128 characters | No maximum |
| **JWT Claims** | `sub`, `email`, `name`, `iss`, `aud` | Only `id` |
| **JWT Expiry Config** | Hardcoded "1h" | Configurable via `JWT_EXPIRE` env |
| **Rate Limit Scope** | All auth routes (including profile) | Only register and login |
| **Middleware User Lookup** | Decoded JWT payload attached to `req.user` | Fresh DB lookup on every protected request |
| **Request Logging** | Morgan (`dev`/`combined`) | None |
| **Response Interceptor** | Not implemented | Clears auth and redirects on 401 |
| **Vite Proxy** | Not configured | Configured for `/api` to avoid CORS in dev |

## 4.3 Frontend UI/UX

| UI/UX Feature | ChatGPT | Claude |
|---------------|---------|--------|
| **Color Scheme** | Indigo/slate | Blue-to-indigo gradient |
| **Font** | System default (Tailwind) | Inter (Google Fonts) |
| **Page Layout** | Two-column grid (info + form) | Centered card with gradient background |
| **Login Page** | Side panel with feature list | Card with lock icon header |
| **Register Page** | Side panel with feature list | Card with user icon header |
| **Dashboard** | Simple profile card with 4 fields | Gradient banner, avatar, verified badge, security status |
| **Password Strength** | 3-level (Weak/Good/Strong) | 4-level (Weak/Fair/Good/Strong) |
| **Loading State** | Spinner only | Spinner + skeleton placeholders |
| **Navbar Mobile** | No mobile menu | Hamburger menu with animated dropdown |
| **404 Page** | Simple redirect to `/` | Custom 404 page with message |
| **Remember Me** | Yes (saves email) | No |
| **Custom CSS Classes** | None (inline Tailwind only) | `.btn-primary`, `.input-field`, `.auth-card` |
| **Animations** | `fadeInUp` | `fadeIn`, `slideUp` |
| **Toast Styling** | Dark toast via className | Dark toast with custom colors and icon themes |
| **Scrollbar Styling** | None | Custom webkit scrollbar |

## 4.4 Feature Comparison Table

| Feature | ChatGPT | Claude |
|---------|:-------:|:------:|
| User Registration | Yes | Yes |
| User Login | Yes | Yes |
| JWT Authentication | Yes | Yes |
| Protected Routes | Yes | Yes |
| Profile Page | Yes | Yes |
| Password Hashing (bcrypt) | Yes | Yes |
| Input Validation (Joi) | Yes | Yes |
| Rate Limiting | Yes | Yes |
| Helmet Security Headers | Yes | Yes |
| CORS Configuration | Yes | Yes |
| Real-time Form Validation | Yes | Yes |
| Password Strength Indicator | Yes | Yes |
| Show/Hide Password | Yes | Yes |
| Toast Notifications | Yes | Yes |
| Remember Me | Yes | No |
| Refresh Profile Button | Yes | No (auto-fetches on mount) |
| Security Status Display | No | Yes |
| Loading Skeleton | No | Yes |
| Mobile Hamburger Menu | No | Yes |
| Custom 404 Page | No | Yes |
| Health Check Endpoint | No | Yes |
| Vite Dev Proxy | No | Yes |
| Response Interceptor (401) | No | Yes |
| Request Logging (Morgan) | Yes | No |
| Custom Joi Error Messages | No | Yes |
| Avatar Initials | No | Yes |
| Verified Badge | No | Yes |

---

# 5. Conclusion

Both ChatGPT and Claude produced fully functional, well-structured authentication systems with strong security practices. However, they approached the task with different philosophies:

**ChatGPT** focused on:
- Clean, minimal code with a clear separation between presentational pages and reusable components
- Stronger JWT claims (issuer, audience) and stricter password requirements (8+ characters)
- Server-side profile fetching on mount to ensure data freshness
- Morgan logging for request monitoring
- A "Remember Me" feature for better user experience

**Claude** focused on:
- More polished and visually rich UI with gradients, avatars, skeletons, and a security status dashboard
- More portable bcryptjs library (works across all platforms)
- Extensive code commenting and documentation
- Better mobile experience with hamburger menu
- Response interceptor for automatic 401 handling
- More configurable JWT settings via environment variables
- Custom 404 page and health check endpoint

**Overall Assessment:**
- For **backend security rigor**, ChatGPT has a slight edge with richer JWT claims, stronger password length requirements, and request logging.
- For **frontend polish and UX**, Claude clearly offers a more refined user experience with gradients, loading skeletons, avatar initials, mobile menu, and a security status display.
- For **code documentation**, Claude excels with thorough inline comments explaining design decisions.
- For **production readiness**, both are suitable with minor adjustments. ChatGPT's fresh profile fetch is more reliable, while Claude's Vite proxy and response interceptor show more deployment awareness.

Both tools demonstrate the impressive capability of modern AI in generating production-quality full-stack applications from a single prompt.

---

# 6. References

1. Express.js Documentation — https://expressjs.com/
2. MongoDB / Mongoose Documentation — https://mongoosejs.com/
3. JSON Web Tokens (JWT) — https://jwt.io/introduction
4. bcrypt / bcryptjs — https://www.npmjs.com/package/bcrypt / https://www.npmjs.com/package/bcryptjs
5. Joi Validation — https://joi.dev/api/
6. Helmet.js — https://helmetjs.github.io/
7. React Documentation — https://react.dev/
8. React Router v6 — https://reactrouter.com/
9. Axios HTTP Client — https://axios-http.com/
10. Tailwind CSS v3 — https://tailwindcss.com/
11. Vite Build Tool — https://vitejs.dev/
12. react-hot-toast — https://react-hot-toast.com/
13. express-rate-limit — https://www.npmjs.com/package/express-rate-limit
14. OpenAI ChatGPT — https://chat.openai.com/
15. Anthropic Claude — https://claude.ai/

---

*End of Document*
