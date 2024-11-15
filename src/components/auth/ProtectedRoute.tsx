import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, userRole, loading } = useAuthStore();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    // Only show toast if not on the initial load
    if (location.pathname !== '/') {
      toast.error('Please sign in to continue');
    }
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (requireAdmin && !userRole?.isAdmin) {
    toast.error('Admin access required');
    return <Navigate to="/app/dashboard" replace />;
  }

  return <>{children}</>;
}