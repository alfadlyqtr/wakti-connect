
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Add a timeout to prevent infinite loading
  useEffect(() => {
    console.log("ProtectedRoute mounted, auth state:", { isAuthenticated, isLoading });
    
    const timer = setTimeout(() => {
      console.log("Auth check timeout reached, forcing completion");
      setIsCheckingAuth(false);
    }, 3000); // 3 seconds timeout
    
    // If auth check completes before timeout, clear the timeout
    if (!isLoading) {
      console.log("Auth check completed, clearing timeout");
      setIsCheckingAuth(false);
      clearTimeout(timer);
    }
    
    return () => {
      clearTimeout(timer);
    };
  }, [isLoading, isAuthenticated]);

  // If auth check is taking too long, redirect to login
  if (isLoading && isCheckingAuth) {
    console.log("Still checking authentication...");
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  console.log("Auth check completed, authenticated:", isAuthenticated);
  
  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  console.log("Authenticated, rendering protected content");
  return <>{children}</>;
};

export default ProtectedRoute;
