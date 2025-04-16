
import { useAuth } from "@/hooks/auth";
import { useAISettingsQuery, useCanUseAIQuery } from "./useAISettingsQueries";
import { useUpdateAISettings } from "./useAISettingsMutations";
import { useState, useEffect } from "react";

/**
 * Hook for managing AI assistant settings
 */
export const useAISettings = () => {
  const { user } = useAuth();
  const [hasCheckedPermissions, setHasCheckedPermissions] = useState(false);
  
  const { 
    data: aiSettings, 
    isLoading: isLoadingSettings, 
    error: settingsError 
  } = useAISettingsQuery(user);
  
  const { 
    data: canUseAI,
    isLoading: isLoadingPermission
  } = useCanUseAIQuery(user);
  
  const updateSettings = useUpdateAISettings(user);

  // Determine account type from metadata or profile data when available
  const userAccountType = user?.user_metadata?.account_type;
  const isBusinessOrIndividual = userAccountType === 'business' || userAccountType === 'individual';
  
  // Mark that we've checked permissions once the query completes
  useEffect(() => {
    if (!isLoadingPermission && canUseAI !== undefined) {
      setHasCheckedPermissions(true);
    }
  }, [isLoadingPermission, canUseAI]);

  return {
    aiSettings,
    isLoadingSettings,
    settingsError,
    updateSettings,
    // User can use AI if either:
    // 1. The RPC function returns true OR
    // 2. They have a business/individual account confirmed in metadata
    // 3. We've completed the permission check
    canUseAI: hasCheckedPermissions && (canUseAI === true || isBusinessOrIndividual),
    isLoadingPermission,
    hasCheckedPermissions
  };
};
