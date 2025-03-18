
import React, { useState, useEffect } from "react";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { AISettings } from "@/types/ai-assistant.types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIAssistantUpgradeCard } from "@/components/ai/AIAssistantUpgradeCard";
import { Loader2, Bot, AlertTriangle } from "lucide-react";
import { AIPersonalityTab } from "./AIPersonalityTab";
import { AIFeaturesTab } from "./AIFeaturesTab";
import { AIKnowledgeTab } from "./AIKnowledgeTab";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

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
  const [isCreatingSettings, setIsCreatingSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
  
  const createDefaultSettings = async () => {
    setIsCreatingSettings(true);
    setError(null);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError("No active session. Please log in again.");
        setIsCreatingSettings(false);
        toast({
          title: "Authentication error",
          description: "No active session. Please log in again.",
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
        setIsCreatingSettings(false);
        return;
      }
      
      toast({
        title: "Default settings created",
        description: "Your AI assistant settings have been created with default values",
      });
      
      // Refresh the page to load the new settings
      window.location.reload();
      
    } catch (err) {
      console.error("Error in createDefaultSettings:", err);
      setError("An unexpected error occurred. Please try again.");
      toast({
        title: "Error creating settings",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingSettings(false);
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
