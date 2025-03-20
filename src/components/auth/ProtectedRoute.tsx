
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
  const [longTimeout, setLongTimeout] = useState(false);

  // Add a timeout to prevent infinite loading
  useEffect(() => {
    console.log("ProtectedRoute mounted, auth state:", { isAuthenticated, isLoading, userId: user?.id });
    
    const shortTimer = setTimeout(() => {
      // If auth check takes more than 2 seconds, we'll show a better message
      if (isLoading) {
        setCheckTimeout(true);
      }
    }, 2000);
    
    const longTimer = setTimeout(() => {
      // If auth check takes more than an additional 3 seconds, we'll show a more serious message
      if (isLoading) {
        setLongTimeout(true);
      }
    }, 5000);
    
    const maxTimer = setTimeout(() => {
      console.log("Auth check max timeout reached, forcing completion");
      setIsCheckingAuth(false);
    }, 8000); // 8 seconds max timeout
    
    // If auth check completes before timeout, clear the timeout
    if (!isLoading) {
      console.log("Auth check completed, clearing timeout");
      setIsCheckingAuth(false);
      clearTimeout(shortTimer);
      clearTimeout(longTimer);
      clearTimeout(maxTimer);
    }
    
    return () => {
      clearTimeout(shortTimer);
      clearTimeout(longTimer);
      clearTimeout(maxTimer);
    };
  }, [isLoading, isAuthenticated, user]);

  // If auth check is taking too long, show a better loading state
  if (isLoading && isCheckingAuth) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4">
        <LoadingSpinner />
        <div className="mt-4 text-center max-w-md">
          {longTimeout ? (
            <>
              <p className="font-medium text-red-600">Authentication service is not responding</p>
              <p className="mt-2 text-sm text-gray-600">
                We're having trouble connecting to our servers. Please try reloading the page or log in again.
              </p>
              <button 
                onClick={() => window.location.href = '/auth/login'} 
                className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Go to Login
              </button>
            </>
          ) : checkTimeout ? (
            <>
              <p className="font-medium text-amber-600">Taking longer than expected...</p>
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
