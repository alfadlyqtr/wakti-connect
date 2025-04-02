
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAISettings as useAISettingsHook } from "@/hooks/ai/settings";
import { AISettings } from "@/types/ai-assistant.types";
import { UseMutationResult } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface AIKnowledgeUpload {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

interface AISettingsContextType {
  settings: AISettings | null;
  updateSettings: (settings: AISettings) => void;
  isUpdatingSettings: boolean;
  isLoadingSettings: boolean;
  error: Error | null;
  canUseAI: boolean;
  createDefaultSettings: () => void;
  isCreatingSettings: boolean;
  knowledgeUploads: AIKnowledgeUpload[];
  isLoadingKnowledge: boolean;
  addKnowledge: (title: string, content: string) => Promise<void>;
  deleteKnowledge: (id: string) => Promise<void>;
  isAddingKnowledge: boolean;
}

const AISettingsContext = createContext<AISettingsContextType | undefined>(undefined);

export const AISettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { 
    aiSettings, 
    isLoadingSettings, 
    settingsError, 
    updateSettings: updateSettingsMutation, 
    canUseAI 
  } = useAISettingsHook();
  
  const [isCreatingSettings, setIsCreatingSettings] = useState(false);
  const [knowledgeUploads, setKnowledgeUploads] = useState<AIKnowledgeUpload[]>([]);
  const [isLoadingKnowledge, setIsLoadingKnowledge] = useState(false);
  const [isAddingKnowledge, setIsAddingKnowledge] = useState(false);
  
  // Load knowledge uploads for this user
  useEffect(() => {
    const fetchKnowledgeUploads = async () => {
      if (!user) return;
      
      setIsLoadingKnowledge(true);
      try {
        const { data, error } = await supabase
          .from("ai_knowledge_uploads")
          .select("id, title, content, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        
        setKnowledgeUploads(data || []);
      } catch (error) {
        console.error("Error fetching knowledge uploads:", error);
        toast({
          title: "Error loading knowledge",
          description: error instanceof Error ? error.message : "Could not load your AI knowledge uploads",
          variant: "destructive",
        });
      } finally {
        setIsLoadingKnowledge(false);
      }
    };
    
    fetchKnowledgeUploads();
  }, [user]);
  
  const createDefaultSettings = async () => {
    if (!user) return;
    
    setIsCreatingSettings(true);
    try {
      // Create default settings
      const defaultSettings: AISettings = {
        assistant_name: "WAKTI AI",
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
      
      await updateSettingsMutation.mutateAsync(defaultSettings);
      
      toast({
        title: "Settings Created",
        description: "Default AI assistant settings have been created.",
      });
    } catch (error) {
      console.error("Error creating default settings:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Could not create default settings",
        variant: "destructive",
      });
    } finally {
      setIsCreatingSettings(false);
    }
  };
  
  const updateSettings = (settings: AISettings) => {
    if (!user) return;
    updateSettingsMutation.mutate(settings);
  };
  
  const addKnowledge = async (title: string, content: string) => {
    if (!user) return;
    
    setIsAddingKnowledge(true);
    try {
      const { data, error } = await supabase
        .from("ai_knowledge_uploads")
        .insert({
          user_id: user.id,
          title,
          content,
        })
        .select("id, title, content, created_at")
        .single();
        
      if (error) throw error;
      
      setKnowledgeUploads(prev => [data, ...prev]);
      
      toast({
        title: "Knowledge Added",
        description: "Your knowledge has been added to the AI assistant.",
      });
    } catch (error) {
      console.error("Error adding knowledge:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Could not add knowledge",
        variant: "destructive",
      });
    } finally {
      setIsAddingKnowledge(false);
    }
  };
  
  const deleteKnowledge = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from("ai_knowledge_uploads")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);
        
      if (error) throw error;
      
      setKnowledgeUploads(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: "Knowledge Removed",
        description: "The knowledge item has been removed from your AI assistant.",
      });
    } catch (error) {
      console.error("Error deleting knowledge:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Could not delete knowledge",
        variant: "destructive",
      });
    }
  };
  
  return (
    <AISettingsContext.Provider value={{
      settings: aiSettings,
      updateSettings,
      isUpdatingSettings: updateSettingsMutation.isPending,
      isLoadingSettings,
      error: settingsError,
      canUseAI: canUseAI,
      createDefaultSettings,
      isCreatingSettings,
      knowledgeUploads,
      isLoadingKnowledge,
      addKnowledge,
      deleteKnowledge,
      isAddingKnowledge,
    }}>
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
