
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

        // Security check 1: Check if user is in super_admin table
        const { data: superAdminData, error: superAdminError } = await supabase
          .from('super_admins')
          .select('id')
          .eq('user_id', userId)
          .maybeSingle();

        if (superAdminError) {
          console.error("Error checking super admin status:", superAdminError);
          setIsSuperAdmin(false);
          setIsChecking(false);
          return;
        }

        // Set super admin status
        setIsSuperAdmin(!!superAdminData);
        
        // Log access attempt for audit purposes
        if (superAdminData) {
          await supabase
            .from('audit_logs')
            .insert({
              user_id: userId,
              action: 'super_admin_access',
              resource: location.pathname,
              ip_address: 'client-side', // This will be enhanced with server-side tracking
              metadata: { userAgent: navigator.userAgent }
            });
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
