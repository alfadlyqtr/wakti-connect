
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGlobalChat } from '@/hooks/useGlobalChat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ChatHeader } from './ChatHeader';
import { ModeSwitcher } from './ModeSwitcher';
import { AIPersonalityProvider } from '@/components/ai/personality-switcher/AIPersonalityContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { useAIPersonality } from '@/components/ai/personality-switcher/AIPersonalityContext';

export const UnifiedChatInterface: React.FC = () => {
  const { messages, sendMessage, isLoading, clearMessages, canUseAI } = useGlobalChat();
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentPersonality } = useAIPersonality();
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);
  
  const handleClearChat = () => {
    setShowClearConfirmation(true);
  };
  
  const handleConfirmClear = () => {
    clearMessages();
    setShowClearConfirmation(false);
  };
  
  // Welcome message if no messages
  const renderWelcomeView = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center text-center px-4 py-10 space-y-4"
      >
        <div className={`h-16 w-16 rounded-full ${currentPersonality.color} flex items-center justify-center shadow-lg`}>
          <Bot className="h-8 w-8 text-white" />
        </div>
        
        <h2 className="text-xl font-bold">{currentPersonality.welcomeMessage}</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md w-full pt-4">
          {currentPersonality.suggestedPrompts.map((prompt, index) => (
            <Button
              key={index}
              variant="outline"
              className="text-sm h-auto py-2 justify-start text-left"
              onClick={() => sendMessage(prompt)}
            >
              {prompt}
            </Button>
          ))}
        </div>
      </motion.div>
    );
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 pb-6">
      <div className="mb-4 flex justify-center">
        <ModeSwitcher />
      </div>
      
      <Card className={`overflow-hidden shadow-lg border border-muted rounded-xl backdrop-blur-md bg-white/80 dark:bg-slate-900/80 ${
        currentPersonality.bgGradient
      }`}>
        <ChatHeader 
          onClearChat={handleClearChat} 
          hasMessages={messages.length > 0} 
        />
        
        {!canUseAI && (
          <Alert variant="destructive" className="m-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Access Restricted</AlertTitle>
            <AlertDescription>
              AI Assistant is only available for Business and Individual accounts.
            </AlertDescription>
          </Alert>
        )}
        
        <ScrollArea className="h-[500px]">
          <CardContent className="p-4 space-y-4">
            {messages.length === 0 ? (
              renderWelcomeView()
            ) : (
              messages.map(message => (
                <ChatMessage key={message.id} message={message} />
              ))
            )}
            
            {isLoading && (
              <div className="flex items-start gap-3 opacity-70">
                <div className={`h-8 w-8 rounded-full ${currentPersonality.color} flex items-center justify-center`}>
                  <Bot className="h-4 w-4 text-white animate-pulse" />
                </div>
                <div className="bg-card border rounded-lg p-3 max-w-[85%]">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </CardContent>
        </ScrollArea>
        
        <ChatInput 
          onSendMessage={sendMessage} 
          isLoading={isLoading} 
          isDisabled={!canUseAI} 
        />
      </Card>
      
      <ConfirmationModal
        open={showClearConfirmation}
        onOpenChange={setShowClearConfirmation}
        title="Clear Chat History"
        description="Are you sure you want to clear all messages? This action cannot be undone."
        onConfirm={handleConfirmClear}
        confirmLabel="Clear"
        cancelLabel="Cancel"
        isDestructive={true}
      />
    </div>
  );
};

export const UnifiedChatInterfaceWithProvider: React.FC = () => (
  <AIPersonalityProvider>
    <UnifiedChatInterface />
  </AIPersonalityProvider>
);
