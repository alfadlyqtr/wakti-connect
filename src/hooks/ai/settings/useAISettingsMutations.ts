
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@/hooks/auth";
import { AISettings, AIAssistantRole } from "@/types/ai-assistant.types";

// Define the valid role types based on the database constraints
type ValidRoleType = "student" | "business_owner" | "general" | "employee" | "writer";

/**
 * Mutation hook for updating AI settings
 */
export const useUpdateAISettings = (user: User | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newSettings: AISettings) => {
      if (!user) throw new Error("User not authenticated");

      console.log("Updating AI settings:", newSettings);
      
      // Ensure the role is a valid database enum value
      // If it's not one of the allowed values, default to "general"
      const roleValue = (["student", "business_owner", "general", "employee", "writer"] as const).includes(
        newSettings.role as ValidRoleType) 
        ? newSettings.role as ValidRoleType 
        : "general" as ValidRoleType;
      
      // First prepare the basic settings object (without knowledge_profile)
      const baseSettings = {
        user_id: user.id,
        assistant_name: newSettings.assistant_name,
        tone: newSettings.tone,
        response_length: newSettings.response_length,
        proactiveness: newSettings.proactiveness,
        suggestion_frequency: newSettings.suggestion_frequency,
        role: roleValue, // Use the validated role value
        enabled_features: newSettings.enabled_features,
      };
      
      // Then add knowledge_profile if it exists
      const settingsForUpdate = {
        ...baseSettings,
        knowledge_profile: newSettings.knowledge_profile
      };

      // If we have an id, update the existing record
      if (newSettings.id) {
        const { data, error } = await supabase
          .from("ai_assistant_settings")
          .update(settingsForUpdate)
          .eq("user_id", user.id)
          .select()
          .single();

        if (error) throw error;
        
        console.log("Settings updated successfully");
        
        // Convert to AISettings type
        const updatedSettings: AISettings = {
          id: data.id,
          user_id: user.id,
          assistant_name: data.assistant_name || "WAKTI",
          tone: data.tone || "balanced",
          response_length: data.response_length || "balanced",
          proactiveness: data.proactiveness !== null ? data.proactiveness : true,
          suggestion_frequency: data.suggestion_frequency || "medium",
          role: data.role as AIAssistantRole || "general",
          enabled_features: data.enabled_features as Record<string, boolean> || {
            tasks: true,
            events: true,
            staff: true,
            analytics: true,
            messaging: true,
          },
          knowledge_profile: data.knowledge_profile || { role: data.role }
        };
        
        return updatedSettings;
      } else {
        // No id, so insert a new record
        const { data, error } = await supabase
          .from("ai_assistant_settings")
          .insert(settingsForUpdate)
          .select()
          .single();

        if (error) throw error;
        
        console.log("Settings created successfully");
        
        // Convert to AISettings type
        const createdSettings: AISettings = {
          id: data.id,
          user_id: user.id,
          assistant_name: data.assistant_name || "WAKTI",
          tone: data.tone || "balanced", 
          response_length: data.response_length || "balanced",
          proactiveness: data.proactiveness !== null ? data.proactiveness : true,
          suggestion_frequency: data.suggestion_frequency || "medium",
          role: data.role as AIAssistantRole || "general",
          enabled_features: data.enabled_features as Record<string, boolean> || {
            tasks: true,
            events: true,
            staff: true,
            analytics: true,
            messaging: true,
          },
          knowledge_profile: data.knowledge_profile || { role: data.role }
        };
        
        return createdSettings;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aiSettings", user?.id] });
      toast({
        title: "Settings updated",
        description: "Your AI assistant settings have been updated.",
      });
    },
    onError: (error) => {
      console.error("Error updating AI settings:", error);
      toast({
        title: "Error updating settings",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });
};
