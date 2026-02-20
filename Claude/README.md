# Full-Stack Authentication System

A production-ready authentication system with a modern UI, built with Node.js/Express (backend) and React/Vite (frontend).

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Backend** | Node.js, Express.js, MongoDB (Mongoose), bcryptjs, JWT, Joi, Helmet, CORS, express-rate-limit |
| **Frontend** | React 18, React Router v6, Axios, Tailwind CSS v3, react-hot-toast, Vite |

## Prerequisites

- **Node.js 18+** — https://nodejs.org
- **MongoDB** running locally on port `27017` — https://www.mongodb.com/try/download/community
  - OR a MongoDB Atlas connection string (update `MONGO_URI` in `backend/.env`)

---

## Quick Start

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

The server starts at **http://localhost:5000**

> **Note:** Edit `backend/.env` and set a strong `JWT_SECRET` before running in production:
> ```
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The app starts at **http://localhost:5173**

---

## API Reference

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| `GET` | `/health` | No | Server health check |
| `POST` | `/api/auth/register` | No (rate limited) | Register a new user |
| `POST` | `/api/auth/login` | No (rate limited) | Login and receive JWT |
| `GET` | `/api/auth/profile` | `Bearer <token>` | Get current user profile |

### Example: Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","password":"secret123"}'
```

### Example: Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"secret123"}'
```

### Example: Get Profile

```bash
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer <your_jwt_token>"
```

---

## Security Features

- **bcryptjs** — passwords hashed with salt rounds: 12 (pure JS, works on all platforms)
- **JWT** — 1-hour expiry, signed with `JWT_SECRET`
- **Joi** — server-side input validation on all auth endpoints
- **Rate limiting** — 5 requests per 15 minutes on `/register` and `/login`
- **Helmet** — sets 15+ security HTTP headers automatically
- **CORS** — restricted to `CLIENT_URL` origin only
- **`select: false`** — password hash never included in MongoDB query results
- **Generic error messages** — "Invalid email or password" prevents user enumeration

---

## Frontend Features

- **AuthContext** — global auth state with localStorage persistence across refreshes
- **Axios interceptors** — auto-injects JWT on requests; auto-redirects to login on 401
- **ProtectedRoute** — shows spinner while restoring state, redirects if unauthenticated
- **Post-login redirect** — returns user to the page they tried to access
- **Real-time validation** — errors appear on blur, updated on every keystroke after touch
- **Password strength** — 4-bar visual indicator (Weak / Fair / Good / Strong)
- **Show/hide password** — eye icon toggle on all password fields
- **Loading spinners** — buttons animate during API calls
- **Toast notifications** — dark pill-shaped toasts for success/error feedback
- **Responsive Navbar** — sticky, with mobile hamburger menu
- **Loading skeleton** — dashboard shows pulsing placeholder while fetching profile

---

## Project Structure

```
c:\MTIT\Claude\
├── README.md
├── backend\
│   ├── server.js                 # Express app entry point
│   ├── package.json
│   ├── .env                      # Environment variables (not committed)
│   ├── config\
│   │   └── db.js                 # MongoDB connection via Mongoose
│   ├── models\
│   │   └── User.js               # Mongoose schema + bcrypt pre-save hook
│   ├── middleware\
│   │   └── auth.js               # JWT protect middleware
│   ├── controllers\
│   │   └── authController.js     # register, login, getProfile handlers
│   └── routes\
│       └── auth.js               # Express router + rate limiter
│
└── frontend\
    ├── index.html
    ├── package.json
    ├── vite.config.js            # Vite + dev proxy
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src\
        ├── main.jsx              # React entry point + Toaster
        ├── App.jsx               # Router + route definitions
        ├── index.css             # Tailwind + custom component classes
        ├── services\
        │   └── api.js            # Axios instance + request/response interceptors
        ├── context\
        │   └── AuthContext.jsx   # Global auth state + login/register/logout
        ├── components\
        │   ├── Navbar.jsx        # Responsive navigation bar
        │   └── ProtectedRoute.jsx# Auth guard with loading spinner
        └── pages\
            ├── Login.jsx         # Login form
            ├── Register.jsx      # Registration form + password strength
            └── Dashboard.jsx     # User profile + security status
```
