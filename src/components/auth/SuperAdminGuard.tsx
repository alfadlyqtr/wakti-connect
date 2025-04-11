import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from "@/hooks/useAuth";
import { createAuditLog } from "@/types/auditLogs";

const SUPER_ADMIN_ID = "28e663b3-0a91-4220-8330-fbee7ecd3f96";

interface SuperAdminGuardProps {
  children: React.ReactNode;
}

const SuperAdminGuard: React.FC<SuperAdminGuardProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
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

        // First check if we have the super admin status in localStorage
        const cachedIsSuperAdmin = localStorage.getItem('isSuperAdmin');
        if (cachedIsSuperAdmin === 'true') {
          console.log("SuperAdminGuard: Using cached super admin status (true)");
          setIsSuperAdmin(true);
          setIsChecking(false);
          
          // Still verify in the background but don't block UI
          setTimeout(async () => {
            try {
              // Hard-coded ID-based check first (for development and fallback)
              if (user.id === SUPER_ADMIN_ID) {
                console.log("SuperAdminGuard: User matches hard-coded super admin ID");
                localStorage.setItem('isSuperAdmin', 'true');
                return;
              }
                
              // Verify against database to keep cache fresh
              const { data } = await supabase
                .from('super_admins')
                .select('id')
                .eq('id', user.id)
                .single();
                
              if (!data) {
                console.warn("SuperAdminGuard: Cache mismatch! User is not a super admin in database");
                localStorage.setItem('isSuperAdmin', 'false');
                setIsSuperAdmin(false);
              }
            } catch (error) {
              console.error("SuperAdminGuard: Background verification error:", error);
            }
          }, 1000);
          
          return;
        } else if (cachedIsSuperAdmin === 'false') {
          console.log("SuperAdminGuard: Using cached super admin status (false)");
          setIsSuperAdmin(false);
          setIsChecking(false);
          return;
        }

        // Hard-coded ID-based check first (for development and fallback)
        if (user.id === SUPER_ADMIN_ID) {
          console.log("SuperAdminGuard: User matches hard-coded super admin ID");
          localStorage.setItem('isSuperAdmin', 'true');
          setIsSuperAdmin(true);
          setIsChecking(false);
          return;
        }

        // Get user ID from auth session
        const userId = user.id;
        console.log("SuperAdminGuard: Checking super admin status for", userId);

        // Check if user is in the super_admins table
        const { data: superAdminData, error: superAdminError } = await supabase
          .from('super_admins')
          .select('id')
          .eq('id', userId)
          .single();
          
        // If super_admins table doesn't exist yet or error occurs, fallback to RPC function
        if (superAdminError) {
          console.warn("SuperAdminGuard: Super admins table check failed, falling back to function:", superAdminError);
          
          // Use the is_super_admin function as a fallback
          const { data: isSuperAdminResult, error: functionError } = await supabase
            .rpc('is_super_admin');
            
          if (functionError) {
            console.error("SuperAdminGuard: Error calling is_super_admin function:", functionError);
            setIsSuperAdmin(false);
          } else {
            setIsSuperAdmin(!!isSuperAdminResult);
          }
        } else {
          // User is a super admin if found in the table
          const isAdmin = !!superAdminData;
          setIsSuperAdmin(isAdmin);
          localStorage.setItem('isSuperAdmin', isAdmin ? 'true' : 'false');
          console.log("SuperAdminGuard: User super admin status set to", isAdmin);
        }
        
        // Log access attempt for audit purposes
        try {
          await createAuditLog(
            supabase,
            userId,
            'super_admin_access',
            { path: location.pathname }
          );
        } catch (logError) {
          console.warn("SuperAdminGuard: Could not log to audit system:", logError);
        }
      } catch (error) {
        console.error("SuperAdminGuard: Unexpected error checking super admin status:", error);
        setIsSuperAdmin(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkSuperAdminStatus();
  }, [isAuthenticated, user, location.pathname]);

  // Show loading state
  if (isLoading || isChecking) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-muted-foreground">Verifying credentials...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log("SuperAdminGuard: Not authenticated, redirecting to login");
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Redirect to dashboard if authenticated but not a super admin
  if (!isSuperAdmin) {
    console.log("SuperAdminGuard: Not a super admin, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  // User is a super admin, render the protected content
  console.log("SuperAdminGuard: User is a super admin, rendering content");
  return <>{children}</>;
};

export default SuperAdminGuard;
