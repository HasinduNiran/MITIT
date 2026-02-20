# SecureAuth Frontend (React + Tailwind)

## Features
- React Router pages: Login, Register, Dashboard (protected)
- Auth context/provider for global auth state
- Axios interceptor attaches JWT token from `localStorage`
- Tailwind CSS modern UI, responsive card layouts, subtle animations
- Real-time form validation + password strength indicator
- Toast notifications (`react-hot-toast`)

## Setup
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Create environment file:
   - Copy `.env.sample` to `.env`
   - Set `VITE_API_BASE_URL` (default: `http://localhost:5000`)
3. Run:
   ```bash
   npm run dev
   ```

App runs at `http://localhost:5173`.
