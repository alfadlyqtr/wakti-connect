
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AISettings, AIKnowledgeUpload } from "@/components/ai/personality-switcher/types";
import { AISettingsContextType } from "./AISettingsContext.types";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Json } from "@/types/supabase";
import { useAISettingsQuery, useAIKnowledgeUploadsQuery } from "@/hooks/ai/settings/useAISettingsQueries";
import { useUpdateAISettings } from "@/hooks/ai/settings/useAISettingsMutations";
import { AIAssistantRole } from "@/types/ai-assistant.types";

// Create a default context
const defaultContext: AISettingsContextType = {
  settings: null,
  isLoadingSettings: false,
  isUpdatingSettings: false,
  isAddingKnowledge: false,
  knowledgeUploads: null,
  isLoadingKnowledge: false,
  canUseAI: false,
  error: null,
  updateSettings: async () => false,
  addKnowledge: async () => false,
  deleteKnowledge: async () => false,
  createDefaultSettings: async () => {},
  isCreatingSettings: false,
  // Add the missing properties
  updateFeature: async () => false,
  isLoading: false,
  uploadKnowledge: async () => false,
  isUploading: false,
  uploadError: null
};

// Create the context
const AISettingsContext = createContext<AISettingsContextType>(defaultContext);

// Create a provider component
export const AISettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [error, setError] = useState<string | Error | null>(null);
  const [isCreatingSettings, setIsCreatingSettings] = useState(false);
  const [isAddingKnowledge, setIsAddingKnowledge] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<Error | null>(null);

  // Fetch AI assistant settings
  const {
    data: aiSettings,
    isLoading: isLoadingSettings,
    refetch: refetchSettings
  } = useAISettingsQuery(user);

  // Fetch knowledge uploads
  const {
    data: knowledgeUploads,
    isLoading: isLoadingKnowledge,
    refetch: refetchKnowledge
  } = useAIKnowledgeUploadsQuery(user);

  // Use the mutation hook for updating settings
  const updateSettingsMutation = useUpdateAISettings(user);

  // Function to create default settings if none exist
  const createDefaultSettings = async () => {
    if (!user) {
      setError(new Error("User not authenticated"));
      return;
    }

    setIsCreatingSettings(true);
    setError(null);

    try {
      // Map role type to valid database enum value
      const mapRoleToDbRole = (role: string): AIAssistantRole => {
        const validRoles: AIAssistantRole[] = ["student", "business_owner", "general", "employee", "writer"];
        if (validRoles.includes(role as AIAssistantRole)) {
          return role as AIAssistantRole;
        }
        return "general";
      };

      // Default settings with type-safe role
      const defaultSettings = {
        user_id: user.id,
        assistant_name: 'WAKTI Assistant',
        role: mapRoleToDbRole('general'),
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

      // Insert into ai_assistant_settings table (not ai_settings)
      const { data, error: insertError } = await supabase
        .from('ai_assistant_settings')
        .insert({
          user_id: defaultSettings.user_id,
          assistant_name: defaultSettings.assistant_name,
          role: defaultSettings.role,
          tone: defaultSettings.tone,
          response_length: defaultSettings.response_length,
          proactiveness: defaultSettings.proactiveness,
          suggestion_frequency: defaultSettings.suggestion_frequency,
          enabled_features: defaultSettings.enabled_features as unknown as Json
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Convert the database result to our AISettings type
      const settings: AISettings = {
        user_id: data.user_id,
        assistant_name: data.assistant_name,
        role: data.role,
        tone: data.tone,
        response_length: data.response_length,
        proactiveness: data.proactiveness,
        suggestion_frequency: data.suggestion_frequency,
        enabled_features: data.enabled_features as unknown as AISettings['enabled_features']
      };

      // Refresh the settings data
      refetchSettings();
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error("Error creating default settings:", err);
    } finally {
      setIsCreatingSettings(false);
    }
  };

  // Update a single feature (for toggle switches)
  const updateFeature = async (featureName: string, enabled: boolean): Promise<boolean> => {
    if (!user || !aiSettings) {
      setError(new Error("User not authenticated or settings not loaded"));
      return false;
    }

    try {
      // Create a copy of the current settings to modify
      const updatedSettings = { ...aiSettings };
      
      // Update the specific feature
      if (!updatedSettings.enabled_features) {
        updatedSettings.enabled_features = {} as AISettings['enabled_features'];
      }

      // Type assertion to allow dynamic property access
      (updatedSettings.enabled_features as any)[featureName] = enabled;

      // Use the update settings function to save changes
      const success = await updateSettings(updatedSettings);
      return success;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error(`Error updating feature ${featureName}:`, err);
      return false;
    }
  };

  // Add knowledge to the assistant
  const addKnowledge = async (title: string, content: string, role?: string): Promise<boolean> => {
    if (!user) {
      setError(new Error("User not authenticated"));
      return false;
    }

    setIsAddingKnowledge(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('ai_knowledge_uploads')
        .insert({
          user_id: user.id,
          title,
          content,
          // Add role if provided
          ...(role ? { role } : {})
        });

      if (insertError) throw insertError;

      // Refresh knowledge data
      refetchKnowledge();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error("Error adding knowledge:", err);
      return false;
    } finally {
      setIsAddingKnowledge(false);
    }
  };

  // Upload knowledge file
  const uploadKnowledge = async (file: File, title: string): Promise<boolean> => {
    if (!user) {
      setError(new Error("User not authenticated"));
      return false;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Read file content
      const fileContent = await file.text();
      
      // Use the addKnowledge function to store the file content
      const success = await addKnowledge(title, fileContent);
      return success;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setUploadError(error);
      console.error("Error uploading knowledge:", err);
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  // Delete knowledge item
  const deleteKnowledge = async (id: string): Promise<boolean> => {
    if (!user) {
      setError(new Error("User not authenticated"));
      return false;
    }

    try {
      const { error: deleteError } = await supabase
        .from('ai_knowledge_uploads')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      // Refresh knowledge data
      refetchKnowledge();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error("Error deleting knowledge:", err);
      return false;
    }
  };

  // Wrap the mutation function to return a boolean result
  const updateSettings = async (newSettings: AISettings): Promise<boolean> => {
    try {
      await updateSettingsMutation.mutateAsync(newSettings);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error("Error updating settings:", err);
      return false;
    }
  };

  // Simple check - allow AI for all authenticated users
  const canUseAI = !!user;

  // Provide the context value
  const value: AISettingsContextType = {
    settings: aiSettings || null,
    isLoadingSettings: isLoadingSettings,
    isUpdatingSettings: updateSettingsMutation.isPending,
    isAddingKnowledge,
    knowledgeUploads,
    isLoadingKnowledge,
    canUseAI,
    error,
    updateSettings,
    addKnowledge,
    deleteKnowledge,
    createDefaultSettings,
    isCreatingSettings,
    // Add the missing properties
    updateFeature,
    isLoading: isLoadingSettings,
    uploadKnowledge,
    isUploading,
    uploadError
  };

  return (
    <AISettingsContext.Provider value={value}>
      {children}
    </AISettingsContext.Provider>
  );
};

// Create a hook to use the context
export const useAISettings = () => useContext(AISettingsContext);
