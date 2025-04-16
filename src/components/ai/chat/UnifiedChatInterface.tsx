
import React, { useState, useEffect } from 'react';
import { ChatInput } from './ChatInput';
import { AIMessage } from '@/types/ai-assistant.types';
import { ChatMessages } from './ChatMessages';
import { useAIChatEnhanced } from '@/hooks/ai/chat';
import { useAIPersonality } from '../personality-switcher/AIPersonalityContext'; 
import { AIPersonalitySwitcher } from '../personality-switcher/AIPersonalitySwitcher';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { InfoCircle } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { EnhancedAlertDialog } from '@/components/ui/enhanced-alert-dialog';

export const UnifiedChatInterface = () => {
  const { 
    messages, 
    sendMessage, 
    isLoading, 
    clearMessages,
    handleConfirmClear,
    showClearConfirmation,
    setShowClearConfirmation,
  } = useAIChatEnhanced();
  const [inputMessage, setInputMessage] = useState('');
  const [showSubscribeAlert, setShowSubscribeAlert] = useState(false);
  const { currentMode, currentPersonality } = useAIPersonality();
  
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    try {
      await sendMessage(inputMessage);
      setInputMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  return (
    <div 
      className={cn(
        "flex flex-col h-[650px] md:h-[700px] glassmorphism overflow-hidden rounded-xl",
        "border border-white/5 transition-all duration-500"
      )}
    >
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-4 pb-0 md:p-6 md:pb-0">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-white/90">{currentPersonality.label}</h2>
              <p className="text-sm text-gray-300/80">{currentPersonality.description}</p>
            </div>
            <AIPersonalitySwitcher />
          </div>
          <Separator className="my-4 bg-white/5" />
        </div>
        
        <div className="flex-1 overflow-y-auto styled-scrollbar px-4 md:px-6 pb-4">
          <ChatMessages 
            messages={messages} 
            isLoading={isLoading}
          />
        </div>
        
        <ChatInput 
          onSendMessage={sendMessage} 
          isLoading={isLoading}
          onClearChat={clearMessages}
        />
        
        <EnhancedAlertDialog
          open={showClearConfirmation}
          onOpenChange={setShowClearConfirmation}
          title="Clear Chat History"
          description="Are you sure you want to clear all chat messages? This action cannot be undone."
          onConfirm={handleConfirmClear}
          confirmLabel="Clear Chat"
          cancelLabel="Cancel"
          variant="destructive"
          showCancel={true}
        />
      </div>
    </div>
  );
};

export const UnifiedChatInterfaceWithProvider = () => {
  return (
    <UnifiedChatInterface />
  );
};
