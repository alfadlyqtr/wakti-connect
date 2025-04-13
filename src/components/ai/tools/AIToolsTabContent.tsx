
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VoiceInteractionToolCard } from './VoiceInteractionToolCard';
import { QuickToolsCard } from './QuickToolsCard';
import { MeetingSummaryTool } from './MeetingSummaryTool';
import { KnowledgeProfileToolCard } from './KnowledgeProfileToolCard';
import { toast } from '@/components/ui/use-toast';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { AIAssistantRole } from '@/types/ai-assistant.types';

interface AIToolsTabContentProps {
  onSendMessage: (text: string) => void;
  selectedRole?: AIAssistantRole;
}

export function AIToolsTabContent({ onSendMessage, selectedRole = 'general' }: AIToolsTabContentProps) {
  const [activeTab, setActiveTab] = useState<string>('voice');
  const { aiSettings } = useAIAssistant();
  
  const handleSpeechRecognized = (text: string) => {
    if (text.trim()) {
      onSendMessage(text);
    } else {
      toast({
        title: "Empty text",
        description: "Please speak clearly to convert your voice to text",
        variant: "destructive"
      });
    }
  };
  
  const handleUseSummary = (prompt: string) => {
    if (prompt.trim()) {
      onSendMessage(prompt);
    }
  };
  
  const isBusinessUser = aiSettings?.role === 'business_owner';
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-4 mb-4">
        <TabsTrigger value="voice">Voice</TabsTrigger>
        <TabsTrigger value="tools">Quick Tools</TabsTrigger>
        <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
        <TabsTrigger value="meetings">Meetings</TabsTrigger>
      </TabsList>
      
      <TabsContent value="voice" className="m-0">
        <VoiceInteractionToolCard onSpeechRecognized={handleSpeechRecognized} />
      </TabsContent>
      
      <TabsContent value="tools" className="m-0">
        <QuickToolsCard selectedRole={selectedRole} onToolSelect={onSendMessage} />
      </TabsContent>
      
      <TabsContent value="knowledge" className="m-0">
        <KnowledgeProfileToolCard selectedRole={selectedRole} />
      </TabsContent>
      
      <TabsContent value="meetings" className="m-0">
        <MeetingSummaryTool onUseSummary={handleUseSummary} />
      </TabsContent>
    </Tabs>
  );
}
