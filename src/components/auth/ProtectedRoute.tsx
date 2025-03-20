
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [checkTimeout, setCheckTimeout] = useState(false);

  // Add a timeout to prevent infinite loading
  useEffect(() => {
    console.log("ProtectedRoute mounted, auth state:", { isAuthenticated, isLoading, userId: user?.id });
    
    const shortTimer = setTimeout(() => {
      // If auth check takes more than 2 seconds, we'll show a better message
      if (isLoading) {
        setCheckTimeout(true);
      }
    }, 2000);
    
    const timer = setTimeout(() => {
      console.log("Auth check timeout reached, forcing completion");
      setIsCheckingAuth(false);
    }, 5000); // 5 seconds timeout
    
    // If auth check completes before timeout, clear the timeout
    if (!isLoading) {
      console.log("Auth check completed, clearing timeout");
      setIsCheckingAuth(false);
      clearTimeout(timer);
      clearTimeout(shortTimer);
    }
    
    return () => {
      clearTimeout(timer);
      clearTimeout(shortTimer);
    };
  }, [isLoading, isAuthenticated, user]);

  // If auth check is taking too long, show a better loading state
  if (isLoading && isCheckingAuth) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4">
        <LoadingSpinner />
        <div className="mt-4 text-center max-w-md">
          {checkTimeout ? (
            <>
              <p className="font-medium text-gray-800">Taking longer than expected...</p>
              <p className="mt-2 text-sm text-gray-600">
                We're having trouble connecting to the authentication server. Please wait a moment.
              </p>
            </>
          ) : (
            <p className="text-gray-600">Checking authentication...</p>
          )}
        </div>
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
