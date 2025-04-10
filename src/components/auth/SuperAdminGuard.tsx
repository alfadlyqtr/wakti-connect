
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from "@/hooks/useAuth";
import { createAuditLog } from "@/types/auditLogs";

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

        // Check if user is in the super_admins table
        const { data: superAdminData, error: superAdminError } = await supabase
          .from('super_admins')
          .select('id')
          .eq('id', userId)
          .single();
          
        // If super_admins table doesn't exist yet or error occurs, fallback to RPC function
        if (superAdminError) {
          console.warn("Super admins table check failed, falling back to function:", superAdminError);
          
          // Use the is_super_admin function as a fallback
          const { data: isSuperAdminResult, error: functionError } = await supabase
            .rpc('is_super_admin');
            
          if (functionError) {
            console.error("Error calling is_super_admin function:", functionError);
            setIsSuperAdmin(false);
          } else {
            setIsSuperAdmin(!!isSuperAdminResult);
          }
        } else {
          // User is a super admin if found in the table
          setIsSuperAdmin(!!superAdminData);
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
