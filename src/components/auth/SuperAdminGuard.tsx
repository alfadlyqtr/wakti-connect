
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
        // For now we'll fake it by checking if user ID matches a predefined admin ID
        // You will need to create this table later with SQL migrations
        
        // Fake check - replace this with your actual super admin logic when you create the table
        const isSuperAdminUser = userId === '00000000-0000-0000-0000-000000000000'; // Replace with real admin ID
        setIsSuperAdmin(isSuperAdminUser);
        
        // Log access attempt for audit purposes - use try/catch to handle if table doesn't exist
        try {
          if (isSuperAdminUser) {
            // Check if audit_logs table exists first
            const { error: checkError } = await supabase
              .from('_metadata')
              .select('table_name')
              .eq('table_name', 'audit_logs')
              .single();
              
            if (!checkError) {
              await supabase
                .from('audit_logs')
                .insert({
                  user_id: userId,
                  action: 'super_admin_access',
                  resource: location.pathname,
                  metadata: { userAgent: navigator.userAgent, ip_address: 'client-side' }
                });
            }
          }
        } catch (logError) {
          console.warn("Could not log to audit_logs, table may not exist yet:", logError);
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
