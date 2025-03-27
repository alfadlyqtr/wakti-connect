
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Loader2, Mic, MicOff, SendHorizontal, Trash2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { AIMessage } from '@/types/ai-assistant.types';
import { AIAssistantChat } from './AIAssistantChat';
import { SuggestionPrompts } from './SuggestionPrompts';
import { useAISettings } from '@/components/settings/ai/context/AISettingsContext';
import { useVoiceInteraction } from '@/hooks/ai/useVoiceInteraction';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

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
  const isMobile = useIsMobile();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const { settings } = useAISettings();
  
  // Always use WAKTI AI as the assistant name regardless of settings
  const assistantName = "WAKTI AI";

  // Voice interaction hook
  const {
    isListening,
    supportsVoice,
    lastTranscript,
    isProcessing,
    startListening,
    stopListening,
    clearTranscript
  } = useVoiceInteraction();

  // Use the transcript when it changes
  useEffect(() => {
    if (lastTranscript) {
      setInputMessage(lastTranscript);
      clearTranscript();
      
      // Auto-submit if we have a clear transcript
      if (lastTranscript.length > 5 && canAccess && !isLoading) {
        const submitEvent = new Event('submit', { cancelable: true, bubbles: true }) as unknown as React.FormEvent;
        handleSendMessage(submitEvent);
      }
    }
  }, [lastTranscript, setInputMessage, clearTranscript, handleSendMessage, canAccess, isLoading]);

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

  // Handle voice input toggle
  const toggleVoiceInput = () => {
    if (!supportsVoice) {
      toast({
        title: "Voice Input",
        description: "You can also use your device's built-in speech recognition (e.g., Windows+H on Windows or the microphone on your keyboard).",
        variant: "default",
      });
      return;
    }
    
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <Card className="w-full h-[calc(80vh)] flex flex-col">
      <CardHeader className="py-3 px-4 border-b flex-row justify-between items-center">
        <div className="flex items-center">
          <Bot className="w-5 h-5 mr-2 text-wakti-blue" />
          <h3 className="font-medium text-sm md:text-base">Chat with {assistantName}</h3>
        </div>
        <div className="flex gap-2">
          {messages.length > 0 && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={clearMessages}
              className="h-8 w-8"
              aria-label="Clear chat"
              title="Clear chat"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
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
          
          <div ref={messagesEndRef} />
        </ScrollArea>
        
        <form onSubmit={handleSendMessage} className="p-4 pt-2 mt-auto">
          <div className="relative flex items-center gap-2">
            <Button
              type="button"
              size="icon"
              variant={isListening ? "default" : "ghost"}
              onClick={toggleVoiceInput}
              className={`size-10 flex-shrink-0 ${isListening ? 'bg-wakti-blue text-white' : ''}`}
              disabled={isLoading || !canAccess || isProcessing}
              aria-label={isListening ? "Stop listening" : "Start voice input"}
              title={isListening ? "Stop listening" : "Start voice input"}
            >
              {isListening ? (
                <MicOff className="h-5 w-5" />
              ) : isProcessing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </Button>
            
            <div className="relative flex-1">
              <Input 
                placeholder={
                  isListening ? "Listening..." : 
                  isProcessing ? "Processing..." :
                  isLoading ? "WAKTI AI is thinking..." : 
                  "Type your message..."
                }
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isLoading || !canAccess || isListening || isProcessing}
                className={cn(
                  "pr-10",
                  isListening ? "bg-blue-50" : "",
                  isProcessing ? "bg-yellow-50" : ""
                )}
                ref={inputRef}
              />
              {isLoading ? (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-wakti-blue rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="h-2 w-2 bg-wakti-blue rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="h-2 w-2 bg-wakti-blue rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              ) : (
                <Button 
                  size="icon" 
                  type="submit" 
                  disabled={isLoading || !inputMessage.trim() || !canAccess || isListening || isProcessing}
                  className="absolute right-0 top-0 bottom-0 rounded-l-none"
                >
                  <SendHorizontal className="h-4 w-4" />
                  <span className="sr-only">Send message</span>
                </Button>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
