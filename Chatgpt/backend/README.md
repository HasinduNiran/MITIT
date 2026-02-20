# SecureAuth Backend (Node + Express + MongoDB)

## Features
- MVC-ish structure (`routes/`, `controllers/`, `models/`, `middleware/`)
- Password hashing with `bcrypt` (salt rounds: 12)
- JWT auth (`Authorization: Bearer <token>`) with 1 hour expiry
- Validation with `Joi`
- Rate limiting on `/api/auth/*` (5 requests / 15 minutes)
- Security headers via `helmet`
- CORS restricted to your frontend origin

## Setup
1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Create environment file:
   - Copy `.env.sample` to `.env`
   - Update `MONGO_URI` and `JWT_SECRET`
3. Run:
   ```bash
   npm run dev
   ```

Server runs at `http://localhost:5000`.

## Endpoints
- `POST /api/auth/register` `{ name, email, password }` -> returns `{ token, user }`
- `POST /api/auth/login` `{ email, password }` -> returns `{ token, user }`
- `GET /api/auth/profile` -> protected, returns `{ user }`
