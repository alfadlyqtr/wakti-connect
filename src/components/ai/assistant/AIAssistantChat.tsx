
import React, { useEffect, useRef } from 'react';
import { AIMessage } from '@/types/ai-assistant.types';
import { AIAssistantMessage } from '../message/AIAssistantMessage';
import { Loader2 } from 'lucide-react';

export interface AIAssistantChatProps {
  messages: AIMessage[];
  isLoading: boolean;
  inputMessage: string;
  setInputMessage: (value: string) => void;
  handleSendMessage: (e: React.FormEvent) => Promise<void>;
  canAccess: boolean;
}

export const AIAssistantChat: React.FC<AIAssistantChatProps> = ({ 
  messages, 
  isLoading,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  canAccess 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="space-y-6 w-full overflow-hidden">
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
      
      <div ref={messagesEndRef} />
    </div>
  );
};
