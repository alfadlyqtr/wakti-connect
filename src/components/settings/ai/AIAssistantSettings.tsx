
import React, { useState, useEffect } from "react";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { AISettings } from "@/types/ai-assistant.types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIAssistantUpgradeCard } from "@/components/ai/AIAssistantUpgradeCard";
import { Loader2, Bot } from "lucide-react";
import { AIPersonalityTab } from "./AIPersonalityTab";
import { AIFeaturesTab } from "./AIFeaturesTab";
import { AIKnowledgeTab } from "./AIKnowledgeTab";

export const AIAssistantSettings = () => {
  const { 
    aiSettings, 
    isLoadingSettings, 
    updateSettings, 
    canUseAI,
    addKnowledge,
    knowledgeUploads,
    isLoadingKnowledge,
    deleteKnowledge
  } = useAIAssistant();
  
  const [newSettings, setNewSettings] = useState<AISettings | null>(null);
  
  useEffect(() => {
    if (aiSettings) {
      setNewSettings(aiSettings);
    }
  }, [aiSettings]);
  
  const handleSaveSettings = async () => {
    if (!newSettings) return;
    await updateSettings.mutateAsync(newSettings);
  };
  
  const handleAddKnowledge = async (title: string, content: string) => {
    await addKnowledge.mutateAsync({
      title,
      content
    });
  };
  
  const handleDeleteKnowledge = async (id: string) => {
    await deleteKnowledge.mutateAsync(id);
  };
  
  if (!canUseAI) {
    return <AIAssistantUpgradeCard />;
  }
  
  if (isLoadingSettings || !newSettings) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-wakti-blue" />
      </div>
    );
  }
  
  return (
    <Tabs defaultValue="personality">
      <TabsList className="grid grid-cols-3 w-full max-w-md mb-4">
        <TabsTrigger value="personality">Personality</TabsTrigger>
        <TabsTrigger value="features">Features</TabsTrigger>
        <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
      </TabsList>
      
      <TabsContent value="personality">
        <AIPersonalityTab
          settings={newSettings}
          onSettingsChange={setNewSettings}
          onSave={handleSaveSettings}
          isSaving={updateSettings.isPending}
        />
      </TabsContent>
      
      <TabsContent value="features">
        <AIFeaturesTab
          settings={newSettings}
          onSettingsChange={setNewSettings}
          onSave={handleSaveSettings}
          isSaving={updateSettings.isPending}
        />
      </TabsContent>
      
      <TabsContent value="knowledge">
        <AIKnowledgeTab
          knowledgeUploads={knowledgeUploads}
          isLoadingKnowledge={isLoadingKnowledge}
          onAddKnowledge={handleAddKnowledge}
          onDeleteKnowledge={handleDeleteKnowledge}
          isAddingKnowledge={addKnowledge.isPending}
        />
      </TabsContent>
    </Tabs>
  );
};
