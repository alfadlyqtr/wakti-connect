
import React, { useEffect, useState } from "react";
import { hasPermission } from "@/services/auth/accessControl";

interface PermissionGuardProps {
  featureKey: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component that guards content based on user permissions
 */
const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  featureKey,
  children,
  fallback
}) => {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    const checkAccess = async () => {
      try {
        setIsChecking(true);
        const permitted = await hasPermission(featureKey);
        setHasAccess(permitted);
      } catch (error) {
        console.error("Error checking permission:", error);
        setHasAccess(false);
      } finally {
        setIsChecking(false);
      }
    };
    
    checkAccess();
  }, [featureKey]);
  
  if (isChecking) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="h-5 w-5 border-2 border-t-transparent border-primary rounded-full animate-spin"></div>
        <span className="ml-2 text-sm text-muted-foreground">Checking access...</span>
      </div>
    );
  }
  
  if (!hasAccess) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className="rounded-md bg-muted p-4">
        <div className="text-sm text-muted-foreground">
          You don't have permission to access this feature.
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
};

export default PermissionGuard;
