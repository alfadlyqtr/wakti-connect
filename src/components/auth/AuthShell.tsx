
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import AuthLoadingState from "./AuthLoadingState";
import AuthErrorState from "./AuthErrorState";

const AuthShell: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Extract the return URL from query parameters
  const searchParams = new URLSearchParams(location.search);
  const returnUrl = searchParams.get('returnUrl') || '/dashboard';

  console.log("AuthShell render:", { isAuthenticated, isLoading, returnUrl });

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
    console.log("AuthShell: User is authenticated, redirecting to", returnUrl);
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
