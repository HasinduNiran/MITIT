// frontend/src/components/ProtectedRoute.jsx
// Redirects to /login when the user is not authenticated.

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function FullPageLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
    </div>
  );
}

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, initializing } = useAuth();
  const location = useLocation();

  if (initializing) return <FullPageLoader />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
