
import React, { useState, useEffect } from 'react';
import { AIAssistantChatWindow } from './AIAssistantChatWindow';
import { ChatInput } from './ChatInput';
import { AIPersonalitySwitcher } from '../personality-switcher/AIPersonalitySwitcher';
import { AIAssistantDocumentsCard } from '../AIAssistantDocumentsCard';
import { AIAssistantHistoryCard } from '../AIAssistantHistoryCard';
import { useGlobalChat } from '@/hooks/useGlobalChat';
import { AIPersonalityProvider } from '../personality-switcher/AIPersonalityContext';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/useIsMobile';
import { WAKTIAIMode } from '@/types/ai-assistant.types';

export const UnifiedChatInterface: React.FC = () => {
  const { messages, sendMessage, isLoading, clearMessages, canUseAI } = useGlobalChat();
  const [currentMode, setCurrentMode] = useState<WAKTIAIMode>('general');
  const isMobile = useIsMobile();
  const [chatInputValue, setChatInputValue] = useState('');

  // Handle sending messages
  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;
    await sendMessage(message);
    setChatInputValue('');
  };

  // Handle switching personalities
  const handleSwitchMode = (newMode: WAKTIAIMode) => {
    setCurrentMode(newMode);
  };
  
  // Handle clearing chat
  const handleClearChat = () => {
    clearMessages();
  };
  
  // Function to handle using document content
  const handleUseDocumentContent = (content: string) => {
    setChatInputValue(prev => {
      if (prev && !prev.endsWith(' ')) return prev + ' ' + content;
      return prev + content;
    });
  };

  return (
    <div className="flex flex-col h-[75vh] md:h-[80vh] relative overflow-hidden bg-black/20">
      {/* Personality switcher header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="w-full flex justify-center">
          <AIPersonalitySwitcher 
            activeMode={currentMode}
            onSelectMode={handleSwitchMode}
          />
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Main chat area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <AIAssistantChatWindow 
            activeMode={currentMode}
            onClearChat={handleClearChat}
          />
          
          <div className="mt-auto">
            <ChatInput 
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              isDisabled={!canUseAI}
              onClearChat={handleClearChat}
            />
          </div>
        </div>
        
        {/* Sidebar features (only on larger screens) */}
        {!isMobile && (
          <div className="w-64 lg:w-72 hidden md:flex flex-col border-l border-white/10 bg-black/30 p-3 overflow-y-auto">
            <AIAssistantDocumentsCard 
              canAccess={canUseAI}
              onUseDocumentContent={handleUseDocumentContent}
              selectedRole={currentMode}
            />
            
            <Separator className="my-4 bg-white/10" />
            
            <AIAssistantHistoryCard 
              canAccess={canUseAI}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Export with provider for easy use
export const UnifiedChatInterfaceWithProvider: React.FC = () => (
  <AIPersonalityProvider>
    <UnifiedChatInterface />
  </AIPersonalityProvider>
);
