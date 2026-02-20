# SecureAuth (Full Stack)

Production-style authentication system with:
- Backend: Node.js + Express + MongoDB + JWT
- Frontend: React + React Router + Axios + Tailwind

## Run locally

### 1) Backend
```bash
cd backend
copy .env.sample .env
npm install
npm run dev
```

### 2) Frontend
```bash
cd frontend
copy .env.sample .env
npm install
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Notes
- The backend CORS origin is controlled by `FRONTEND_ORIGIN` in `backend/.env`.
- The frontend API base URL is controlled by `VITE_API_BASE_URL` in `frontend/.env`.
