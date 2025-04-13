
import { supabase } from "@/integrations/supabase/client";
import { AISettings } from "@/types/ai-assistant.types";

/**
 * Create default AI settings for a user
 */
export const createDefaultAISettings = async (userId: string) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const defaultSettings = {
    user_id: userId,
    assistant_name: "WAKTI",
    role: "general", 
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
    },
    language: "en",
    voiceEnabled: false,
    memoryEnabled: false,
    includePersonalContext: false,
  };

  const { data, error } = await supabase
    .from("ai_assistant_settings")
    .insert(defaultSettings)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};
