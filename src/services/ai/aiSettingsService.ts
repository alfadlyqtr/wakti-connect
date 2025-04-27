
import { supabase } from "@/integrations/supabase/client";
import { AISettings, AIAssistantRole } from "@/types/ai-assistant.types";
import { Json } from "@/types/supabase";

// Helper function to convert database record to AISettings
const mapDbRecordToAISettings = (data: any): AISettings => {
  // Extract the enabled_features from Json format
  const enabledFeatures = data.enabled_features as Record<string, boolean>;
  
  return {
    id: data.id,
    user_id: data.user_id,
    assistant_name: data.assistant_name || 'WAKTI',
    role: data.role as AIAssistantRole,
    tone: data.tone || 'balanced',
    response_length: data.response_length || 'balanced',
    proactiveness: data.proactiveness !== null ? data.proactiveness : true,
    suggestion_frequency: data.suggestion_frequency || 'medium',
    enabled_features: {
      voice_input: enabledFeatures?.voice_input === true,
      voice_output: enabledFeatures?.voice_output === true,
      task_detection: enabledFeatures?.task_detection === true,
      meeting_scheduling: enabledFeatures?.meeting_scheduling === true,
      personalized_suggestions: enabledFeatures?.personalized_suggestions === true,
      tasks: enabledFeatures?.tasks === true,
      events: enabledFeatures?.events === true,
      staff: enabledFeatures?.staff === true,
      analytics: enabledFeatures?.analytics === true,
      messaging: enabledFeatures?.messaging === true,
    }
  };
};

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
  
  return mapDbRecordToAISettings(data);
};

// Update AI settings
export const updateAISettings = async (settings: AISettings): Promise<AISettings> => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) throw new Error('Not authenticated');
  
  // Map WAKTIAIMode to supported AIAssistantRole
  const mapRoleToDbRole = (role: string): AIAssistantRole => {
    const validRoles = ["student", "business_owner", "general", "employee", "writer"];
    if (validRoles.includes(role)) {
      return role as AIAssistantRole;
    }
    // Map unsupported roles to general
    return "general";
  };
  
  // Ensure role is a valid enum value
  const roleValue: AIAssistantRole = mapRoleToDbRole(settings.role as string);
  
  // Convert the enabled_features to a format suitable for the database
  const dbEnabledFeatures = {
    voice_input: settings.enabled_features.voice_input || false,
    voice_output: settings.enabled_features.voice_output || false,
    task_detection: settings.enabled_features.task_detection || false,
    meeting_scheduling: settings.enabled_features.meeting_scheduling || false,
    personalized_suggestions: settings.enabled_features.personalized_suggestions || false,
    tasks: settings.enabled_features.tasks !== undefined ? settings.enabled_features.tasks : true,
    events: settings.enabled_features.events !== undefined ? settings.enabled_features.events : true,
    staff: settings.enabled_features.staff !== undefined ? settings.enabled_features.staff : true,
    analytics: settings.enabled_features.analytics !== undefined ? settings.enabled_features.analytics : true,
    messaging: settings.enabled_features.messaging !== undefined ? settings.enabled_features.messaging : true,
  };
  
  const updateData = {
    user_id: settings.user_id,
    assistant_name: settings.assistant_name,
    role: roleValue,
    tone: settings.tone,
    response_length: settings.response_length,
    proactiveness: settings.proactiveness,
    suggestion_frequency: settings.suggestion_frequency,
    enabled_features: dbEnabledFeatures,
  };
  
  const { data, error } = await supabase
    .from('ai_assistant_settings')
    .upsert(updateData)
    .select()
    .single();
  
  if (error) throw error;
  
  return mapDbRecordToAISettings(data);
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
      voice_input: true,
      voice_output: false,
      task_detection: true,
      meeting_scheduling: true,
      personalized_suggestions: true,
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
  
  return mapDbRecordToAISettings(data);
};
