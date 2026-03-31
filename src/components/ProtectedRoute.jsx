import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRoles = JSON.parse(localStorage.getItem('userRoles') || '[]');
  const isAdmin = userRoles.includes('Admin');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}