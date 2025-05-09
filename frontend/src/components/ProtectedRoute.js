import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, token } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.user_type)) {
    // Rediriger vers le tableau de bord approprié selon le rôle
    const dashboardPath = {
      student: '/student/dashboard',
      company: '/company/dashboard',
      mentor: '/mentor/dashboard',
      school: '/school/dashboard',
      admin: '/admin/dashboard',
    }[user?.user_type] || '/';

    return <Navigate to={dashboardPath} replace />;
  }

  return children;
}

export default ProtectedRoute;