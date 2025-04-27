import { useAuth } from "@/features/auth/hooks/useAuth";
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

  // Always allow AI access - no auth checks
  const canUseAI = true;
  
  // Mark that we've checked permissions immediately
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
    // Always allow AI access
    canUseAI,
    isLoadingPermission: false,
    hasCheckedPermissions
  };
};
