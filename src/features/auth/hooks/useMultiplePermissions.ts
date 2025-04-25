
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../context/AuthContext";
import { Permission, PermissionAction } from "../types";

export const useMultiplePermissions = (actions: PermissionAction[]) => {
  const { effectiveRole, isLoading: authLoading } = useAuth();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkPermissions = async () => {
      if (authLoading) return;

      try {
        setIsLoading(true);

        const { data, error } = await supabase
          .from('role_permissions')
          .select('action, allowed')
          .eq('role', effectiveRole)
          .in('action', actions);

        if (error) {
          console.error("Error checking multiple permissions:", error);
          setPermissions([]);
          return;
        }

        setPermissions(data as Permission[]);
      } catch (error) {
        console.error("Error in useMultiplePermissions:", error);
        setPermissions([]);
      } finally {
        setIsLoading(false);
      }
    };

    checkPermissions();
  }, [effectiveRole, actions.join(','), authLoading]);

  // Helper function to check if a specific action is allowed
  const can = (action: PermissionAction): boolean => {
    const permission = permissions.find(p => p.action === action);
    return !!permission?.allowed;
  };

  return {
    permissions,
    can,
    isLoading: isLoading || authLoading,
  };
};
