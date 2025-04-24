
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook for checking if a user has permission to access a specific feature
 * This uses the Supabase can_use_feature database function to determine access
 */
export const usePermissions = (featureName: string) => {
  const { isAuthenticated, effectiveRole } = useAuth();
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  // Use React Query to fetch and cache permissions
  const { data, isLoading, error } = useQuery({
    queryKey: ['permissions', featureName, effectiveRole],
    queryFn: async () => {
      if (!isAuthenticated) return false;

      try {
        const { data, error } = await supabase
          .rpc('can_use_feature', { feature_name: featureName });

        if (error) throw error;
        return !!data;
      } catch (error) {
        console.error("Error checking feature permission:", error);
        return false;
      }
    },
    enabled: isAuthenticated,
    staleTime: 60000, // Cache for 1 minute
  });

  useEffect(() => {
    setHasPermission(!!data);
  }, [data]);

  return {
    hasPermission,
    isLoading,
    error
  };
};
