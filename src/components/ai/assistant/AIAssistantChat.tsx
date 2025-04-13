import React, { useState, useEffect } from 'react';
import { AIMessage, AIAssistantRole, RoleContexts } from '@/types/ai-assistant.types';
import { AIAssistantMessage } from '../message/AIAssistantMessage';
import { Loader2 } from 'lucide-react';
import { getTimeBasedGreeting } from '@/lib/dateUtils';
import { UI_LOCKED } from '@/constants/system';

export interface AIAssistantChatProps {
  messages: AIMessage[];
  isLoading: boolean;
  inputMessage: string;
  setInputMessage: (value: string) => void;
  handleSendMessage: (e: React.FormEvent) => Promise<void>;
  canAccess: boolean;
  selectedRole: AIAssistantRole;
}

export const AIAssistantChat: React.FC<AIAssistantChatProps> = ({ 
  messages, 
  isLoading,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  canAccess,
  selectedRole
}) => {
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  
  const isFirstMessage = messages.length <= 1;
  
  const getWelcomeMessage = () => {
    const roleContext = RoleContexts[selectedRole];
    const baseMessage = roleContext.welcomeMessage || 
      `Hello! I'm your ${roleContext.title}. I can help with a variety of tasks. How can I assist you today?`;
    
    const timeGreeting = getTimeBasedGreeting();
    
    if (baseMessage.includes(',') || baseMessage.includes('!')) {
      const firstPart = baseMessage.split(/[,!]/)[0];
      const restOfMessage = baseMessage.substring(firstPart.length);
      
      return `${timeGreeting}${restOfMessage}`;
    }
    
    return `${timeGreeting}! ${baseMessage}`;
  };
  
  useEffect(() => {
    if (messages.length === 0) return;
    
    const latestAssistantMessage = [...messages]
      .reverse()
      .find(msg => msg.role === 'assistant');
    
    if (latestAssistantMessage) {
      setSpeakingMessageId(latestAssistantMessage.id);
      
      const speakingTime = Math.min(
        Math.max(latestAssistantMessage.content.length / 20, 3), 
        10
      ) * 1000;
      
      const timer = setTimeout(() => {
        setSpeakingMessageId(null);
      }, speakingTime);
      
      return () => clearTimeout(timer);
    }
  }, [messages]);
  
  if (isFirstMessage) {
    const welcomeMessage: AIMessage = {
      id: "role-welcome",
      role: "assistant",
      content: getWelcomeMessage(),
      timestamp: new Date(),
    };
    
    return (
      <div className="space-y-8 w-full flex flex-col">
        <AIAssistantMessage 
          message={welcomeMessage} 
          isActive={true}
          isSpeaking={speakingMessageId === "role-welcome"}
        />
      </div>
    );
  }
  
  return (
    <div className="space-y-4 w-full flex flex-col">
      {messages.map((message) => (
        <AIAssistantMessage 
          key={message.id} 
          message={message} 
          isActive={message.role === 'assistant'}
          isSpeaking={message.id === speakingMessageId}
        />
      ))}
      
      {isLoading && (
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-full bg-wakti-blue flex items-center justify-center flex-shrink-0">
            <Loader2 className="h-5 w-5 text-white animate-spin" />
          </div>
          <div className="p-3 bg-muted rounded-lg max-w-[80%]">
            <p className="text-sm text-muted-foreground">Thinking...</p>
          </div>
        </div>
      )}
    </div>
  );
};
