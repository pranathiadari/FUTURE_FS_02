import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../utils/storage';

export function ProtectedRoute() {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export function PublicRoute() {
  if (isAuthenticated()) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
