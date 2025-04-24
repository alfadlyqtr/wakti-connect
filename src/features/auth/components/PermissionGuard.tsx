
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { usePermissions } from '../hooks/usePermissions';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface PermissionGuardProps {
  feature: string;
  children: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
  showToast?: boolean;
  loadingComponent?: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  feature,
  children,
  redirectTo = '/dashboard',
  fallback,
  showToast = true,
  loadingComponent,
}) => {
  const location = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { hasPermission, isLoading } = usePermissions(feature);

  // Show loading state while checking permissions
  if (isLoading || authLoading) {
    return loadingComponent || (
      <div className="flex items-center justify-center min-h-[200px]">
        <LoadingSpinner />
      </div>
    );
  }

  // Handle unauthenticated users
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Handle unauthorized access
  if (!hasPermission) {
    if (showToast) {
      toast({
        title: "Access Denied",
        description: `You don't have permission to access this feature.`,
        variant: "destructive"
      });
    }

    if (fallback) {
      return <>{fallback}</>;
    }

    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // User has permission, render children
  return <>{children}</>;
};

export default PermissionGuard;
