
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIAssistantUpgradeCard } from "@/components/ai/AIAssistantUpgradeCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Bot, AlertTriangle } from "lucide-react";

// Import our refactored components
import { AIPersonalityTab } from "./AIPersonalityTab";
import { AIFeaturesTab } from "./AIFeaturesTab";
import { AIKnowledgeTab } from "./AIKnowledgeTab";
import { AISettingsProvider, useAISettings } from "./context/AISettingsContext";

// Create a component that uses the context
const AIAssistantSettingsContent = () => {
  const { 
    settings, 
    isLoadingSettings, 
    error,
    canUseAI,
    createDefaultSettings,
    isCreatingSettings,
    knowledgeUploads,
    isLoadingKnowledge,
    addKnowledge,
    deleteKnowledge,
    isAddingKnowledge
  } = useAISettings();
  
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
          <p className="text-sm text-red-500">{error instanceof Error ? error.message : String(error)}</p>
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
  
  if (!settings) {
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
        <AIPersonalityTab />
      </TabsContent>
      
      <TabsContent value="features">
        <AIFeaturesTab />
      </TabsContent>
      
      <TabsContent value="knowledge">
        <AIKnowledgeTab />
      </TabsContent>
    </Tabs>
  );
};

// Export the wrapper component that provides the context
export const AIAssistantSettings = () => {
  return (
    <AISettingsProvider>
      <AIAssistantSettingsContent />
    </AISettingsProvider>
  );
};
