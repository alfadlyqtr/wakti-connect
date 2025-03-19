
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AISettings } from "@/types/ai-assistant.types";

interface UseCreateDefaultSettingsProps {
  onSuccess: () => void;
  onError: (errorMsg: string) => void;
}

export const useCreateDefaultSettings = ({ onSuccess, onError }: UseCreateDefaultSettingsProps) => {
  const [isCreatingSettings, setIsCreatingSettings] = useState(false);

  const createDefaultSettings = async () => {
    setIsCreatingSettings(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        const errorMsg = "No active session. Please log in again.";
        onError(errorMsg);
        setIsCreatingSettings(false);
        return;
      }
      
      // Create default settings for the user
      const defaultSettings: Omit<AISettings, "id"> = {
        assistant_name: "WAKTI",
        tone: "balanced",
        response_length: "balanced",
        proactiveness: true,
        suggestion_frequency: "medium",
        enabled_features: {
          tasks: true,
          events: true,
          staff: true,
          analytics: true,
          messaging: true,
        }
      };
      
      const { data, error } = await supabase
        .from("ai_assistant_settings")
        .insert({
          user_id: session.user.id,
          ...defaultSettings
        })
        .select()
        .maybeSingle();
        
      if (error) {
        console.error("Error creating default settings:", error);
        onError(`Unable to create settings: ${error.message}`);
        setIsCreatingSettings(false);
        return;
      }
      
      onSuccess();
    } catch (err) {
      console.error("Error in createDefaultSettings:", err);
      onError("An unexpected error occurred. Please try again.");
    } finally {
      setIsCreatingSettings(false);
    }
  };

  return { 
    createDefaultSettings, 
    isCreatingSettings 
  };
};
