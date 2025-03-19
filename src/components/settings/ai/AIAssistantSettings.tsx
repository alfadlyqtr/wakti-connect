
import React, { useState, useEffect } from "react";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { AISettings } from "@/types/ai-assistant.types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIAssistantUpgradeCard } from "@/components/ai/AIAssistantUpgradeCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Bot, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Import our refactored components
import { AIPersonalityTab } from "./AIPersonalityTab";
import { AIFeaturesTab } from "./AIFeaturesTab";
import { AIKnowledgeTab } from "./AIKnowledgeTab";
import { useCreateDefaultSettings } from "./hooks/useCreateDefaultSettings";

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
  const [error, setError] = useState<string | null>(null);
  
  const { createDefaultSettings, isCreatingSettings } = useCreateDefaultSettings({
    onSuccess: () => {
      toast({
        title: "Default settings created",
        description: "Your AI assistant settings have been created with default values",
      });
      window.location.reload();
    },
    onError: (errorMsg) => {
      setError(errorMsg);
      toast({
        title: "Error creating settings",
        description: errorMsg,
        variant: "destructive",
      });
    }
  });
  
  useEffect(() => {
    if (aiSettings) {
      setNewSettings(aiSettings);
      setError(null);
    }
  }, [aiSettings]);
  
  const handleSaveSettings = async () => {
    if (!newSettings) return;
    try {
      await updateSettings.mutateAsync(newSettings);
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
    }
  };
  
  const handleAddKnowledge = async (title: string, content: string) => {
    try {
      await addKnowledge.mutateAsync({
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
    }
  };
  
  const handleDeleteKnowledge = async (id: string) => {
    try {
      await deleteKnowledge.mutateAsync(id);
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
    }
  };
  
  if (!canUseAI) {
    return <AIAssistantUpgradeCard />;
  }
  
  if (isLoadingSettings) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-wakti-blue" />
      </div>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Error Loading AI Settings
          </CardTitle>
          <CardDescription>
            There was a problem loading your AI assistant settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-red-500">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
          >
            Refresh Page
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  if (!newSettings) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-wakti-blue" />
            AI Assistant Settings
          </CardTitle>
          <CardDescription>
            You don't have any AI assistant settings configured yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={createDefaultSettings} 
            disabled={isCreatingSettings}
          >
            {isCreatingSettings ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Settings...
              </>
            ) : (
              "Create Default Settings"
            )}
          </Button>
        </CardContent>
      </Card>
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
