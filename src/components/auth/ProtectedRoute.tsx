
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import DashboardSpinner from '@/components/dashboard/ui/DashboardSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermission?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  requiredPermission 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  const [hasLoadingTimeout, setHasLoadingTimeout] = useState(false);
  const [isLocalLoading, setIsLocalLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  // Set a reasonable timeout to prevent infinite loading state
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (isLoading) {
      setIsLocalLoading(true);
      timeoutId = setTimeout(() => {
        setHasLoadingTimeout(true);
        setIsLocalLoading(false);
      }, 3000); // 3 seconds timeout
    } else {
      setIsLocalLoading(false);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoading]);

  // Check if user has the required role and permissions
  useEffect(() => {
    if (!isAuthenticated || !requiredRole || !user) {
      setHasPermission(null);
      return;
    }

    // Check if user has the required role
    const userRole = user.plan;
    const hasRole = userRole === requiredRole || 
                   (requiredRole === 'individual' && userRole === 'business') || 
                   (requiredRole === 'free' && (userRole === 'individual' || userRole === 'business'));
    
    // If no specific permission is required, just check the role
    if (!requiredPermission) {
      setHasPermission(hasRole);
      return;
    }
    
    // For future: implement permission check with access_control_manager
    // This should be expanded as we implement permission-based features
    setHasPermission(hasRole);
  }, [isAuthenticated, user, requiredRole, requiredPermission]);

  console.log("ProtectedRoute - Auth state:", { 
    isAuthenticated, 
    isLoading, 
    isLocalLoading,
    hasTimeout: hasLoadingTimeout,
    userId: user?.id,
    userRole: user?.plan,
    requiredRole,
    hasPermission,
    path: location.pathname 
  });

  // Show loading spinner while checking auth state
  if ((isLoading || isLocalLoading) && !hasLoadingTimeout) {
    return <DashboardSpinner />;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login from:", location.pathname);
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // If role/permission check is active and user doesn't have permission
  if (requiredRole && hasPermission === false) {
    console.log(`User doesn't have required role/permission: ${requiredRole}`);
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  console.log("Authenticated, rendering protected content");
  return <>{children}</>;
};

export default ProtectedRoute;
