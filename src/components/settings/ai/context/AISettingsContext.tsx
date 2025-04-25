import React, { createContext, useContext, useState } from 'react';
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAISettingsQuery, useAIKnowledgeUploadsQuery, useCanUseAIQuery } from '@/hooks/ai/settings/useAISettingsQueries';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AISettings, AIKnowledgeUpload, AIAssistantRole } from '@/types/ai-assistant.types';
import { AISettingsContextType } from './AISettingsContext.types';
import { toast } from '@/components/ui/use-toast';

// Default empty context
const AISettingsContext = createContext<AISettingsContextType>({
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
});

export const AISettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isCreatingSettings, setIsCreatingSettings] = useState(false);
  
  // Fetch AI settings
  const {
    data: settings,
    isLoading: isLoadingSettings,
    error: settingsError,
  } = useAISettingsQuery(user);
  
  // Fetch knowledge uploads
  const {
    data: knowledgeUploads = [],
    isLoading: isLoadingKnowledge,
  } = useAIKnowledgeUploadsQuery(user);
  
  // Check if user can use AI
  const { data: canUseAI = false } = useCanUseAIQuery(user);
  
  // Update AI settings
  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: AISettings) => {
      if (!user) throw new Error("Not authenticated");
      
      const { error } = await supabase
        .from("ai_assistant_settings")
        .update({
          assistant_name: newSettings.assistant_name,
          role: newSettings.role as AIAssistantRole,
          tone: newSettings.tone,
          response_length: newSettings.response_length,
          proactiveness: newSettings.proactiveness,
          suggestion_frequency: newSettings.suggestion_frequency,
          enabled_features: newSettings.enabled_features,
        })
        .eq("id", newSettings.id);
      
      if (error) throw error;
      return newSettings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-settings'] });
      toast({
        title: "Settings updated",
        description: "Your AI assistant settings have been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: `Failed to update settings: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    },
  });
  
  // Create default settings
  const createDefaultSettings = async () => {
    if (!user) return;
    
    setIsCreatingSettings(true);
    
    try {
      const defaultSettings = {
        user_id: user.id,
        assistant_name: 'WAKTI',
        role: 'general' as AIAssistantRole,
        tone: 'balanced',
        response_length: 'balanced',
        proactiveness: true,
        suggestion_frequency: 'medium',
        enabled_features: {
          tasks: true,
          events: true,
          staff: true,
          analytics: true,
          messaging: true,
        }
      };
      
      const { error } = await supabase
        .from('ai_assistant_settings')
        .insert(defaultSettings);
      
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['ai-settings'] });
      
      toast({
        title: "Settings created",
        description: "Default AI assistant settings have been created.",
      });
    } catch (error) {
      console.error("Error creating default settings:", error);
      toast({
        title: "Creation failed",
        description: `Failed to create settings: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsCreatingSettings(false);
    }
  };
  
  // Add knowledge
  const addKnowledgeMutation = useMutation({
    mutationFn: async ({ title, content, role = 'general' }: {
      title: string;
      content: string;
      role?: AIAssistantRole;
    }) => {
      if (!user) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from("ai_knowledge_uploads")
        .insert({
          user_id: user.id,
          title,
          content, 
          role
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as AIKnowledgeUpload;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-knowledge-uploads'] });
      toast({
        title: "Knowledge added",
        description: "Your knowledge has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to add knowledge",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    },
  });
  
  // Delete knowledge
  const deleteKnowledgeMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("Not authenticated");
      
      const { error } = await supabase
        .from("ai_knowledge_uploads")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-knowledge-uploads'] });
      toast({
        title: "Knowledge deleted",
        description: "The knowledge item has been removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    },
  });
  
  // Create the context value
  const contextValue: AISettingsContextType = {
    settings,
    isLoadingSettings,
    isUpdatingSettings: updateSettingsMutation.isPending,
    isAddingKnowledge: addKnowledgeMutation.isPending,
    knowledgeUploads,
    isLoadingKnowledge,
    canUseAI,
    error: settingsError as Error | string | null,
    updateSettings: async (newSettings) => {
      try {
        await updateSettingsMutation.mutateAsync(newSettings);
        return true;
      } catch (error) {
        return false;
      }
    },
    addKnowledge: async (title, content, role) => {
      try {
        await addKnowledgeMutation.mutateAsync({ title, content, role });
        return true;
      } catch (error) {
        return false;
      }
    },
    deleteKnowledge: async (id) => {
      try {
        await deleteKnowledgeMutation.mutateAsync(id);
        return true;
      } catch (error) {
        return false;
      }
    },
    createDefaultSettings,
    isCreatingSettings,
  };
  
  return (
    <AISettingsContext.Provider value={contextValue}>
      {children}
    </AISettingsContext.Provider>
  );
};

export const useAISettings = () => useContext(AISettingsContext);
