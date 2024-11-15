import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, userRole } = useAuthStore();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!userRole?.isAdmin) {
    toast.error('Admin access required');
    return <Navigate to="/app/dashboard" replace />;
  }

  return <>{children}</>;
}