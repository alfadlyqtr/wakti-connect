
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@/hooks/auth";
import { AISettings } from "@/types/ai-assistant.types";

/**
 * Mutation hook for updating AI settings
 */
export const useUpdateAISettings = (user: User | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newSettings: AISettings) => {
      if (!user) throw new Error("User not authenticated");

      console.log("Updating AI settings:", newSettings);
      
      // Prepare settings for Supabase
      const settingsForUpdate = {
        user_id: user.id,
        assistant_name: newSettings.assistant_name,
        tone: newSettings.tone,
        response_length: newSettings.response_length,
        proactiveness: newSettings.proactiveness,
        suggestion_frequency: newSettings.suggestion_frequency,
        role: newSettings.role, // This should match the database enum type
        enabled_features: newSettings.enabled_features
      };

      // If we have an id, update the existing record
      if (newSettings.id) {
        const { data, error } = await supabase
          .from("ai_assistant_settings")
          .update({
            assistant_name: settingsForUpdate.assistant_name,
            tone: settingsForUpdate.tone,
            response_length: settingsForUpdate.response_length,
            proactiveness: settingsForUpdate.proactiveness,
            suggestion_frequency: settingsForUpdate.suggestion_frequency,
            role: settingsForUpdate.role,
            enabled_features: settingsForUpdate.enabled_features
          })
          .eq("user_id", user.id)
          .select()
          .single();

        if (error) throw error;
        
        console.log("Settings updated successfully");
        
        // Convert to AISettings type
        const updatedSettings: AISettings = {
          id: data.id,
          assistant_name: data.assistant_name || "WAKTI",
          tone: (data.tone as AISettings["tone"]) || "balanced",
          response_length: (data.response_length as AISettings["response_length"]) || "balanced",
          proactiveness: data.proactiveness !== null ? data.proactiveness : true,
          suggestion_frequency: (data.suggestion_frequency as AISettings["suggestion_frequency"]) || "medium",
          role: (data.role as AISettings["role"]) || "general",
          enabled_features: data.enabled_features as AISettings["enabled_features"] || {
            tasks: true,
            events: true,
            staff: true,
            analytics: true,
            messaging: true,
          }
        };
        
        return updatedSettings;
      } else {
        // No id, so insert a new record
        const { data, error } = await supabase
          .from("ai_assistant_settings")
          .insert({
            user_id: settingsForUpdate.user_id,
            assistant_name: settingsForUpdate.assistant_name,
            tone: settingsForUpdate.tone,
            response_length: settingsForUpdate.response_length,
            proactiveness: settingsForUpdate.proactiveness,
            suggestion_frequency: settingsForUpdate.suggestion_frequency,
            role: settingsForUpdate.role,
            enabled_features: settingsForUpdate.enabled_features
          })
          .select()
          .single();

        if (error) throw error;
        
        console.log("Settings created successfully");
        
        // Convert to AISettings type
        const createdSettings: AISettings = {
          id: data.id,
          assistant_name: data.assistant_name || "WAKTI",
          tone: (data.tone as AISettings["tone"]) || "balanced",
          response_length: (data.response_length as AISettings["response_length"]) || "balanced",
          proactiveness: data.proactiveness !== null ? data.proactiveness : true,
          suggestion_frequency: (data.suggestion_frequency as AISettings["suggestion_frequency"]) || "medium",
          role: (data.role as AISettings["role"]) || "general",
          enabled_features: data.enabled_features as AISettings["enabled_features"] || {
            tasks: true,
            events: true,
            staff: true,
            analytics: true,
            messaging: true,
          }
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
