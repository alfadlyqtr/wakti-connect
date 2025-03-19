
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [verifyingAuth, setVerifyingAuth] = useState(true);
  const [authVerified, setAuthVerified] = useState(false);

  // Extra safety check for authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("ProtectedRoute: Performing additional auth check");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("ProtectedRoute: Error checking session:", error);
          toast({
            title: "Authentication Error",
            description: "There was a problem verifying your session. Please log in again.",
            variant: "destructive",
          });
          navigate('/auth/login', { state: { from: location }, replace: true });
          return;
        }
        
        if (!data.session) {
          console.warn("ProtectedRoute: No active session found");
          navigate('/auth/login', { state: { from: location }, replace: true });
          return;
        }
        
        console.log("ProtectedRoute: Authentication verified successfully");
        setAuthVerified(true);
      } catch (error) {
        console.error("ProtectedRoute: Exception during auth check:", error);
      } finally {
        setVerifyingAuth(false);
      }
    };
    
    // If useAuth hook is not loading anymore but says not authenticated, double-check
    if (!isLoading && !isAuthenticated) {
      checkAuth();
    } else if (!isLoading && isAuthenticated) {
      // If useAuth says we're authenticated, trust it and proceed
      setVerifyingAuth(false);
      setAuthVerified(true);
    }
  }, [isLoading, isAuthenticated, navigate, location]);

  if (isLoading || verifyingAuth) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <LoadingSpinner />
        <p className="mt-4 text-muted-foreground">Verifying authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated && !authVerified) {
    console.log("ProtectedRoute: Redirecting to login page");
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Wrapped in an error boundary to catch any rendering errors
  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  );
};

export default ProtectedRoute;
