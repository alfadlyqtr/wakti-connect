
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
  
  // SIMPLIFIED: We still call this, but it's been simplified to only check metadata
  const { 
    data: canUseAI,
    isLoading: isLoadingPermission
  } = useCanUseAIQuery(user);
  
  const updateSettings = useUpdateAISettings(user);

  // SIMPLIFIED: Trust the account type directly from metadata - only source of truth
  const accountType = user?.user_metadata?.account_type;
  const isBusinessOrIndividual = accountType === 'business' || accountType === 'individual';
  
  // Mark that we've checked permissions once the query completes
  useEffect(() => {
    if (!isLoadingPermission && canUseAI !== undefined) {
      setHasCheckedPermissions(true);
    }
  }, [isLoadingPermission, canUseAI]);

  return {
    aiSettings,
    isLoading: isLoadingSettings,
    settingsError,
    updateSettings,
    // SIMPLIFIED: Only trust metadata - the canUseAI check is also simplified
    canUseAI: isBusinessOrIndividual,
    isLoadingPermission,
    hasCheckedPermissions
  };
};
