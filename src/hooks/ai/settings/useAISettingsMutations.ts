
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
      
      // Store the role, mode, and specialized settings in the enabled_features as a workaround
      // for missing columns in some database schemas
      const enhancedEnabledFeatures = {
        ...newSettings.enabled_features,
        _userRole: newSettings.user_role,
        _assistantMode: newSettings.assistant_mode,
        _specializedSettings: newSettings.specialized_settings
      };
      
      // Prepare settings for Supabase
      const settingsForUpdate = {
        user_id: user.id,
        assistant_name: newSettings.assistant_name,
        tone: newSettings.tone,
        response_length: newSettings.response_length,
        proactiveness: newSettings.proactiveness,
        suggestion_frequency: newSettings.suggestion_frequency,
        enabled_features: enhancedEnabledFeatures
      };

      // Try to add the new fields if they don't cause errors
      try {
        if (newSettings.user_role) {
          Object.assign(settingsForUpdate, { user_role: newSettings.user_role });
        }
        
        if (newSettings.assistant_mode) {
          Object.assign(settingsForUpdate, { assistant_mode: newSettings.assistant_mode });
        }
        
        if (newSettings.specialized_settings) {
          Object.assign(settingsForUpdate, { specialized_settings: newSettings.specialized_settings });
        }
      } catch (e) {
        console.log("Schema might not support new fields, using fallback method");
      }

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
        
        // Convert to AISettings type - use the same pattern as the query hook
        const dbData = data as any;
        
        const updatedSettings: AISettings = {
          id: dbData.id,
          assistant_name: dbData.assistant_name || "WAKTI",
          tone: (dbData.tone as AISettings["tone"]) || "balanced",
          response_length: (dbData.response_length as AISettings["response_length"]) || "balanced",
          proactiveness: dbData.proactiveness !== null ? dbData.proactiveness : true,
          suggestion_frequency: (dbData.suggestion_frequency as AISettings["suggestion_frequency"]) || "medium",
          enabled_features: dbData.enabled_features as AISettings["enabled_features"] || {
            tasks: true,
            events: true,
            staff: true,
            analytics: true,
            messaging: true,
            text_generation: true,
          }
        };
        
        // Extract special fields from enabled_features if they aren't in the main object
        if (dbData.user_role) {
          updatedSettings.user_role = dbData.user_role as AISettings["user_role"];
        } else if (
          updatedSettings.enabled_features && 
          typeof updatedSettings.enabled_features === 'object' && 
          '_userRole' in updatedSettings.enabled_features
        ) {
          updatedSettings.user_role = updatedSettings.enabled_features._userRole as AISettings["user_role"];
        }
        
        if (dbData.assistant_mode) {
          updatedSettings.assistant_mode = dbData.assistant_mode as AISettings["assistant_mode"];
        } else if (
          updatedSettings.enabled_features && 
          typeof updatedSettings.enabled_features === 'object' && 
          '_assistantMode' in updatedSettings.enabled_features
        ) {
          updatedSettings.assistant_mode = updatedSettings.enabled_features._assistantMode as AISettings["assistant_mode"];
        }
        
        if (dbData.specialized_settings) {
          updatedSettings.specialized_settings = dbData.specialized_settings as Record<string, any>;
        } else if (
          updatedSettings.enabled_features && 
          typeof updatedSettings.enabled_features === 'object' && 
          '_specializedSettings' in updatedSettings.enabled_features
        ) {
          updatedSettings.specialized_settings = updatedSettings.enabled_features._specializedSettings as Record<string, any>;
        }
        
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
        
        // Convert to AISettings type - use the same pattern
        const dbData = data as any;
        
        const createdSettings: AISettings = {
          id: dbData.id,
          assistant_name: dbData.assistant_name || "WAKTI",
          tone: (dbData.tone as AISettings["tone"]) || "balanced",
          response_length: (dbData.response_length as AISettings["response_length"]) || "balanced",
          proactiveness: dbData.proactiveness !== null ? dbData.proactiveness : true,
          suggestion_frequency: (dbData.suggestion_frequency as AISettings["suggestion_frequency"]) || "medium",
          enabled_features: dbData.enabled_features as AISettings["enabled_features"] || {
            tasks: true,
            events: true,
            staff: true,
            analytics: true,
            messaging: true,
            text_generation: true,
          }
        };
        
        // Extract special fields from enabled_features
        if (
          createdSettings.enabled_features && 
          typeof createdSettings.enabled_features === 'object'
        ) {
          if ('_userRole' in createdSettings.enabled_features) {
            createdSettings.user_role = createdSettings.enabled_features._userRole as AISettings["user_role"];
          }
          
          if ('_assistantMode' in createdSettings.enabled_features) {
            createdSettings.assistant_mode = createdSettings.enabled_features._assistantMode as AISettings["assistant_mode"];
          }
          
          if ('_specializedSettings' in createdSettings.enabled_features) {
            createdSettings.specialized_settings = createdSettings.enabled_features._specializedSettings as Record<string, any>;
          }
        }
        
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
