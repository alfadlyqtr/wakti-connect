
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const AuthShell: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Get the return URL from query parameters
  const searchParams = new URLSearchParams(location.search);
  const returnUrl = searchParams.get('returnUrl') || '/dashboard';

  useEffect(() => {
    // If user is already authenticated, redirect to returnUrl
    if (isAuthenticated && !isLoading) {
      navigate(returnUrl, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, returnUrl]);

  // Show loading indicator while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If authenticated, redirect to returnUrl
  if (isAuthenticated) {
    return <Navigate to={returnUrl} replace />;
  }

  // If not authenticated, show auth pages
  return (
    <>
      {children || <Outlet />}
    </>
  );
};

export default AuthShell;
