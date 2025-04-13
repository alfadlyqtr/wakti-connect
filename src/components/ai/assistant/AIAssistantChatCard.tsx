
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AIAssistantChat } from './AIAssistantChat';
import { MessageInputForm } from './MessageInputForm';
import { EmptyStateView } from './EmptyStateView';
import { PoweredByTMW } from './PoweredByTMW';
import { AIRoleSelector } from './AIRoleSelector';
import { Bot, Trash2 } from 'lucide-react';
import { AIMessage, AIAssistantRole } from '@/types/ai-assistant.types';
import { getTimeBasedGreeting } from '@/lib/dateUtils';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useVoiceInteraction } from '@/hooks/ai/useVoiceInteraction';

interface AIAssistantChatCardProps {
  messages: AIMessage[];
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  canAccess: boolean;
  clearMessages: () => void;
  selectedRole: AIAssistantRole;
  onRoleChange: (role: AIAssistantRole) => void;
  userName?: string;
}

export const AIAssistantChatCard: React.FC<AIAssistantChatCardProps> = ({
  messages,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  isLoading,
  canAccess,
  clearMessages,
  selectedRole,
  onRoleChange,
  userName = ''
}) => {
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const isMobile = useIsMobile();
  
  const {
    isListening,
    transcript,
    supportsVoice,
    startListening,
    stopListening
  } = useVoiceInteraction({
    onTranscriptComplete: (text) => {
      if (text) {
        setInputMessage((prev) => {
          const updatedText = prev + (prev && !prev.endsWith(' ') && !text.startsWith(' ') ? ' ' : '') + text;
          return updatedText;
        });
      }
    }
  });
  
  // Set greeting based on the time of day and selected role
  const greeting = getTimeBasedGreeting();
  const roleLabels: Record<AIAssistantRole, string> = {
    general: 'AI Assistant',
    student: 'Student Assistant',
    business_owner: 'Business Advisor',
    creative: 'Creative Assistant',
    employee: 'Work Assistant',
    personal: 'Personal Assistant'
  };
  
  const getHeaderTitle = () => {
    const baseTitle = userName ? `${greeting}, ${userName}` : greeting;
    return (
      <div className="flex items-center gap-2">
        <Bot className="h-5 w-5 text-primary" />
        <span>{baseTitle}</span>
        <Badge variant="outline" className="ml-2 text-xs font-normal">
          {roleLabels[selectedRole]}
        </Badge>
      </div>
    );
  };

  const handlePromptClick = (prompt: string) => {
    setInputMessage(prompt);
  };
  
  return (
    <Card className="relative h-full overflow-hidden border-wakti-blue/10 shadow-md rounded-xl flex flex-col">
      <CardHeader className={`py-3 px-4 flex-row justify-between gap-4 items-center border-b bg-gradient-to-r from-white to-gray-50 ${isMobile ? 'flex' : 'flex'}`}>
        {getHeaderTitle()}
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowRoleSelector(!showRoleSelector)}
            className="h-8 w-8 rounded-full"
            title="Change assistant type"
          >
            <Bot className="h-4 w-4" />
          </Button>
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearMessages}
              className="h-8 w-8 rounded-full"
              title="Clear conversation"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      {showRoleSelector && (
        <div className="absolute top-14 right-3 z-10 bg-white shadow-lg rounded-lg p-3 border border-gray-200 max-w-xs w-full">
          <AIRoleSelector
            selectedRole={selectedRole}
            onRoleChange={(role) => {
              onRoleChange(role);
              setShowRoleSelector(false);
            }}
          />
        </div>
      )}
      
      <CardContent className="p-0 flex-grow flex flex-col min-h-0 overflow-hidden">
        <div className="flex-grow overflow-y-auto">
          {messages.length === 0 ? (
            <EmptyStateView 
              selectedRole={selectedRole} 
              onPromptClick={handlePromptClick}
            />
          ) : (
            <AIAssistantChat 
              messages={messages} 
              isLoading={isLoading}
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              handleSendMessage={handleSendMessage}
              canAccess={canAccess}
              selectedRole={selectedRole}
            />
          )}
        </div>
        
        <MessageInputForm
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
          isLoading={isLoading}
          canAccess={canAccess}
          onStartVoiceInput={startListening}
          onStopVoiceInput={stopListening}
          isListening={isListening}
        />
        
        <PoweredByTMW />
      </CardContent>
    </Card>
  );
};
