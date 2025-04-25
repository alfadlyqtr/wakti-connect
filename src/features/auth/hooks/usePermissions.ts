
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

        // Check permissions in the database using RPC function
        try {
          const { data, error } = await supabase
            .rpc('can_use_feature', { feature_name: featureName });

          if (error) {
            console.error("Error checking permissions with RPC:", error);
            // Fallback to direct query if RPC fails
            await checkDirectPermission();
            return;
          }

          setHasPermission(!!data);
        } catch (error) {
          console.error("Error in RPC call:", error);
          // Fallback to direct query
          await checkDirectPermission();
        }
      } catch (error) {
        console.error("Error in usePermissions:", error);
        setHasPermission(false);
      } finally {
        setIsLoading(false);
      }
    };

    const checkDirectPermission = async () => {
      try {
        // This is a fallback mechanism if the RPC function doesn't work
        // Create a custom query based on the available tables
        if (!effectiveRole) {
          setHasPermission(false);
          return;
        }
        
        const { data, error } = await supabase
          .from('permissions')
          .select('*')
          .eq('role', effectiveRole)
          .eq('feature', featureName)
          .maybeSingle();

        if (error) {
          console.error("Error checking direct permissions:", error);
          setHasPermission(false);
          return;
        }

        setHasPermission(!!data && data.allowed === true);
      } catch (directError) {
        console.error("Error in direct permission check:", directError);
        setHasPermission(false);
      }
    };

    checkPermissions();
  }, [user, effectiveRole, featureName, authLoading]);

  return {
    hasPermission,
    isLoading: isLoading || authLoading,
  };
};
