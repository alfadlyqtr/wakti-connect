
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

    // Get current user role
    const userRole = user.plan;
    console.log("Protected route - User role:", userRole, "Required role:", requiredRole);
    
    // Check if user meets the role requirement
    // business > co-admin > admin > staff > individual > free
    const hasRole = 
      // Business owners can access everything
      userRole === 'business' ||
      // Co-admins can access everything except business owner pages
      (userRole === 'co-admin' && requiredRole !== 'business') ||
      // Admins can access staff, individual and free pages
      (userRole === 'admin' && ['staff', 'individual', 'free'].includes(requiredRole)) ||
      // Staff can access staff level and below
      (userRole === 'staff' && ['staff', 'individual', 'free'].includes(requiredRole)) ||
      // Individual users can access individual and free
      (userRole === 'individual' && ['individual', 'free'].includes(requiredRole)) ||
      // Free users can only access free content
      (userRole === 'free' && requiredRole === 'free');
    
    // If no specific permission is required, just check the role
    if (!requiredPermission) {
      setHasPermission(hasRole);
      return;
    }
    
    // For future: implement specific permission checks
    setHasPermission(hasRole);
  }, [isAuthenticated, user, requiredRole, requiredPermission]);

  console.log("ProtectedRoute - Auth state:", { 
    isAuthenticated, 
    isLoading, 
    isLocalLoading,
    hasTimeout: hasLoadingTimeout,
    userId: user?.id,
    userPlan: user?.plan,
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
