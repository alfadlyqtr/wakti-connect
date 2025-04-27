
import { supabase } from '@/integrations/supabase/client';
import { WAKTIAIMode, AISettings } from '@/components/ai/personality-switcher/types';

export const createDefaultSettings = async (userId: string): Promise<AISettings | null> => {
  try {
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
    
    // Convert to a type that matches the database schema
    const dbSettings = {
      ...defaultSettings,
      role: defaultSettings.role as "general" | "student" | "employee" | "writer" | "business_owner"
    };
    
    const { data, error } = await supabase
      .from('ai_settings')
      .insert([dbSettings])
      .select()
      .single();
    
    if (error) throw error;
    return defaultSettings;
  } catch (err) {
    console.error('Failed to create default AI settings:', err);
    return null;
  }
};
