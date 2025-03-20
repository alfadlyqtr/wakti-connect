
import { useAuth } from "@/hooks/auth";
import { useAISettingsQuery, useCanUseAIQuery } from "./useAISettingsQueries";
import { useUpdateAISettings } from "./useAISettingsMutations";

/**
 * Hook for managing AI assistant settings
 */
export const useAISettings = () => {
  const { user } = useAuth();
  
  const { 
    data: aiSettings, 
    isLoading: isLoadingSettings, 
    error: settingsError 
  } = useAISettingsQuery(user);
  
  const { 
    data: canUseAI 
  } = useCanUseAIQuery(user);
  
  const updateSettings = useUpdateAISettings(user);

  return {
    aiSettings,
    isLoadingSettings,
    settingsError,
    updateSettings,
    canUseAI: canUseAI === true,
  };
};
