
import { supabase } from '@/integrations/supabase/client';
import { AISettings, AIAssistantRole } from '@/types/ai-assistant.types';
import { Json } from '@/types/supabase';

export const createDefaultSettings = async (userId: string): Promise<AISettings | null> => {
  try {
    // Map role to database-compatible AIAssistantRole
    const mapRoleToDbRole = (role: string): AIAssistantRole => {
      const validRoles: AIAssistantRole[] = ["student", "business_owner", "general", "employee", "writer"];
      if (validRoles.includes(role as AIAssistantRole)) {
        return role as AIAssistantRole;
      }
      // Map unsupported roles to general
      return "general";
    };
    
    const dbRole = mapRoleToDbRole("general");
    
    // Create default features object
    const enabledFeatures = {
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
    };
    
    // Insert with the correct database-compatible role value
    const { data, error } = await supabase
      .from('ai_assistant_settings')
      .insert({
        user_id: userId,
        assistant_name: 'WAKTI Assistant',
        role: dbRole,
        tone: 'friendly',
        response_length: 'medium',
        proactiveness: true,
        suggestion_frequency: 'medium',
        enabled_features: enabledFeatures as unknown as Json
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Convert to AISettings format
    const defaultSettings: AISettings = {
      id: data.id,
      user_id: userId,
      assistant_name: 'WAKTI Assistant',
      role: data.role,
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
    
    return defaultSettings;
  } catch (err) {
    console.error('Failed to create default AI settings:', err);
    return null;
  }
};
