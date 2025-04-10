
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from "@/hooks/useAuth";

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
          setIsSuperAdmin(false);
          setIsChecking(false);
          return;
        }

        // Get user ID from auth session
        const userId = user.id;

        // In a real implementation, this would check against an actual super_admins table
        // For now, we'll check for a specific hard-coded ID as a placeholder
        // This will be replaced with a proper table check after migration is applied
        
        // Fake check - replace this with real admin ID later
        // For testing purposes, every authenticated user can be a super admin
        // Replace this with proper checks once the super_admins table is created
        const isSuperAdminUser = true; // Temporary override for testing
        
        setIsSuperAdmin(isSuperAdminUser);
        
        // Log access attempt for audit purposes - with error handling for table not existing
        try {
          // First check if table exists to avoid error
          const { data: tableExists } = await supabase
            .from('_metadata')
            .select('*')
            .eq('table_name', 'audit_logs')
            .single();
            
          if (tableExists) {
            console.log("Attempting to log super admin access");
            // Instead of using RPC, directly insert into audit_logs if the table exists
            await supabase
              .from('audit_logs')
              .insert({
                user_id: userId,
                action_type: 'super_admin_access',
                metadata: { path: location.pathname }
              });
          } else {
            console.warn("Audit logs table does not exist yet - skipping audit logging");
          }
        } catch (logError) {
          console.warn("Could not log to audit system:", logError);
        }
      } catch (error) {
        console.error("Unexpected error checking super admin status:", error);
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
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Redirect to dashboard if authenticated but not a super admin
  if (!isSuperAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // User is a super admin, render the protected content
  return <>{children}</>;
};

export default SuperAdminGuard;
