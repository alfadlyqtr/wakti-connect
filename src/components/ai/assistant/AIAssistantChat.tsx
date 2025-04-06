
import React, { useState, useEffect } from 'react';
import { AIMessage, AIAssistantRole, RoleContexts } from '@/types/ai-assistant.types';
import { AIAssistantMessage } from '../message/AIAssistantMessage';
import { Loader2 } from 'lucide-react';
import { getTimeBasedGreeting } from '@/lib/dateUtils';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  
  // State to track which message is currently being "spoken"
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  
  // Determine if it's the first message (welcome message)
  const isFirstMessage = messages.length <= 1;
  
  // Get welcome message with time-based greeting
  const getWelcomeMessage = () => {
    const roleContext = RoleContexts[selectedRole];
    // Check if welcomeMessage exists, otherwise use a default message
    const baseMessage = roleContext.welcomeMessage || 
      t("ai.defaultWelcome", {
        defaultValue: `Hello! I'm your ${roleContext.title}. I can help with a variety of tasks. How can I assist you today?`
      });
    
    const timeGreeting = getTimeBasedGreeting();
    
    // Check if the welcomeMessage has a comma or exclamation to split it
    if (baseMessage.includes(',') || baseMessage.includes('!')) {
      // Extract just the greeting part (before the first comma or exclamation)
      const firstPart = baseMessage.split(/[,!]/)[0];
      const restOfMessage = baseMessage.substring(firstPart.length);
      
      // Replace the initial greeting with a time-based one
      return `${timeGreeting}${restOfMessage}`;
    }
    
    // If no specific pattern, just return with time greeting
    return `${timeGreeting}! ${baseMessage}`;
  };
  
  // Effect to simulate "speaking" animation for the latest assistant message
  useEffect(() => {
    if (messages.length === 0) return;
    
    // Find the latest assistant message
    const latestAssistantMessage = [...messages]
      .reverse()
      .find(msg => msg.role === 'assistant');
    
    if (latestAssistantMessage) {
      // Set this message as the speaking message
      setSpeakingMessageId(latestAssistantMessage.id);
      
      // Simulate speaking time based on message length (1 second per 20 characters)
      const speakingTime = Math.min(
        Math.max(latestAssistantMessage.content.length / 20, 3), 
        10
      ) * 1000;
      
      // Clear the speaking state after the calculated time
      const timer = setTimeout(() => {
        setSpeakingMessageId(null);
      }, speakingTime);
      
      return () => clearTimeout(timer);
    }
  }, [messages]);
  
  // If there are no messages (besides welcome), show role context welcome message
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
            <p className="text-sm text-muted-foreground">{t("ai.thinking")}</p>
          </div>
        </div>
      )}
    </div>
  );
};
