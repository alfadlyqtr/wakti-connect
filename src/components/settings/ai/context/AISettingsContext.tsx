
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { AISettings, AIKnowledgeUpload } from "@/types/ai-assistant.types";
import { toast } from "@/components/ui/use-toast";

type AISettingsContextType = {
  settings: AISettings | null;
  isLoadingSettings: boolean;
  isUpdatingSettings: boolean;
  isAddingKnowledge: boolean;
  knowledgeUploads?: AIKnowledgeUpload[];
  isLoadingKnowledge: boolean;
  canUseAI: boolean;
  error: string | null;
  updateSettings: (newSettings: AISettings) => Promise<void>;
  addKnowledge: (title: string, content: string) => Promise<void>;
  deleteKnowledge: (id: string) => Promise<void>;
  createDefaultSettings: () => Promise<void>;
  isCreatingSettings: boolean;
};

const AISettingsContext = createContext<AISettingsContextType | undefined>(undefined);

export const AISettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    aiSettings, 
    isLoadingSettings, 
    updateSettings: updateSettingsMutation, 
    canUseAI,
    addKnowledge: addKnowledgeMutation,
    knowledgeUploads,
    isLoadingKnowledge,
    deleteKnowledge: deleteKnowledgeMutation
  } = useAIAssistant();
  
  const [settings, setSettings] = useState<AISettings | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingSettings, setIsCreatingSettings] = useState(false);
  
  useEffect(() => {
    if (aiSettings) {
      setSettings(aiSettings);
      setError(null);
    }
  }, [aiSettings]);

  const updateSettings = async (newSettings: AISettings) => {
    try {
      await updateSettingsMutation.mutateAsync(newSettings);
      toast({
        title: "Settings saved",
        description: "Your AI assistant settings have been updated",
      });
    } catch (err) {
      console.error("Error saving settings:", err);
      setError("Unable to save settings. Please try again.");
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your AI assistant settings",
        variant: "destructive",
      });
      throw err;
    }
  };
  
  const addKnowledge = async (title: string, content: string) => {
    try {
      await addKnowledgeMutation.mutateAsync({
        title,
        content
      });
      toast({
        title: "Knowledge added",
        description: "Your knowledge has been added to the AI assistant",
      });
    } catch (err) {
      console.error("Error adding knowledge:", err);
      setError("Unable to add knowledge. Please try again.");
      toast({
        title: "Error adding knowledge",
        description: "There was a problem adding your knowledge to the AI assistant",
        variant: "destructive",
      });
      throw err;
    }
  };
  
  const deleteKnowledge = async (id: string) => {
    try {
      await deleteKnowledgeMutation.mutateAsync(id);
      toast({
        title: "Knowledge deleted",
        description: "Your knowledge has been removed from the AI assistant",
      });
    } catch (err) {
      console.error("Error deleting knowledge:", err);
      setError("Unable to delete knowledge. Please try again.");
      toast({
        title: "Error deleting knowledge", 
        description: "There was a problem removing your knowledge from the AI assistant",
        variant: "destructive",
      });
      throw err;
    }
  };
  
  const createDefaultSettings = async () => {
    setIsCreatingSettings(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        const errorMsg = "No active session. Please log in again.";
        setError(errorMsg);
        toast({
          title: "Error creating settings",
          description: errorMsg,
          variant: "destructive",
        });
        return;
      }
      
      // Create default settings for the user
      const defaultSettings: Omit<AISettings, "id"> = {
        assistant_name: "WAKTI",
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
      
      const { data, error } = await supabase
        .from("ai_assistant_settings")
        .insert({
          user_id: session.user.id,
          ...defaultSettings
        })
        .select()
        .maybeSingle();
        
      if (error) {
        console.error("Error creating default settings:", error);
        setError(`Unable to create settings: ${error.message}`);
        toast({
          title: "Error creating settings",
          description: `Unable to create settings: ${error.message}`,
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Default settings created",
        description: "Your AI assistant settings have been created with default values",
      });
      window.location.reload();
    } catch (err) {
      console.error("Error in createDefaultSettings:", err);
      const errorMsg = "An unexpected error occurred. Please try again.";
      setError(errorMsg);
      toast({
        title: "Error creating settings",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsCreatingSettings(false);
    }
  };

  const value = {
    settings,
    isLoadingSettings,
    isUpdatingSettings: updateSettingsMutation.isPending,
    isAddingKnowledge: addKnowledgeMutation.isPending,
    knowledgeUploads,
    isLoadingKnowledge,
    canUseAI,
    error,
    updateSettings,
    addKnowledge,
    deleteKnowledge,
    createDefaultSettings,
    isCreatingSettings
  };

  return (
    <AISettingsContext.Provider value={value}>
      {children}
    </AISettingsContext.Provider>
  );
};

export const useAISettings = () => {
  const context = useContext(AISettingsContext);
  if (context === undefined) {
    throw new Error("useAISettings must be used within an AISettingsProvider");
  }
  return context;
};

// Import supabase client for the createDefaultSettings function
import { supabase } from "@/integrations/supabase/client";
