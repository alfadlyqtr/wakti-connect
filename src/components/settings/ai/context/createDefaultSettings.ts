
import { supabase } from '@/integrations/supabase/client';
import { WAKTIAIMode, AISettings } from '@/components/ai/personality-switcher/types';
import { Json } from '@/types/supabase';
import { AIAssistantRole } from '@/types/ai-assistant.types';

export const createDefaultSettings = async (userId: string): Promise<AISettings | null> => {
  try {
    // Map WAKTIAIMode to database-compatible AIAssistantRole
    const mapRoleToDbRole = (role: WAKTIAIMode): AIAssistantRole => {
      const validRoles: AIAssistantRole[] = ["student", "business_owner", "general", "employee", "writer"];
      if (validRoles.includes(role as AIAssistantRole)) {
        return role as AIAssistantRole;
      }
      // Map unsupported roles to general
      return "general";
    };
    
    const defaultSettings: AISettings = {
      user_id: userId,
      assistant_name: 'WAKTI Assistant',
      role: 'general' as WAKTIAIMode,
      tone: 'friendly',
      response_length: 'medium',
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
        messaging: true
      }
    };
    
    // Insert with the correct database-compatible role value
    const { data, error } = await supabase
      .from('ai_assistant_settings')
      .insert({
        user_id: defaultSettings.user_id,
        assistant_name: defaultSettings.assistant_name,
        role: mapRoleToDbRole(defaultSettings.role),
        tone: defaultSettings.tone,
        response_length: defaultSettings.response_length,
        proactiveness: defaultSettings.proactiveness,
        suggestion_frequency: defaultSettings.suggestion_frequency,
        enabled_features: defaultSettings.enabled_features as unknown as Json
      })
      .select()
      .single();
    
    if (error) throw error;
    return defaultSettings;
  } catch (err) {
    console.error('Failed to create default AI settings:', err);
    return null;
  }
};
