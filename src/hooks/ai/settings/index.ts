
import { useAuth } from "@/hooks/auth";
import { useAISettingsQuery } from "./useAISettingsQueries";
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
    isLoading, 
    error: settingsError 
  } = useAISettingsQuery(user);
  
  const updateSettings = useUpdateAISettings(user);

  // Trust the account type directly from metadata - only source of truth
  const accountType = user?.user_metadata?.account_type;
  const canUseAI = accountType === 'business' || accountType === 'individual';
  
  // Mark that we've checked permissions immediately based on user metadata
  useEffect(() => {
    if (user) {
      setHasCheckedPermissions(true);
    }
  }, [user]);

  return {
    aiSettings,
    isLoading,
    settingsError,
    updateSettings,
    // Directly trust metadata
    canUseAI,
    isLoadingPermission: false,
    hasCheckedPermissions
  };
};
