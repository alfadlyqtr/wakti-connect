
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
import { useIsMobile } from '@/hooks/useIsMobile';

export const UnifiedChatInterface: React.FC = () => {
  const { messages, sendMessage, isLoading, clearMessages, canUseAI } = useGlobalChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentMode, currentPersonality } = useAIPersonality();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);
  
  const getModeBackgroundClass = () => {
    switch (currentMode) {
      case 'general':
        return 'bg-gradient-to-br from-blue-900/5 to-indigo-900/5 styled-scrollbar bg-opacity-10 backdrop-blur-xl';
      case 'student':
        return 'bg-gradient-to-br from-green-900/5 to-emerald-900/5 styled-scrollbar bg-opacity-10 backdrop-blur-xl';
      case 'productivity':
        return 'bg-gradient-to-br from-purple-900/5 to-violet-900/5 styled-scrollbar bg-opacity-10 backdrop-blur-xl';
      case 'creative':
        return 'bg-gradient-to-br from-fuchsia-900/5 to-pink-900/5 styled-scrollbar bg-opacity-10 backdrop-blur-xl';
      default:
        return 'bg-gradient-to-br from-blue-900/5 to-indigo-900/5 styled-scrollbar bg-opacity-10 backdrop-blur-xl';
    }
  };
  
  const renderWelcomeView = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center text-center px-2 sm:px-6 py-8 sm:py-12 space-y-4 w-full"
      >
        <div className={`h-16 w-16 rounded-full ${currentPersonality.color} flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.1)_inset]`}>
          <Bot className="h-8 w-8 text-white" />
        </div>
        
        <h2 className="text-xl sm:text-2xl font-bold">{currentPersonality.welcomeMessage}</h2>
        
        <div className="flex flex-col gap-3 w-full max-w-md sm:max-w-lg px-2 sm:px-4 pt-4 sm:pt-6">
          {currentPersonality.suggestedPrompts.map((prompt, index) => (
            <Button
              key={index}
              variant="outline"
              className="text-sm h-auto py-3 px-4 justify-start text-left glass-panel transform hover:scale-105 transition-transform duration-200 shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.08)_inset] w-full break-words whitespace-normal text-ellipsis overflow-hidden"
              onClick={() => sendMessage(prompt)}
              style={{
                backdropFilter: 'blur(16px)',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                minHeight: '60px'
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
    <div 
      className="flex flex-col h-full bg-transparent w-full" 
      style={{ 
        background: 'transparent',
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(0,0,0,0.05)'
      }}
    >
      <div className="p-2 sm:p-4 border-b border-white/10 backdrop-blur-lg bg-black/20">
        <ModeSwitcher />
      </div>
      
      {!canUseAI && <FreeAccountBanner />}
      
      <div className="flex-1 overflow-hidden w-full">
        <ScrollArea 
          className={cn(
            "h-[60vh] sm:h-[65vh] min-h-[450px] sm:min-h-[550px] px-2 sm:px-4 md:px-6 py-4", 
            getModeBackgroundClass(),
            "bg-transparent"
          )}
          style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(12px)'
          }}
        >
          {messages.length === 0 ? renderWelcomeView() : (
            <div className="space-y-4 w-full">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full"
                  >
                    <ChatMessage message={message} />
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 mb-4 w-full"
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
        onClearChat={clearMessages}
      />
    </div>
  );
};

export const UnifiedChatInterfaceWithProvider: React.FC = () => (
  <AIPersonalityProvider>
    <UnifiedChatInterface />
  </AIPersonalityProvider>
);
