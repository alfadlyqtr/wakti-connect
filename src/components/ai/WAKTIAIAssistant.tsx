
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { WAKTIAIMode, WAKTIAIModes } from '@/types/ai-assistant.types';
import { AIModeSwitcher } from './mode/AIModeSwitcher';
import { AIAssistantChatWindow } from './chat/AIAssistantChatWindow';
import { AIAssistantToolbar } from './input/AIAssistantToolbar';
import { MeetingSummaryTool } from './tools/MeetingSummaryTool';
import { LockIcon, MessageSquare, Wrench } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { useProfile } from '@/hooks/useProfile';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { useGlobalChatMemory } from '@/hooks/ai/chat/useGlobalChatMemory';

const WAKTIAIAssistant = () => {
  const { user } = useAuth();
  const { profile } = useProfile(user?.id);
  const { activeMode, setActiveMode, clearMessages } = useAIAssistant();
  const [activeTab, setActiveTab] = useState('chat');
  const [canAccessAI, setCanAccessAI] = useState(false);
  const [showMeetingTool, setShowMeetingTool] = useState(false);
  
  // Check if the user can access the AI Assistant based on their role
  useEffect(() => {
    if (profile) {
      const accountType = profile.account_type;
      setCanAccessAI(accountType === 'individual' || accountType === 'business');
    }
  }, [profile]);
  
  // Show meeting tool in Creative mode
  useEffect(() => {
    setShowMeetingTool(activeMode === 'creative');
  }, [activeMode]);

  // Staff users can't access the AI assistant
  if (profile?.account_type === 'staff') {
    return (
      <Card className="shadow-lg border-2 border-red-100">
        <CardContent className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <LockIcon className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
          <p className="text-muted-foreground max-w-md">
            The WAKTI AI Assistant is not available for staff accounts. Please contact your business administrator for assistance.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Free users can access the assistant but with limited features
  if (profile?.account_type === 'free' as any) {
    return (
      <Card className="shadow-lg border-2 border-wakti-blue/10">
        <CardContent className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="h-16 w-16 rounded-full bg-wakti-blue/10 flex items-center justify-center mb-4">
            <img 
              src="/lovable-uploads/9b7d0693-89eb-4cc5-b90b-7834bfabda0e.png" 
              alt="WAKTI AI" 
              className="h-8 w-8"
            />
          </div>
          <h2 className="text-xl font-semibold mb-2">Upgrade to Access WAKTI AI</h2>
          <p className="text-muted-foreground max-w-md mb-6">
            The WAKTI AI Assistant is available for Individual and Business accounts. Upgrade your account to access this powerful tool.
          </p>
          <Button>Upgrade Now</Button>
        </CardContent>
      </Card>
    );
  }

  const handleModeChange = (newMode: WAKTIAIMode) => {
    setActiveMode(newMode);
  };
  
  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear this chat history?")) {
      clearMessages();
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <Tabs 
        defaultValue="chat" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex justify-between items-center mb-2">
          <TabsList className="grid grid-cols-2 md:w-64">
            <TabsTrigger value="chat" className="flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4" /> Chat
            </TabsTrigger>
            {showMeetingTool && (
              <TabsTrigger value="tools" className="flex items-center gap-1.5">
                <Wrench className="h-4 w-4" /> Tools
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        <TabsContent value="chat" className="mt-0">
          <Card className={`overflow-hidden transition-all duration-300 shadow-lg ${WAKTIAIModes[activeMode].glowEffect}`}>
            <div className="border-b">
              <AIModeSwitcher 
                activeMode={activeMode} 
                setActiveMode={handleModeChange} 
              />
            </div>
            
            <AIAssistantChatWindow 
              activeMode={activeMode} 
              onClearChat={handleClearChat}
            />
            
            <div className="border-t">
              <AIAssistantToolbar 
                activeMode={activeMode} 
              />
            </div>
          </Card>
        </TabsContent>

        {showMeetingTool && (
          <TabsContent value="tools" className="mt-0">
            <Card className="shadow-lg border border-purple-200 overflow-hidden transition-all duration-300">
              <CardContent className="p-0">
                <MeetingSummaryTool 
                  onUseSummary={(summary) => {
                    // Switch back to chat tab when summary is used
                    setActiveTab('chat');
                  }} 
                />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default WAKTIAIAssistant;
