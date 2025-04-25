import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { toast } from "@/components/ui/use-toast";

interface SuperAdminGuardProps {
  children: React.ReactNode;
}

const SuperAdminGuard: React.FC<SuperAdminGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading, hasRole } = useAuth();
  const location = useLocation();
  const isSuperAdmin = hasRole('super-admin');

  // Show loading indicator while checking authentication
  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-muted-foreground">Initializing authentication...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log("SuperAdminGuard: Not authenticated, redirecting to login");
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Redirect to dashboard if not super admin
  if (!isSuperAdmin) {
    console.log("SuperAdminGuard: Not a super admin, redirecting to dashboard");
    toast({
      title: "Access Denied",
      description: "You don't have permission to access the admin area.",
      variant: "destructive"
    });
    return <Navigate to="/dashboard" replace />;
  }

  // Render children if super admin
  return <>{children}</>;
};

export default SuperAdminGuard;
