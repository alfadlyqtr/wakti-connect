
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

  // Determine if business or individual account from user metadata
  const isBusinessOrIndividual = user?.user_metadata?.account_type === 'business' || 
                                user?.user_metadata?.account_type === 'individual';

  return {
    aiSettings,
    isLoadingSettings,
    settingsError,
    updateSettings,
    // User can use AI if either the RPC function returns true OR they have a business/individual account
    canUseAI: canUseAI === true || isBusinessOrIndividual,
  };
};
