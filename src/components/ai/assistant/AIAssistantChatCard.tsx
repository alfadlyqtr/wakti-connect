
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, Bot, SendHorizontal, Trash2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { AIMessage } from '@/types/ai-assistant.types';
import { AIAssistantChat } from './AIAssistantChat';
import { SuggestionPrompts } from './SuggestionPrompts';
import { useAISettings } from '@/components/settings/ai/context/AISettingsContext';

interface AIAssistantChatCardProps {
  messages: AIMessage[];
  inputMessage: string;
  setInputMessage: (value: string) => void;
  handleSendMessage: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  canAccess: boolean;
  clearMessages: () => void;
}

// Interface for SuggestionPrompts
interface SuggestionPromptsProps {
  onPromptClick: (prompt: string) => void;
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
  const isMobile = useIsMobile();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  
  const { settings } = useAISettings();
  const assistantName = settings?.assistant_name || "WAKTI AI";

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    // Focus input when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handlePromptClick = (prompt: string) => {
    setInputMessage(prompt);
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <Card className="w-full h-[calc(80vh)] flex flex-col">
      <CardHeader className="py-3 px-4 border-b flex-row justify-between items-center">
        <div className="flex items-center">
          <Bot className="w-5 h-5 mr-2 text-wakti-blue" />
          <h3 className="font-medium text-sm md:text-base">Chat with {assistantName}</h3>
        </div>
        {messages.length > 0 && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={clearMessages}
            className="h-8 w-8"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Clear chat</span>
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col">
        <ScrollArea className="flex-1 p-4 pb-0">
          {messages.length === 0 && showSuggestions ? (
            <div className="h-full flex flex-col">
              <div className="text-center my-8">
                <Bot className="w-12 h-12 mx-auto text-wakti-blue opacity-80" />
                <h3 className="mt-4 text-lg font-medium">
                  How can I help you today?
                </h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                  Ask me anything about tasks, scheduling, or your business. I'm here to make your workflow easier.
                </p>
              </div>
              
              <SuggestionPrompts onPromptClick={handlePromptClick} />
            </div>
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
          
          {!canAccess && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800">Upgrade Your Plan</h4>
                <p className="text-sm text-amber-700 mt-1">
                  You've reached the limit for the free plan. Upgrade to continue using the AI assistant.
                </p>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </ScrollArea>
        
        <form onSubmit={handleSendMessage} className="p-4 pt-2 mt-auto">
          <div className="relative">
            <Input 
              placeholder={isLoading ? "Thinking..." : "Type your message..."}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isLoading || !canAccess}
              className="pr-10"
              ref={inputRef}
            />
            <Button 
              size="icon" 
              type="submit" 
              disabled={isLoading || !inputMessage.trim() || !canAccess}
              className="absolute right-0 top-0 bottom-0 rounded-l-none"
            >
              <SendHorizontal className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
