
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useGlobalChat } from '@/hooks/useGlobalChat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ChatHeader } from './ChatHeader';
import { ModeSwitcher } from './ModeSwitcher';
import { AIPersonalityProvider, useAIPersonality } from '@/components/ai/personality-switcher/AIPersonalityContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { cn } from '@/lib/utils';
import FreeAccountBanner from '@/components/dashboard/FreeAccountBanner';

export const UnifiedChatInterface: React.FC = () => {
  const { messages, sendMessage, isLoading, clearMessages, canUseAI } = useGlobalChat();
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentMode, currentPersonality } = useAIPersonality();
  
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
  
  // Get background style based on current mode
  const getBackgroundStyle = () => {
    switch (currentMode) {
      case 'general':
        return 'bg-gradient-to-b from-blue-50/80 via-blue-100/80 to-blue-200/80';
      case 'student':
        return 'bg-gradient-to-b from-green-50/80 via-green-100/80 to-green-200/80';
      case 'productivity':
        return 'bg-gradient-to-b from-yellow-50/80 via-orange-100/80 to-yellow-200/80';
      case 'creative':
        return 'bg-gradient-to-b from-purple-50/80 via-pink-100/80 to-purple-200/80';
      default:
        return 'bg-gradient-to-b from-blue-50/80 via-blue-100/80 to-blue-200/80';
    }
  };
  
  // Welcome message if no messages
  const renderWelcomeView = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center text-center px-2 sm:px-4 py-6 sm:py-10 space-y-4"
      >
        <div className={`h-14 w-14 rounded-full ${currentPersonality.color} flex items-center justify-center shadow-lg`}>
          <Bot className="h-7 w-7 text-white" />
        </div>
        
        <h2 className="text-lg sm:text-xl font-bold">{currentPersonality.welcomeMessage}</h2>
        
        <div className="grid grid-cols-1 gap-2 max-w-md w-full pt-4 px-2">
          {currentPersonality.suggestedPrompts.map((prompt, index) => (
            <Button
              key={index}
              variant="outline"
              className="text-sm h-auto py-2 justify-start text-left hover:bg-background/80"
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
    <motion.div 
      className={cn(
        "min-h-[90vh] flex flex-col px-2 sm:px-4 pb-6 pt-2 transition-colors duration-500 backdrop-blur-sm",
        getBackgroundStyle()
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      layout
    >
      {!canUseAI && <FreeAccountBanner />}
      
      <div className="mb-4 flex justify-center">
        <ModeSwitcher />
      </div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative w-full mx-auto mb-8"
        layout
      >
        <Card className="overflow-hidden backdrop-blur-lg bg-white/60 dark:bg-slate-800/60 border border-white/30 dark:border-slate-700/30 shadow-xl rounded-xl p-3 sm:p-6 max-w-3xl mx-auto mt-4 sm:mt-10">
          <ChatHeader 
            onClearChat={handleClearChat} 
            hasMessages={messages.length > 0} 
          />
          
          {!canUseAI && (
            <Alert variant="destructive" className="m-2 sm:m-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Access Restricted</AlertTitle>
              <AlertDescription>
                AI Assistant is only available for Business and Individual accounts.
              </AlertDescription>
            </Alert>
          )}
          
          <ScrollArea className="h-[400px] sm:h-[500px] glassmorphism-content">
            <CardContent className="p-2 sm:p-4 space-y-3 sm:space-y-4">
              {messages.length === 0 ? (
                renderWelcomeView()
              ) : (
                <AnimatePresence initial={false}>
                  {messages.map(message => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChatMessage message={message} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 opacity-70"
                >
                  <div className="h-8 w-8 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white animate-pulse" />
                  </div>
                  <div className="bg-background/70 backdrop-blur-sm border rounded-lg p-3 max-w-[85%]">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </motion.div>
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
      </motion.div>
      
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
    </motion.div>
  );
};

export const UnifiedChatInterfaceWithProvider: React.FC = () => (
  <AIPersonalityProvider>
    <UnifiedChatInterface />
  </AIPersonalityProvider>
);
