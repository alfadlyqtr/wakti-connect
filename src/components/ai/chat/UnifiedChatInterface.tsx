
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
  
  // Get mode-specific background class
  const getModeBackgroundClass = () => {
    switch (currentMode) {
      case 'general':
        return 'bg-gradient-to-br from-blue-50/30 to-indigo-50/30';
      case 'student':
        return 'bg-gradient-to-br from-green-50/30 to-emerald-50/30';
      case 'productivity':
        return 'bg-gradient-to-br from-amber-50/30 to-yellow-50/30';
      case 'creative':
        return 'bg-gradient-to-br from-fuchsia-50/30 to-pink-50/30';
      default:
        return 'bg-gradient-to-br from-blue-50/30 to-indigo-50/30';
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
              className="text-sm h-auto py-2 justify-start text-left hover:bg-background/80 glassmorphism"
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
    <div className="flex flex-col h-full">
      <div className="p-3 sm:p-4 border-b border-white/10 backdrop-blur-md bg-white/5">
        <ModeSwitcher />
      </div>
      
      <ConfirmationModal
        open={showClearConfirmation}
        onOpenChange={setShowClearConfirmation}
        title="Clear Conversation"
        description="Are you sure you want to clear this conversation? This action cannot be undone."
        confirmLabel="Clear"
        cancelLabel="Cancel"
        onConfirm={handleConfirmClear}
        isDestructive={true}
      />
      
      {!canUseAI && <FreeAccountBanner />}
      
      <div className="flex-1 overflow-hidden">
        <ScrollArea className={cn("h-[60vh] min-h-[500px] px-2 sm:px-4 py-4", getModeBackgroundClass())}>
          {messages.length === 0 ? renderWelcomeView() : (
            <div className="space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <ChatMessage message={message} />
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 mb-4"
                >
                  <div className="flex-shrink-0">
                    <div className={`h-10 w-10 rounded-full ${currentPersonality.color} flex items-center justify-center`}>
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="bg-white/20 dark:bg-slate-800/20 border border-white/10 dark:border-slate-700/10 rounded-2xl p-4 backdrop-blur-md">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 rounded-full bg-muted-foreground/70 animate-bounce"></div>
                      <div className="h-2 w-2 rounded-full bg-muted-foreground/70 animate-bounce [animation-delay:0.2s]"></div>
                      <div className="h-2 w-2 rounded-full bg-muted-foreground/70 animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </ScrollArea>
      </div>
      
      <ChatInput 
        onSendMessage={sendMessage} 
        isLoading={isLoading} 
        isDisabled={!canUseAI} 
      />
    </div>
  );
};

export const UnifiedChatInterfaceWithProvider: React.FC = () => (
  <AIPersonalityProvider>
    <UnifiedChatInterface />
  </AIPersonalityProvider>
);
