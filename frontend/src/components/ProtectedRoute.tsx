// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import type { User } from '../types';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles?: ('cliente' | 'vendedor' | 'admin')[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const userStr = localStorage.getItem('user');

  if (!userStr) {
    // No active session: redirect to login
    return <Navigate to="/login" replace />;
  }

  try {
    const user: User = JSON.parse(userStr);

    // If allowedRoles is specified, check if user has permission
    if (allowedRoles && (!user.role || !allowedRoles.includes(user.role))) {
      // Role mismatch: redirect to their respective landing page
      if (user.role === 'vendedor' || user.role === 'admin') {
        return <Navigate to="/dashboard" replace />;
      }
      return <Navigate to="/account" replace />;
    }
  } catch (error) {
    // Corrupted user session: clear and redirect
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
