// frontend/src/App.jsx
// App shell with Navbar + Router + Toaster.

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

      {/* Toast notifications (success/error) */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          className: "!bg-slate-900 !text-white",
        }}
      />

      <main className="px-4 py-10">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
