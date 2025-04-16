
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAIPersonality } from '@/components/ai/personality-switcher/AIPersonalityContext';
import { InputToolbar } from '../input/InputToolbar';
import { useVoiceInteraction } from '@/hooks/ai/useVoiceInteraction';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { ChatInputField } from './ChatInputField';
import { ClearChatButton } from './ClearChatButton';
import { SendButton } from './SendButton';
import { VoiceButton } from './VoiceButton';
import { useIsMobile } from '@/hooks/useIsMobile';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
  isDisabled?: boolean;
  onClearChat?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  isLoading, 
  isDisabled = false,
  onClearChat
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);
  const { currentMode } = useAIPersonality();
  const isMobile = useIsMobile();
  
  const { 
    isListening: voiceIsListening,
    transcript, 
    startListening, 
    stopListening,
    supportsVoice
  } = useVoiceInteraction({
    onTranscriptComplete: (text) => {
      if (text) {
        setInputValue(prev => {
          const separator = prev && !prev.endsWith(' ') && !text.startsWith(' ') ? ' ' : '';
          return prev + separator + text;
        });
        setIsListening(false);
      }
    }
  });

  React.useEffect(() => {
    setIsListening(voiceIsListening);
  }, [voiceIsListening]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading || isDisabled) return;
    
    try {
      await onSendMessage(inputValue);
      setInputValue('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleClearChat = () => {
    setShowClearConfirmation(true);
  };

  const confirmClearChat = () => {
    if (onClearChat) {
      onClearChat();
    }
    setShowClearConfirmation(false);
  };
  
  return (
    <>
      <motion.form 
        onSubmit={handleSubmit} 
        className="relative flex flex-col gap-3 p-3 sm:p-4 md:p-5 border-t border-white/10 bg-transparent backdrop-blur-xl w-full max-w-[98%] mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        style={{
          boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div className="flex flex-col gap-2 w-full">
          <div className="relative w-full">
            <ChatInputField
              value={inputValue}
              onChange={setInputValue}
              onKeyDown={handleKeyDown}
              isLoading={isLoading}
              isDisabled={isDisabled}
              isListening={isListening}
            />
          </div>
          
          <div className="flex justify-between items-center w-full mt-1">
            <div className="flex-1 max-w-[65%]">
              <InputToolbar 
                isLoading={isLoading} 
                isListening={isListening}
                onVoiceToggle={handleVoiceToggle}
              />
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              {onClearChat && (
                <ClearChatButton
                  isDisabled={isDisabled}
                  onClick={handleClearChat}
                />
              )}
              
              <SendButton
                isLoading={isLoading}
                isDisabled={isDisabled}
                isActive={!!inputValue.trim()}
              />
            </div>
          </div>
        </div>
      </motion.form>

      <ConfirmationModal
        title="Clear Chat"
        description="Are you sure you want to clear all messages? This action cannot be undone."
        open={showClearConfirmation}
        onOpenChange={setShowClearConfirmation}
        onConfirm={confirmClearChat}
        confirmLabel="Yes, Clear"
        cancelLabel="No, Keep"
        isDestructive={true}
      />
    </>
  );
};
