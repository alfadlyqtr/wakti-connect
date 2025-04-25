
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { UserRole } from '@/types/roles';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  redirectTo?: string;
}

/**
 * Protected route component that handles authentication and role-based access control
 * If user is not authenticated, redirects to login
 * If requiredRoles is provided, also checks if user has one of the required roles
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles = [],
  redirectTo = '/auth/login'
}) => {
  const { isAuthenticated, isLoading, hasAccess } = useAuth();
  const location = useLocation();

  // Log authentication status
  useEffect(() => {
    console.log("Protected route render:", { 
      isAuthenticated, 
      isLoading, 
      path: location.pathname,
      requiredRoles
    });
  }, [isAuthenticated, isLoading, location.pathname, requiredRoles]);

  // Show loading indicator while checking authentication
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to login");
    // Pass the current location so we can redirect back after login
    return <Navigate to={`${redirectTo}?returnUrl=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // If requiredRoles is provided, check if user has access
  if (requiredRoles.length > 0 && !hasAccess(requiredRoles)) {
    console.log("User doesn't have required role, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  // Render children if authenticated and has required role
  return <>{children}</>;
};

export default ProtectedRoute;
