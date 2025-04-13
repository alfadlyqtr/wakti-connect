
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from "@/hooks/useAuth";
import { createAuditLog } from "@/types/auditLogs";
import { toast } from "@/components/ui/use-toast";

interface SuperAdminGuardProps {
  children: React.ReactNode;
}

// Hard-coded super admin ID to avoid RLS checks
const KNOWN_SUPER_ADMIN_ID = "28e863b3-0a91-4220-8330-fbee7ecd3f96";

const SuperAdminGuard: React.FC<SuperAdminGuardProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkSuperAdminStatus = async () => {
      try {
        if (!isAuthenticated || !user) {
          console.log("SuperAdminGuard: User not authenticated");
          setIsSuperAdmin(false);
          setIsChecking(false);
          return;
        }

        console.log("SuperAdminGuard: Checking super admin status for", user.id);
        
        // Direct check for hard-coded admin ID - safest approach that avoids RLS issues
        if (user.id === KNOWN_SUPER_ADMIN_ID) {
          console.log("SuperAdminGuard: User matches known super admin ID");
          setIsSuperAdmin(true);
          localStorage.setItem('isSuperAdmin', 'true');
          
          try {
            await createAuditLog(
              supabase,
              user.id,
              'super_admin_access',
              { path: location.pathname, success: true }
            );
          } catch (logError) {
            console.warn("SuperAdminGuard: Could not log to audit system:", logError);
          }
          
          setIsChecking(false);
          return;
        }
        
        // Use localStorage as a fallback
        const storedSuperAdmin = localStorage.getItem('isSuperAdmin');
        if (storedSuperAdmin === 'true') {
          console.log("SuperAdminGuard: Using cached super admin status");
          setIsSuperAdmin(true);
        } else {
          console.log("SuperAdminGuard: Not a super admin");
          setIsSuperAdmin(false);
        }
        
        setIsChecking(false);
      } catch (error) {
        console.error("SuperAdminGuard: Unexpected error checking super admin status:", error);
        setIsSuperAdmin(false);
        setIsChecking(false);
        
        // Clear any incorrect admin flag
        localStorage.setItem('isSuperAdmin', 'false');
        
        toast({
          title: "Authentication Error",
          description: "There was a problem verifying your access level.",
          variant: "destructive"
        });
      }
    };

    if (!authLoading) {
      checkSuperAdminStatus();
    }
  }, [isAuthenticated, user, authLoading, location.pathname]);

  if (authLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-muted-foreground">Initializing authentication...</p>
      </div>
    );
  }

  if (isChecking) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-muted-foreground">Verifying admin credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("SuperAdminGuard: Not authenticated, redirecting to login");
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (!isSuperAdmin) {
    console.log("SuperAdminGuard: Not a super admin, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  console.log("SuperAdminGuard: User is a super admin, rendering content");
  return <>{children}</>;
};

export default SuperAdminGuard;
