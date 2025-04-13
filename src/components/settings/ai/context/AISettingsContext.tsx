
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";
import { AISettings, AIKnowledgeUpload, AIAssistantRole } from "@/types/ai-assistant.types";
import { 
  fetchAISettings, 
  updateAISettings, 
  createDefaultAISettings 
} from "@/services/ai/aiSettingsService";
import { 
  fetchKnowledgeUploads, 
  addKnowledgeUpload, 
  deleteKnowledgeUpload 
} from "@/services/ai/knowledgeService";
import { useCanUseAIQuery } from "@/hooks/ai/settings/useAISettingsQueries";

interface AISettingsContextType {
  settings: AISettings | null;
  isLoadingSettings: boolean;
  isUpdatingSettings: boolean;
  isAddingKnowledge: boolean;
  knowledgeUploads: AIKnowledgeUpload[] | null;
  isLoadingKnowledge: boolean;
  canUseAI: boolean;
  error: string | null;
  updateSettings: (newSettings: AISettings) => Promise<boolean>;
  addKnowledge: (title: string, content: string, role?: AIAssistantRole) => Promise<boolean>;
  deleteKnowledge: (id: string) => Promise<boolean>;
  createDefaultSettings: () => Promise<void>;
  isCreatingSettings: boolean;
}

const AISettingsContext = createContext<AISettingsContextType | undefined>(undefined);

export const AISettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<AISettings | null>(null);
  const [knowledgeUploads, setKnowledgeUploads] = useState<AIKnowledgeUpload[] | null>(null);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [isLoadingKnowledge, setIsLoadingKnowledge] = useState(true);
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);
  const [isAddingKnowledge, setIsAddingKnowledge] = useState(false);
  const [isCreatingSettings, setIsCreatingSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { data: canUseData, isLoading: isLoadingAccess } = useCanUseAIQuery(user);
  const canUseAI = canUseData || false;
  
  // Load AI settings when user is available
  useEffect(() => {
    const loadSettings = async () => {
      if (!user) {
        setIsLoadingSettings(false);
        return;
      }
      
      try {
        setIsLoadingSettings(true);
        setError(null);
        const data = await fetchAISettings();
        setSettings(data);
      } catch (err) {
        console.error("Error loading AI settings:", err);
        setError("Failed to load AI settings");
      } finally {
        setIsLoadingSettings(false);
      }
    };
    
    loadSettings();
  }, [user]);
  
  // Load knowledge uploads when user is available
  useEffect(() => {
    const loadKnowledge = async () => {
      if (!user || !canUseAI) {
        setIsLoadingKnowledge(false);
        return;
      }
      
      try {
        setIsLoadingKnowledge(true);
        const data = await fetchKnowledgeUploads();
        setKnowledgeUploads(data);
      } catch (err) {
        console.error("Error loading knowledge uploads:", err);
      } finally {
        setIsLoadingKnowledge(false);
      }
    };
    
    loadKnowledge();
  }, [user, canUseAI]);
  
  const updateSettings = async (newSettings: AISettings): Promise<boolean> => {
    if (!user) return false;
    
    try {
      setIsUpdatingSettings(true);
      const updated = await updateAISettings(newSettings);
      setSettings(updated);
      toast({
        title: "Settings Updated",
        description: "Your AI assistant settings have been updated.",
        variant: "success"
      });
      return true;
    } catch (err) {
      console.error("Error updating AI settings:", err);
      toast({
        title: "Update Failed",
        description: "Failed to update AI assistant settings.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsUpdatingSettings(false);
    }
  };
  
  const addKnowledge = async (title: string, content: string, role?: AIAssistantRole): Promise<boolean> => {
    if (!user || !canUseAI) return false;
    
    try {
      setIsAddingKnowledge(true);
      const newUpload = await addKnowledgeUpload(title, content, role);
      setKnowledgeUploads(prev => prev ? [...prev, newUpload] : [newUpload]);
      toast({
        title: "Knowledge Added",
        description: "Your knowledge has been added to the AI assistant.",
        variant: "success"
      });
      return true;
    } catch (err) {
      console.error("Error adding knowledge:", err);
      toast({
        title: "Failed to Add Knowledge",
        description: "There was an error adding your knowledge.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsAddingKnowledge(false);
    }
  };
  
  const deleteKnowledge = async (id: string): Promise<boolean> => {
    if (!user || !canUseAI) return false;
    
    try {
      await deleteKnowledgeUpload(id);
      setKnowledgeUploads(prev => prev ? prev.filter(item => item.id !== id) : null);
      toast({
        title: "Knowledge Removed",
        description: "The knowledge has been removed from your AI assistant.",
        variant: "success"
      });
      return true;
    } catch (err) {
      console.error("Error deleting knowledge:", err);
      toast({
        title: "Failed to Remove Knowledge",
        description: "There was an error removing your knowledge.",
        variant: "destructive"
      });
      return false;
    }
  };
  
  const createDefaultSettings = async (): Promise<void> => {
    if (!user) return;
    
    try {
      setIsCreatingSettings(true);
      const newSettings = await createDefaultAISettings();
      setSettings(newSettings);
      toast({
        title: "Default Settings Created",
        description: "Default AI assistant settings have been created.",
        variant: "success"
      });
    } catch (err) {
      console.error("Error creating default settings:", err);
      toast({
        title: "Failed to Create Settings",
        description: "There was an error creating default settings.",
        variant: "destructive"
      });
    } finally {
      setIsCreatingSettings(false);
    }
  };
  
  return (
    <AISettingsContext.Provider
      value={{
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
      }}
    >
      {children}
    </AISettingsContext.Provider>
  );
};

export const useAISettings = (): AISettingsContextType => {
  const context = useContext(AISettingsContext);
  if (context === undefined) {
    throw new Error("useAISettings must be used within an AISettingsProvider");
  }
  return context;
};
