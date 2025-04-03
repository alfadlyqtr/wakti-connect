
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { AISettings } from "@/types/ai-assistant.types";
import { AISettingsContextType } from "./AISettingsContext.types";
import { handleUpdateSettings } from "./settingsOperations";
import { handleAddKnowledge, handleDeleteKnowledge } from "./knowledgeOperations";
import { createDefaultSettings as createDefaultSettingsImpl } from "./createDefaultSettings";

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
      // Execute the mutation and wait for it to complete
      await updateSettingsMutation.mutateAsync(newSettings);
      setError(null);
      return true;
    } catch (error) {
      console.error("Error updating settings:", error);
      setError(error instanceof Error ? error.message : "Unknown error occurred");
      return false;
    }
  };
  
  const addKnowledge = async (title: string, content: string) => {
    try {
      await addKnowledgeMutation.mutateAsync({ title, content });
      setError(null);
      return true;
    } catch (error) {
      console.error("Error adding knowledge:", error);
      setError(error instanceof Error ? error.message : "Unknown error occurred");
      return false;
    }
  };
  
  const deleteKnowledge = async (id: string) => {
    try {
      await deleteKnowledgeMutation.mutateAsync(id);
      setError(null);
      return true;
    } catch (error) {
      console.error("Error deleting knowledge:", error);
      setError(error instanceof Error ? error.message : "Unknown error occurred");
      return false;
    }
  };
  
  const createDefaultSettings = async () => {
    setIsCreatingSettings(true);
    try {
      await createDefaultSettingsImpl();
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
