
import React, { useState } from 'react';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AIAssistantChat } from '@/components/ai/assistant/AIAssistantChat';
import { AISettingsProvider, useAISettings, AIVoiceSettingsTab } from '@/components/settings/ai';
import { useAuth } from '@/hooks/useAuth';

const DashboardAIAssistantContent = () => {
  const [activeTab, setActiveTab] = useState<string>("chat");
  const { settings, isLoadingSettings, updateSettings, canUseAI } = useAISettings();
  const { user } = useAuth();
  
  if (!canUseAI) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Assistant - Upgrade Required</CardTitle>
          <CardDescription>
            Access to the AI Assistant requires an active subscription.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Unlock the power of the WAKTI AI Assistant with a subscription upgrade.
          </p>
          <Button>Upgrade Now</Button>
        </CardContent>
      </Card>
    );
  }
  
  const handleChangeRole = async (newRole: string) => {
    if (!settings || !user) return;
    
    try {
      await updateSettings({
        ...settings,
        role: newRole as any
      });
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };
  
  return (
    <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-8">
      <div className="flex justify-between items-center">
        <TabsList>
          <TabsTrigger value="chat">Assistant</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="voice">Voice</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="chat" className="space-y-4">
        <AIAssistantChat />
      </TabsContent>
      
      <TabsContent value="settings" className="space-y-4">
        {settings && !isLoadingSettings && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>AI Assistant Role</CardTitle>
                <CardDescription>
                  Choose the primary role for your AI assistant
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <Button 
                    variant={settings.role === 'general' ? "default" : "outline"}
                    onClick={() => handleChangeRole('general')}
                    className="h-20 flex flex-col gap-1 justify-center"
                  >
                    <span>General</span>
                    <span className="text-xs font-normal">Day-to-day tasks</span>
                  </Button>
                  
                  <Button 
                    variant={settings.role === 'business_owner' ? "default" : "outline"}
                    onClick={() => handleChangeRole('business_owner')}
                    className="h-20 flex flex-col gap-1 justify-center"
                  >
                    <span>Business</span>
                    <span className="text-xs font-normal">Manage your business</span>
                  </Button>
                  
                  <Button 
                    variant={settings.role === 'employee' ? "default" : "outline"}
                    onClick={() => handleChangeRole('employee')}
                    className="h-20 flex flex-col gap-1 justify-center"
                  >
                    <span>Work</span>
                    <span className="text-xs font-normal">Productivity at work</span>
                  </Button>
                  
                  <Button 
                    variant={settings.role === 'student' ? "default" : "outline"}
                    onClick={() => handleChangeRole('student')}
                    className="h-20 flex flex-col gap-1 justify-center"
                  >
                    <span>Student</span>
                    <span className="text-xs font-normal">Academic assistance</span>
                  </Button>
                  
                  <Button 
                    variant={settings.role === 'writer' ? "default" : "outline"}
                    onClick={() => handleChangeRole('writer')}
                    className="h-20 flex flex-col gap-1 justify-center"
                  >
                    <span>Creative</span>
                    <span className="text-xs font-normal">Writing & creative work</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="voice" className="space-y-4">
        <AIVoiceSettingsTab />
      </TabsContent>
    </Tabs>
  );
};

export default function DashboardAIAssistant() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="AI Assistant"
        text="Your personal AI assistant for managing tasks and more"
      />
      <div className="grid gap-4">
        <AISettingsProvider>
          <DashboardAIAssistantContent />
        </AISettingsProvider>
      </div>
    </DashboardShell>
  );
}
