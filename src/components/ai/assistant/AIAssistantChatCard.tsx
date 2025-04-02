
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Bot, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AIMessage } from '@/types/ai-assistant.types';
import { AIAssistantChat } from './AIAssistantChat';
import { MessageInputForm } from './MessageInputForm';
import { EmptyStateView } from './EmptyStateView';
import { PoweredByTMW } from './PoweredByTMW';

interface AIAssistantChatCardProps {
  messages: AIMessage[];
  inputMessage: string;
  setInputMessage: (value: string) => void;
  handleSendMessage: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  canAccess: boolean;
  clearMessages: () => void;
}

export const AIAssistantChatCard: React.FC<AIAssistantChatCardProps> = ({
  messages,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  isLoading,
  canAccess,
  clearMessages
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  
  // Always use WAKTI AI as the assistant name regardless of settings
  const assistantName = "WAKTI AI";

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handlePromptClick = (prompt: string) => {
    setInputMessage(prompt);
    setShowSuggestions(false);
  };

  return (
    <Card className="w-full h-[calc(80vh)] flex flex-col shadow-md border-wakti-blue/10">
      <CardHeader className="py-2 px-3 sm:py-3 sm:px-4 border-b flex-row justify-between items-center bg-gradient-to-r from-wakti-blue/5 to-transparent">
        <div className="flex items-center">
          <div className="w-6 h-6 rounded-full bg-wakti-blue/10 flex items-center justify-center mr-2">
            <Bot className="w-3.5 h-3.5 text-wakti-blue" />
          </div>
          <h3 className="font-medium text-sm md:text-base">{assistantName}</h3>
        </div>
        <div className="flex gap-2">
          {messages.length > 0 && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={clearMessages}
              className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-red-50 hover:text-red-500 transition-colors"
              aria-label="Clear chat"
              title="Clear chat"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          {messages.length === 0 && showSuggestions ? (
            <EmptyStateView onPromptClick={handlePromptClick} />
          ) : (
            <AIAssistantChat 
              messages={messages} 
              isLoading={isLoading}
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              handleSendMessage={handleSendMessage}
              canAccess={canAccess}
            />
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <MessageInputForm
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
          isLoading={isLoading}
          canAccess={canAccess}
        />
        
        <PoweredByTMW />
      </CardContent>
    </Card>
  );
};
