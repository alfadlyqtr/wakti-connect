
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { toast } from '@/components/ui/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Log auth state for debugging
  useEffect(() => {
    console.log("ProtectedRoute - Auth state:", { 
      isAuthenticated, 
      isLoading, 
      userId: user?.id 
    });
  }, [isAuthenticated, isLoading, user]);

  // If auth is still loading, show spinner
  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <LoadingSpinner />
        <p className="mt-4 text-muted-foreground">Verifying authentication...</p>
      </div>
    );
  }

  // If not authenticated after loading completed, redirect to login
  if (!isAuthenticated) {
    console.log("ProtectedRoute: Not authenticated, redirecting to login");
    
    // Show toast only if we're not on the login page already
    if (!location.pathname.includes('/auth/login')) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access this page",
        variant: "default",
      });
    }
    
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Authenticated and not loading
  return <>{children}</>;
};

export default ProtectedRoute;
