
import React, { createContext, useContext, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AISettingsContextType } from "./AISettingsContext.types";
import { AIAssistantRole, AISettings, AIKnowledgeUpload } from "@/types/ai-assistant.types";
import { useQuery } from "@tanstack/react-query";
import { useUpdateAISettings } from "@/hooks/ai/settings/useAISettingsMutations";
import { useAISettingsQuery } from "@/hooks/ai/settings/useAISettingsQueries";
import { createDefaultAISettings } from "@/services/ai/aiSettingsService";
import { addKnowledgeItem, deleteKnowledgeItem } from "@/services/ai/aiKnowledgeService";

// Create context with a default value
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
  const [isCreatingSettings, setIsCreatingSettings] = useState(false);
  const [isAddingKnowledge, setIsAddingKnowledge] = useState(false);

  // Fetch AI settings using the query hook
  const {
    data: settings,
    isLoading: isLoadingSettings,
    error: settingsError,
    refetch: refetchSettings,
  } = useAISettingsQuery(user);

  // Mock implementation for knowledge uploads since we're not using the actual query hook
  const knowledgeUploads: AIKnowledgeUpload[] = [];
  const isLoadingKnowledge = false;
  const refetchKnowledge = async () => {};

  // Get update mutation
  const updateSettingsMutation = useUpdateAISettings(user);
  const isUpdatingSettings = false; // Mock implementation

  // Set canUseAI as a boolean value
  const canUseAI = true;  // For demo purposes, always return true

  // Create default settings if none exist
  const createDefaultSettings = async () => {
    if (!user) return;
    setIsCreatingSettings(true);
    try {
      await createDefaultAISettings(user.id);
      // Refetch settings after creation
      await refetchSettings();
    } catch (err) {
      console.error("Error creating default settings:", err);
    } finally {
      setIsCreatingSettings(false);
    }
  };

  // Update AI settings
  const updateSettings = async (newSettings: Partial<AISettings>): Promise<boolean> => {
    if (!user || !settings) return false;
    try {
      // Merge new settings with existing settings
      const mergedSettings = { ...settings, ...newSettings };
      await updateSettingsMutation(mergedSettings);
      await refetchSettings();
      return true;
    } catch (err) {
      console.error("Error updating settings:", err);
      return false;
    }
  };

  // Add knowledge to AI
  const addKnowledge = async (title: string, content: string, role?: AIAssistantRole): Promise<boolean> => {
    if (!user) return false;
    setIsAddingKnowledge(true);
    try {
      await addKnowledgeItem(user.id, title, content, role);
      await refetchKnowledge();
      return true;
    } catch (err) {
      console.error("Error adding knowledge:", err);
      return false;
    } finally {
      setIsAddingKnowledge(false);
    }
  };

  // Delete knowledge item
  const deleteKnowledge = async (id: string): Promise<boolean> => {
    if (!user) return false;
    try {
      await deleteKnowledgeItem(id, user.id);
      await refetchKnowledge();
      return true;
    } catch (err) {
      console.error("Error deleting knowledge:", err);
      return false;
    }
  };

  const contextValue: AISettingsContextType = {
    settings,
    isLoadingSettings,
    isUpdatingSettings,
    isAddingKnowledge,
    knowledgeUploads,
    isLoadingKnowledge,
    canUseAI,
    error: settingsError ? String(settingsError) : null,
    updateSettings,
    addKnowledge,
    deleteKnowledge,
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
