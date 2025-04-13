
import { supabase } from "@/integrations/supabase/client";
import { AISettings, AIAssistantRole } from "@/types/ai-assistant.types";

// Fetch AI settings for the current user
export const fetchAISettings = async (): Promise<AISettings | null> => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return null;
  
  const { data, error } = await supabase
    .from('ai_assistant_settings')
    .select('*')
    .eq('user_id', userData.user.id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') return null; // No settings found
    throw error;
  }
  
  return data as AISettings;
};

// Update AI settings
export const updateAISettings = async (settings: AISettings): Promise<AISettings> => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) throw new Error('Not authenticated');
  
  // Ensure role is a valid enum value
  const roleValue: AIAssistantRole = settings.role;
  
  const updateData = {
    user_id: settings.user_id,
    assistant_name: settings.assistant_name,
    role: roleValue,
    tone: settings.tone,
    response_length: settings.response_length,
    proactiveness: settings.proactiveness,
    suggestion_frequency: settings.suggestion_frequency,
    enabled_features: settings.enabled_features,
  };
  
  const { data, error } = await supabase
    .from('ai_assistant_settings')
    .upsert(updateData)
    .select()
    .single();
  
  if (error) throw error;
  
  return data as AISettings;
};

// Create default AI settings
export const createDefaultAISettings = async (): Promise<AISettings> => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) throw new Error('Not authenticated');
  
  const defaultSettings = {
    user_id: userData.user.id,
    assistant_name: 'WAKTI',
    role: 'general' as AIAssistantRole,
    tone: 'balanced',
    response_length: 'balanced',
    proactiveness: true,
    suggestion_frequency: 'medium',
    enabled_features: {
      tasks: true,
      events: true,
      staff: true,
      analytics: true,
      messaging: true,
    },
  };
  
  const { data, error } = await supabase
    .from('ai_assistant_settings')
    .insert(defaultSettings)
    .select()
    .single();
  
  if (error) throw error;
  
  return data as AISettings;
};
