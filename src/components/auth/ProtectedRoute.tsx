
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import DashboardSpinner from '@/components/dashboard/ui/DashboardSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  const [hasLoadingTimeout, setHasLoadingTimeout] = useState(false);
  const [isLocalLoading, setIsLocalLoading] = useState(true);
  
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

  // Check local storage as a fallback for auth state
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      // Check if we have a role in localStorage as a backup
      const storedRole = localStorage.getItem('userRole');
      if (storedRole) {
        console.log("Found stored role in localStorage:", storedRole);
      }
    }
  }, [isAuthenticated, isLoading]);

  console.log("ProtectedRoute - Auth state:", { 
    isAuthenticated, 
    isLoading, 
    isLocalLoading,
    hasTimeout: hasLoadingTimeout,
    userId: user?.id,
    path: location.pathname 
  });

  // Show loading spinner while checking auth state
  if ((isLoading || isLocalLoading) && !hasLoadingTimeout) {
    return <DashboardSpinner />;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login from:", location.pathname);
    // Save the location they were trying to go to
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  console.log("Authenticated, rendering protected content");
  return <>{children}</>;
};

export default ProtectedRoute;
