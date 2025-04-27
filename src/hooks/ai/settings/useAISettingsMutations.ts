
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";
import { AISettings } from "@/components/ai/personality-switcher/types";
import { AIAssistantRole } from "@/types/ai-assistant.types";
import { Json } from "@/types/supabase";

/**
 * Mutation hook for updating AI settings
 */
export const useUpdateAISettings = (user: User | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newSettings: AISettings) => {
      if (!user) throw new Error("User not authenticated");

      console.log("Updating AI settings:", newSettings);
      
      // Map WAKTIAIMode to supported AIAssistantRole (string type for db)
      const mapRoleToDbRole = (role: string): AIAssistantRole => {
        const validRoles: AIAssistantRole[] = ["student", "business_owner", "general", "employee", "writer"];
        if (validRoles.includes(role as AIAssistantRole)) {
          return role as AIAssistantRole;
        }
        // Map unsupported roles to general
        return "general";
      };
      
      // Get the valid database role
      const dbRole = mapRoleToDbRole(newSettings.role as string);
      
      // Prepare the settings object for database storage
      const baseSettings = {
        user_id: user.id,
        assistant_name: newSettings.assistant_name,
        tone: newSettings.tone,
        response_length: newSettings.response_length,
        proactiveness: newSettings.proactiveness,
        suggestion_frequency: newSettings.suggestion_frequency,
        role: dbRole, // Use the validated role value
        enabled_features: newSettings.enabled_features as unknown as Json
      };
      
      // If we have an id, update the existing record
      if (newSettings.id) {
        const { data, error } = await supabase
          .from("ai_assistant_settings")
          .update(baseSettings)
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
          role: data.role || "general",
          enabled_features: data.enabled_features ? {
            // Type conversion from Json to specific structure
            voice_input: data.enabled_features.voice_input === true,
            voice_output: data.enabled_features.voice_output === true,
            task_detection: data.enabled_features.task_detection === true,
            meeting_scheduling: data.enabled_features.meeting_scheduling === true,
            personalized_suggestions: data.enabled_features.personalized_suggestions === true,
            tasks: data.enabled_features.tasks === true,
            events: data.enabled_features.events === true,
            staff: data.enabled_features.staff === true,
            analytics: data.enabled_features.analytics === true,
            messaging: data.enabled_features.messaging === true,
          } : {
            tasks: true,
            events: true,
            staff: true,
            analytics: true,
            messaging: true,
            voice_input: true,
            voice_output: false,
            task_detection: true,
            meeting_scheduling: true,
            personalized_suggestions: true
          },
          knowledge_profile: newSettings.knowledge_profile || { role: data.role }
        };
        
        return updatedSettings;
      } else {
        // No id, so insert a new record
        const { data, error } = await supabase
          .from("ai_assistant_settings")
          .insert(baseSettings)
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
          role: data.role || "general",
          enabled_features: data.enabled_features ? {
            // Type conversion from Json to specific structure
            voice_input: data.enabled_features.voice_input === true,
            voice_output: data.enabled_features.voice_output === true,
            task_detection: data.enabled_features.task_detection === true,
            meeting_scheduling: data.enabled_features.meeting_scheduling === true,
            personalized_suggestions: data.enabled_features.personalized_suggestions === true,
            tasks: data.enabled_features.tasks === true,
            events: data.enabled_features.events === true,
            staff: data.enabled_features.staff === true,
            analytics: data.enabled_features.analytics === true,
            messaging: data.enabled_features.messaging === true,
          } : {
            tasks: true,
            events: true,
            staff: true,
            analytics: true,
            messaging: true,
            voice_input: true,
            voice_output: false,
            task_detection: true,
            meeting_scheduling: true,
            personalized_suggestions: true
          },
          knowledge_profile: newSettings.knowledge_profile || { role: data.role }
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
