
import React from 'react';
import { AIMessage, AIAssistantRole, RoleContexts } from '@/types/ai-assistant.types';
import { AIAssistantMessage } from '../message/AIAssistantMessage';
import { Loader2 } from 'lucide-react';
import { getTimeBasedGreeting } from '@/lib/dateUtils';

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
  // Determine if it's the first message (welcome message)
  const isFirstMessage = messages.length <= 1;
  
  // Get welcome message with time-based greeting
  const getWelcomeMessage = () => {
    const roleContext = RoleContexts[selectedRole];
    // Check if welcomeMessage exists, otherwise use a default message
    const baseMessage = roleContext.welcomeMessage || 
      `Hello! I'm your ${roleContext.title}. I can help with a variety of tasks. How can I assist you today?`;
    
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
  
  // If there are no messages (besides welcome), show role context welcome message
  if (isFirstMessage) {
    const welcomeMessage: AIMessage = {
      id: "role-welcome",
      role: "assistant",
      content: getWelcomeMessage(),
      timestamp: new Date(),
    };
    
    return (
      <div className="space-y-4 w-full flex flex-col">
        <AIAssistantMessage message={welcomeMessage} />
        
        {/* We've moved quick tools out as requested */}
      </div>
    );
  }
  
  return (
    <div className="space-y-4 w-full flex flex-col">
      {messages.map((message) => (
        <AIAssistantMessage key={message.id} message={message} />
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
