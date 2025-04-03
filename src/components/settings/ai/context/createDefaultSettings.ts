
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { AISettings } from "@/types/ai-assistant.types";

/**
 * Creates default AI settings for a user
 */
export const createDefaultSettings = async (): Promise<void> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      const errorMsg = "No active session. Please log in again.";
      toast({
        title: "Error creating settings",
        description: errorMsg,
        variant: "destructive",
      });
      throw new Error(errorMsg);
    }
    
    // Create default settings for the user
    const defaultSettings: Omit<AISettings, "id"> = {
      assistant_name: "WAKTI",
      tone: "balanced",
      response_length: "balanced",
      proactiveness: true,
      suggestion_frequency: "medium",
      role: "general", // Use string literal that matches database enum
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
        assistant_name: defaultSettings.assistant_name,
        tone: defaultSettings.tone,
        response_length: defaultSettings.response_length,
        proactiveness: defaultSettings.proactiveness,
        suggestion_frequency: defaultSettings.suggestion_frequency,
        role: defaultSettings.role,
        enabled_features: defaultSettings.enabled_features
      })
      .select()
      .maybeSingle();
      
    if (error) {
      console.error("Error creating default settings:", error);
      const errorMsg = `Unable to create settings: ${error.message}`;
      toast({
        title: "Error creating settings",
        description: errorMsg,
        variant: "destructive",
      });
      throw new Error(errorMsg);
    }
    
    toast({
      title: "Default settings created",
      description: "Your AI assistant settings have been created with default values",
    });
    window.location.reload();
  } catch (err) {
    console.error("Error in createDefaultSettings:", err);
    const errorMsg = "An unexpected error occurred. Please try again.";
    toast({
      title: "Error creating settings",
      description: errorMsg,
      variant: "destructive",
    });
    throw err;
  }
};
