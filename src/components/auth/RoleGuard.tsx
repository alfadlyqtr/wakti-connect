
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface RoleGuardProps {
  allowedRoles: Array<'free' | 'individual' | 'business'>;
  children: React.ReactNode;
  redirectTo?: string;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ 
  allowedRoles,
  children,
  redirectTo = "/dashboard"
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const checkAccess = async () => {
      try {
        setIsLoading(true);
        
        // Check regular role
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("No active session");
          setHasAccess(false);
          setIsLoading(false);
          return;
        }
        
        const { data } = await supabase
          .from('profiles')
          .select('account_type')
          .eq('id', session.user.id)
          .single();
          
        console.log("User role from profile:", data?.account_type);
        
        if (data && allowedRoles.includes(data.account_type as any)) {
          setHasAccess(true);
        } else {
          setHasAccess(false);
        }
      } catch (error) {
        console.error("Error checking access:", error);
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAccess();
  }, [allowedRoles]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!hasAccess) {
    console.log("Access denied. Redirecting to:", redirectTo);
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

export default RoleGuard;
