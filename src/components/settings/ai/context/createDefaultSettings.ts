
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { AIAssistantRole } from "@/types/ai-assistant.types";

export const createDefaultSettings = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    // Set role specifically to one of the valid database enum values
    // to avoid type errors with the database schema
    const defaultSettings = {
      user_id: user.id,
      assistant_name: "WAKTI",
      role: "general" as AIAssistantRole,
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
      }
    };
    
    const { error } = await supabase
      .from("ai_assistant_settings")
      .insert(defaultSettings);
      
    if (error) throw error;
    
    toast({
      title: "Settings created",
      description: "Default AI assistant settings have been created."
    });
    
    // Refresh the page to load the new settings
    window.location.reload();
    
  } catch (error) {
    console.error("Error creating default settings:", error);
    toast({
      title: "Error creating settings",
      description: error instanceof Error ? error.message : "An unknown error occurred",
      variant: "destructive"
    });
  }
};
