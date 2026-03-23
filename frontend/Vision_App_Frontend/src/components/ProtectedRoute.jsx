import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRole }) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isAllowed = Array.isArray(allowedRole) 
    ? allowedRole.includes(role) 
    : role === allowedRole;

  if (allowedRole && !isAllowed) {
    // If user's role doesn't match the route's allowed role, redirect them
    // to their respective dashboard
    const redirectPath = role === 'DOCTOR' ? '/doctor/dashboard' : '/patient/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
