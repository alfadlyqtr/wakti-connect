import { supabase } from "@/integrations/supabase/client";
import { AISettings } from "@/types/ai-assistant.types";

export async function upsertAISettings(settings: AISettings): Promise<AISettings> {
  try {
    // Ensure the role is one of the accepted values
    const safeRole = settings.role as "student" | "employee" | "writer" | "business_owner" | "general";
    
    // Prepare the database record
    const dbRecord = {
      user_id: settings.userId,
      assistant_name: settings.assistantName,
      role: safeRole, // Use the safe role value
      tone: settings.tone,
      response_length: settings.responseLength,
      proactiveness: settings.proactiveness,
      suggestion_frequency: settings.suggestionFrequency,
      enabled_features: settings.enabledFeatures,
      // Other fields aren't stored in database yet - add migration if needed
    };
    
    // Upsert the record
    const { data, error } = await supabase
      .from('ai_assistant_settings')
      .upsert(dbRecord)
      .select()
      .single();
      
    if (error) throw error;
    
    // Return the original settings with the updated ID
    return {
      ...settings,
      id: data.id
    };
  } catch (error) {
    console.error("Error upserting AI settings:", error);
    throw error;
  }
}

export async function deleteAIKnowledge(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('ai_knowledge_uploads')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  } catch (error) {
    console.error("Error deleting AI knowledge:", error);
    throw error;
  }
}
