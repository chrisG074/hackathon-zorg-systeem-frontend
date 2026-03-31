import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, adminOnly = false }) {
  // Controleer expliciet op de string 'true'
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  // Haal rollen veilig op
  const userRoles = JSON.parse(localStorage.getItem('userRoles') || '[]');
  const isAdmin = userRoles.includes('Admin');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Als de route alleen voor admins is, maar de gebruiker is het niet
  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}