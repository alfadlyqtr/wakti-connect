
import React, { useEffect, useState } from "react";
import { hasPermission } from "@/services/auth/accessControl";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ShieldAlert } from "lucide-react";

interface PermissionGuardProps {
  featureKey: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showLoader?: boolean;
}

/**
 * Component that guards content based on user permissions
 */
const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  featureKey,
  children,
  fallback,
  showLoader = true
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
  
  if (isChecking && showLoader) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">Checking access...</span>
      </div>
    );
  }
  
  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <Card className="border border-destructive/20 bg-destructive/5">
        <CardContent className="pt-6 pb-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <div className="font-medium text-destructive mb-1">Access Restricted</div>
              <p className="text-muted-foreground">
                You don't have permission to access this feature.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return <>{children}</>;
};

export default PermissionGuard;
