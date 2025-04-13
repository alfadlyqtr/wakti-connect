
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { AISettings, AIAssistantRole } from "@/types/ai-assistant.types";
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
    canUseAI: canUseAIFunc,
    addKnowledge: addKnowledgeMutation,
    knowledgeUploads,
    isLoadingKnowledge,
    deleteKnowledge: deleteKnowledgeMutation
  } = useAIAssistant();
  
  const [settings, setSettings] = useState<AISettings | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingSettings, setIsCreatingSettings] = useState(false);
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);
  const [isAddingKnowledge, setIsAddingKnowledge] = useState(false);
  
  useEffect(() => {
    if (aiSettings) {
      setSettings(aiSettings);
      setError(null);
    }
  }, [aiSettings]);

  const updateSettings = async (newSettings: AISettings) => {
    setIsUpdatingSettings(true);
    try {
      return await handleUpdateSettings(updateSettingsMutation, newSettings, setError);
    } finally {
      setIsUpdatingSettings(false);
    }
  };
  
  const addKnowledge = async (title: string, content: string, role?: AIAssistantRole) => {
    setIsAddingKnowledge(true);
    try {
      return await handleAddKnowledge(addKnowledgeMutation, title, content, setError, role);
    } finally {
      setIsAddingKnowledge(false);
    }
  };
  
  const deleteKnowledge = async (id: string) => {
    return handleDeleteKnowledge(deleteKnowledgeMutation, id, setError);
  };
  
  const createDefaultSettings = async () => {
    setIsCreatingSettings(true);
    try {
      await createDefaultSettingsImpl();
    } finally {
      setIsCreatingSettings(false);
    }
  };

  // Evaluate canUseAI once and store as boolean
  const canUseAI = typeof canUseAIFunc === 'function' ? canUseAIFunc() : !!canUseAIFunc;

  const value = {
    settings,
    isLoadingSettings,
    isUpdatingSettings,
    isAddingKnowledge,
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
