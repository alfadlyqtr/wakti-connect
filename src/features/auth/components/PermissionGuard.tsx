
import React from "react";
import { Navigate } from "react-router-dom";
import { usePermissions } from "../hooks/usePermissions";
import { toast } from "@/components/ui/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface PermissionGuardProps {
  feature: string;
  children: React.ReactNode;
  redirectTo?: string;
  showToast?: boolean;
  fallback?: React.ReactNode;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  feature,
  children,
  redirectTo = "/dashboard",
  showToast = false,
  fallback,
}) => {
  const { hasPermission, isLoading } = usePermissions(feature);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (!hasPermission) {
    if (showToast) {
      toast({
        title: "Access Denied",
        description: `You don't have permission to access this feature.`,
        variant: "destructive",
      });
    }

    if (fallback) {
      return <>{fallback}</>;
    }

    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default PermissionGuard;
