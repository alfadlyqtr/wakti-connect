
import React, { createContext, useContext, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AISettingsContextType } from "./AISettingsContext.types";
import { AIAssistantRole, AISettings, AIKnowledgeUpload } from "@/types/ai-assistant.types";
import { useQuery } from "@tanstack/react-query";
import { useUpdateAISettings } from "@/hooks/ai/settings/useAISettingsMutations";
import { fetchAISettings, fetchKnowledgeUploads } from "@/hooks/ai/settings/useAISettingsQueries";
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

  // Fetch AI settings
  const {
    data: settings,
    isLoading: isLoadingSettings,
    error: settingsError,
  } = useQuery({
    queryKey: ["aiSettings", user?.id],
    queryFn: () => fetchAISettings(user),
    enabled: !!user,
  });

  // Fetch knowledge uploads
  const {
    data: knowledgeUploads,
    isLoading: isLoadingKnowledge,
  } = useQuery({
    queryKey: ["knowledgeUploads", user?.id],
    queryFn: () => fetchKnowledgeUploads(user),
    enabled: !!user,
  });

  // Get update mutation
  const updateSettingsMutation = useUpdateAISettings(user);
  const isUpdatingSettings = updateSettingsMutation.isPending;

  // Helper function to determine if the user can use AI (based on subscription, etc.)
  const canUseAI = true;  // For demo purposes, always return true

  // Create default settings if none exist
  const createDefaultSettings = async () => {
    if (!user) return;
    setIsCreatingSettings(true);
    try {
      await createDefaultAISettings(user.id);
      // Refetch settings after creation
      await fetchAISettings(user);
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
      await updateSettingsMutation.mutateAsync(mergedSettings);
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
