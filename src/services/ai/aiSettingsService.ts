
import { supabase } from "@/integrations/supabase/client";
import { AISettings, AIAssistantRole } from "@/types/ai-assistant.types";

/**
 * Create default AI settings for a user
 */
export const createDefaultAISettings = async (userId: string) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  // Ensure role is one of the valid enum values
  const defaultRole: AIAssistantRole = "general";
  
  const defaultSettings = {
    user_id: userId,
    assistant_name: "WAKTI",
    role: defaultRole,
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
    // These fields might need to be removed or adjusted based on the database schema
    // language: "en",
    // voice_enabled: false,
    // memory_enabled: false,
    // include_personal_context: false,
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
