
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [hasLoadingTimeout, setHasLoadingTimeout] = React.useState(false);

  // Set a timeout to prevent infinite loading state
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setHasLoadingTimeout(true);
    }, 5000); // 5 seconds timeout
    
    return () => clearTimeout(timeoutId);
  }, []);

  console.log("ProtectedRoute - Auth state:", { isAuthenticated, isLoading, path: location.pathname });

  // If we're still loading but hit the timeout, we'll redirect to login as a fallback
  if (isLoading && !hasLoadingTimeout) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // If loading timed out or we're explicitly not authenticated, redirect to login
  if (!isAuthenticated || (isLoading && hasLoadingTimeout)) {
    console.log("Not authenticated, redirecting to login from:", location.pathname);
    // Save the location they were trying to go to
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  console.log("Authenticated, rendering protected content");
  return <>{children}</>;
};

export default ProtectedRoute;
