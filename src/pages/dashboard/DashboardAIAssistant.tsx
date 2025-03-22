
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIAssistantChat } from "@/components/ai/assistant";
import AIAssistantUpgradeCard from "@/components/ai/AIAssistantUpgradeCard";
import AIAssistantHistoryCard from "@/components/ai/AIAssistantHistoryCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAISettings } from "@/hooks/ai/useAISettings";
import { toast } from "@/hooks/use-toast";

const DashboardAIAssistant = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const { settings, isLoading } = useAISettings();

  const handleActivateAI = () => {
    toast({
      title: "AI Assistant feature requires upgrade",
      description: "Please upgrade to a premium plan to access this feature.",
      variant: "destructive",
    });
  };

  const showUpgradeCard = false; // Replace with actual permission check
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
        <p className="text-muted-foreground">
          Get help, suggestions, and automate tasks using WAKTI's AI
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {showUpgradeCard ? (
            <AIAssistantUpgradeCard onActivate={handleActivateAI} />
          ) : (
            <Card className="border-none shadow-none">
              <CardHeader className="px-0 pt-0">
                <Tabs
                  defaultValue="chat"
                  className="w-full"
                  value={activeTab}
                  onValueChange={setActiveTab}
                >
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="chat">Chat</TabsTrigger>
                    <TabsTrigger value="business">
                      Business Automation
                    </TabsTrigger>
                    <TabsTrigger value="personal">
                      Personal Assistant
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="chat" className="mt-0">
                    <CardContent className="p-0">
                      <AIAssistantChat />
                    </CardContent>
                  </TabsContent>

                  <TabsContent value="business" className="mt-0">
                    <CardContent className="p-0">
                      <div className="min-h-[60vh] flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-muted-foreground">
                            Business automation features coming soon!
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </TabsContent>

                  <TabsContent value="personal" className="mt-0">
                    <CardContent className="p-0">
                      <div className="min-h-[60vh] flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-muted-foreground">
                            Personal assistant features coming soon!
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </TabsContent>
                </Tabs>
              </CardHeader>
            </Card>
          )}
        </div>
        
        <div className="space-y-6">
          <AIAssistantHistoryCard />
          <Card>
            <CardHeader>
              <CardTitle>AI Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Configure how the AI assistant works with your data and preferences.
              </p>
              <div className="space-y-2">
                {isLoading ? (
                  <p>Loading settings...</p>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    <p>Language: {settings?.language || "English"}</p>
                    <p>Personality: {settings?.personality || "Professional"}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardAIAssistant;
