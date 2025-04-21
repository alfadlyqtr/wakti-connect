
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
import { motion, AnimatePresence } from 'framer-motion';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/useIsMobile';
import { VoiceButton } from '../voice/VoiceButton';
import { useEnhancedVoiceInteraction } from '@/hooks/ai/useEnhancedVoiceInteraction';

export const UnifiedChatInterface: React.FC = () => {
  const { messages, sendMessage, isLoading, clearMessages } = useGlobalChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentMode, currentPersonality } = useAIPersonality();
  const isMobile = useIsMobile();

  const [userInput, setUserInput] = useState("");
  const {
    isListening,
    transcript,
    showVoiceInput,
    setShowVoiceInput,
    handleVoiceToggle,
    supportsVoice
  } = useEnhancedVoiceInteraction({
    setInputMessage: setUserInput,
  });

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
          <svg aria-hidden="true" focusable="false" className="h-8 w-8 text-white" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor" /></svg>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold">{currentPersonality.welcomeMessage}</h2>
        <div className="flex flex-col gap-3 w-full max-w-md sm:max-w-lg px-2 sm:px-4 pt-4 sm:pt-6">
          {currentPersonality.suggestedPrompts.map((prompt, index) => (
            <Button
              key={index}
              variant="outline"
              className="text-sm h-auto py-3 px-4 justify-start text-left glass-panel transform hover:scale-105 transition-transform duration-200 shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.08)_inset] w-full break-words whitespace-normal text-ellipsis overflow-hidden"
              onClick={() => {
                setUserInput(prompt);
                sendMessage(prompt);
              }}
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

  const renderMessages = () => {
    return (
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
              <ChatMessage message={message} mode={currentMode} />
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
                <svg aria-hidden="true" focusable="false" className="h-5 w-5 text-white" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor" /></svg>
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
          {messages.length === 0 ? renderWelcomeView() : renderMessages()}
          <div ref={messagesEndRef} />
        </ScrollArea>
      </div>

      <div className="flex gap-2 items-center px-2 sm:px-4 pb-4">
        {supportsVoice && (
          <VoiceButton
            isListening={isListening}
            isLoading={isLoading}
            isDisabled={isLoading}
            onToggle={handleVoiceToggle}
          />
        )}
        <div className="flex-1">
          <ChatInput 
            onSendMessage={(msg) => {
              setUserInput("");
              sendMessage(msg);
            }}
            isLoading={isLoading} 
            isDisabled={isLoading}
            value={userInput}
            onChange={setUserInput}
            onClearChat={clearMessages}
          />
          {showVoiceInput && isListening && (
            <div className="text-xs text-pink-600 animate-pulse mt-1">
              Listening... {transcript ? `"${transcript}"` : ""}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const UnifiedChatInterfaceWithProvider: React.FC = () => (
  <AIPersonalityProvider>
    <UnifiedChatInterface />
  </AIPersonalityProvider>
);
