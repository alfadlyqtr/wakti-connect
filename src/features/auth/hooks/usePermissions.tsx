
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from '../context/AuthContext';

/**
 * Enhanced hook for checking if a user has permission to access a specific feature
 * This implementation adds resilience against initialization timing issues
 */
export const usePermissions = (featureName: string) => {
  const { isAuthenticated, effectiveRole, isLoading: authLoading } = useAuth();
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  
  // Use React Query to fetch and cache permissions with direct RPC call
  // This serves as a fallback when role-based lookup fails
  const { data: directPermissionCheck, isLoading: directCheckLoading } = useQuery({
    queryKey: ['direct-permission', featureName],
    queryFn: async () => {
      if (!isAuthenticated) return false;

      try {
        const { data, error } = await supabase
          .rpc('can_use_feature', { feature_name: featureName });

        if (error) throw error;
        return !!data;
      } catch (error) {
        console.error("Error in direct permission check:", error);
        return false;
      }
    },
    enabled: isAuthenticated,
    staleTime: 60000, // Cache for 1 minute
  });

  // Use role-based permission lookup via role_permissions table
  const { data: roleBasedPermission, isLoading: roleCheckLoading } = useQuery({
    queryKey: ['role-permission', featureName, effectiveRole],
    queryFn: async () => {
      if (!isAuthenticated || !effectiveRole) return null;

      try {
        // Query the role_permissions table for this role
        const { data, error } = await supabase
          .from('role_permissions')
          .select('action, allowed')
          .eq('role', effectiveRole)
          .eq('action', featureName)
          .single();

        if (error) {
          console.error("Error checking role permissions:", error);
          return null;
        }

        return !!data?.allowed;
      } catch (error) {
        console.error("Error in usePermissions:", error);
        return null;
      }
    },
    enabled: isAuthenticated && !!effectiveRole,
    staleTime: 60000, // Cache for 1 minute
  });

  useEffect(() => {
    // Logic to determine permission based on all available sources
    const determinePermission = () => {
      // If auth is still loading, don't make a decision yet
      if (authLoading) return;

      // If role-based permission is explicitly defined (true or false)
      if (typeof roleBasedPermission === 'boolean') {
        setHasPermission(roleBasedPermission);
        setIsInitialized(true);
        return;
      }

      // Fallback to direct RPC check if role-based check didn't work
      if (directPermissionCheck !== undefined) {
        setHasPermission(directPermissionCheck);
        setIsInitialized(true);
        return;
      }

      // Default deny if we couldn't determine permission
      setHasPermission(false);
      setIsInitialized(true);
    };

    determinePermission();
  }, [roleBasedPermission, directPermissionCheck, authLoading, effectiveRole]);

  // Debug logging to help track permission resolution
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[Permission Debug] ${featureName}:`, { 
        effectiveRole, 
        roleBasedPermission, 
        directPermissionCheck,
        hasPermission,
        isInitialized
      });
    }
  }, [featureName, effectiveRole, roleBasedPermission, directPermissionCheck, hasPermission, isInitialized]);

  return {
    hasPermission,
    isLoading: (authLoading || !isInitialized || roleCheckLoading || directCheckLoading),
  };
};
