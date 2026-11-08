import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import HowToUse from "./pages/HowToUse";
import Why from "./pages/Why";
import NotFound from "./pages/NotFound";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="page">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="page">Loading…</div>;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/how-to-use"
          element={
            <ProtectedRoute>
              <HowToUse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/why"
          element={
            <ProtectedRoute>
              <Why />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
