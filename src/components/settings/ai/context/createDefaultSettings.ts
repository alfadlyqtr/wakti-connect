
import { supabase } from '@/lib/supabase';
import { WAKTIAIMode, AISettings } from '@/components/ai/personality-switcher/types';
import { Json } from '@/types/supabase';

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
    
    // Convert role to string for database compatibility
    const dbSettings = {
      ...defaultSettings,
      role: defaultSettings.role,
      enabled_features: defaultSettings.enabled_features as unknown as Json
    };
    
    // Using ai_assistant_settings instead of ai_settings
    const { data, error } = await supabase
      .from('ai_assistant_settings')
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
