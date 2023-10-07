import React from 'react';
import { Navigate } from 'react-router-dom';
import { Spinner } from '@waypoint/ui';
import { useAuth } from '../hooks/useAuth.js';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
