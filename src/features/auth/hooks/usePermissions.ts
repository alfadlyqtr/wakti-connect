
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../context/AuthContext";

export const usePermissions = (featureName: string) => {
  const { user, effectiveRole, isLoading: authLoading } = useAuth();
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkPermissions = async () => {
      if (authLoading) return;

      try {
        setIsLoading(true);

        // If user is not authenticated, they don't have permission
        if (!user) {
          setHasPermission(false);
          return;
        }

        // Super admin has all permissions
        if (effectiveRole === "super-admin") {
          setHasPermission(true);
          return;
        }

        // Check permissions in the database
        const { data, error } = await supabase
          .from("role_permissions")
          .select("*")
          .eq("role", effectiveRole)
          .eq("feature", featureName)
          .single();

        if (error) {
          console.error("Error checking permissions:", error);
          setHasPermission(false);
          return;
        }

        setHasPermission(!!data && !!data.allowed);
      } catch (error) {
        console.error("Error in usePermissions:", error);
        setHasPermission(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkPermissions();
  }, [user, effectiveRole, featureName, authLoading]);

  return {
    hasPermission,
    isLoading: isLoading || authLoading,
  };
};
