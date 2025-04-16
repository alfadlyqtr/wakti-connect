
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
        return 'bg-gradient-to-br from-blue-900/10 to-indigo-900/5 styled-scrollbar';
      case 'student':
        return 'bg-gradient-to-br from-green-900/10 to-emerald-900/5 styled-scrollbar';
      case 'productivity':
        return 'bg-gradient-to-br from-purple-900/10 to-violet-900/5 styled-scrollbar';
      case 'creative':
        return 'bg-gradient-to-br from-fuchsia-900/10 to-pink-900/5 styled-scrollbar';
      default:
        return 'bg-gradient-to-br from-blue-900/10 to-indigo-900/5 styled-scrollbar';
    }
  };
  
  // Welcome message if no messages
  const renderWelcomeView = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center text-center px-2 sm:px-6 py-10 sm:py-14 space-y-4"
      >
        <div className={`h-16 w-16 rounded-full ${currentPersonality.color} flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.1)_inset]`}>
          <Bot className="h-8 w-8 text-white" />
        </div>
        
        <h2 className="text-xl sm:text-2xl font-bold">{currentPersonality.welcomeMessage}</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full pt-6 px-4">
          {currentPersonality.suggestedPrompts.map((prompt, index) => (
            <Button
              key={index}
              variant="outline"
              className="text-sm h-auto py-3 justify-start text-left glass-panel transform hover:scale-105 transition-transform duration-200 shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.08)_inset]"
              onClick={() => sendMessage(prompt)}
              style={{
                backdropFilter: 'blur(16px)',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
              }}
            >
              {prompt}
            </Button>
          ))}
        </div>
      </motion.div>
    );
  };
  
  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="p-4 border-b border-white/10 backdrop-blur-lg bg-black/20">
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
        <ScrollArea className={cn("h-[65vh] min-h-[550px] px-3 sm:px-6 py-4", getModeBackgroundClass())}>
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
                    <div className={`h-10 w-10 rounded-full ${currentPersonality.color} flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.6)]`}>
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="bg-black/20 dark:bg-slate-800/20 border border-white/10 dark:border-slate-700/10 rounded-2xl p-4 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.5)]">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 rounded-full bg-blue-400/70 animate-bounce"></div>
                      <div className="h-2 w-2 rounded-full bg-blue-400/70 animate-bounce [animation-delay:0.2s]"></div>
                      <div className="h-2 w-2 rounded-full bg-blue-400/70 animate-bounce [animation-delay:0.4s]"></div>
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
