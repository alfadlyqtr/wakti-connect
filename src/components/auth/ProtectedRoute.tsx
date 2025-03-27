
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
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState<{short: boolean, long: boolean}>({
    short: false,
    long: false
  });

  // Add a tiered timeout to provide better feedback during loading
  useEffect(() => {
    if (!isLoading) return;
    
    console.log("ProtectedRoute mounted, auth state:", { isAuthenticated, isLoading, userId: user?.id });
    
    const shortTimer = setTimeout(() => {
      if (isLoading) {
        setLoadingTimeout(prev => ({ ...prev, short: true }));
      }
    }, 2000);
    
    const longTimer = setTimeout(() => {
      if (isLoading) {
        setLoadingTimeout(prev => ({ ...prev, long: true }));
      }
    }, 5000);
    
    return () => {
      clearTimeout(shortTimer);
      clearTimeout(longTimer);
    };
  }, [isLoading]);

  // Handle authentication and redirection
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !redirectAttempted) {
      console.log("Not authenticated, will redirect to login");
      setRedirectAttempted(true);
    }
  }, [isAuthenticated, isLoading, redirectAttempted]);

  // Show loading states based on duration
  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4">
        <LoadingSpinner />
        <div className="mt-4 text-center max-w-md">
          {loadingTimeout.long ? (
            <>
              <p className="font-medium text-amber-600">Taking longer than expected...</p>
              <p className="mt-2 text-sm text-gray-600">
                We're having trouble connecting to our authentication service. Please wait a moment or try reloading.
              </p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Reload Page
              </button>
            </>
          ) : loadingTimeout.short ? (
            <p className="text-gray-600">Verifying your login details...</p>
          ) : (
            <p className="text-gray-600">Checking authentication...</p>
          )}
        </div>
      </div>
    );
  }

  // If authentication check is complete and user is not authenticated, redirect to login
  if (!isAuthenticated && redirectAttempted) {
    console.log("Redirecting to login page");
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render protected content
  return <>{children}</>;
};

export default ProtectedRoute;
