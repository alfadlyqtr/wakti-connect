
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../context/AuthContext";

/**
 * Hook for checking if a user has permission to perform specific actions
 * @param featureName The feature to check permissions for
 * @returns Object with permission state and loading state
 */
export const usePermissions = (featureName: string) => {
  const { effectiveRole, isLoading: authLoading } = useAuth();
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkPermissions = async () => {
      if (authLoading) return;

      try {
        setIsLoading(true);

        // Query the role_permissions table for this role
        const { data, error } = await supabase
          .from('role_permissions')
          .select('action, allowed')
          .eq('role', effectiveRole)
          .eq('action', featureName)
          .maybeSingle();

        if (error) {
          console.error("Error checking permissions:", error);
          setHasPermission(false);
          return;
        }

        setHasPermission(!!data?.allowed);
      } catch (error) {
        console.error("Error in usePermissions:", error);
        setHasPermission(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkPermissions();
  }, [effectiveRole, featureName, authLoading]);

  return {
    hasPermission,
    isLoading: isLoading || authLoading,
  };
};
