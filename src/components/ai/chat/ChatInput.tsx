
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Trash2 } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAIPersonality } from '@/components/ai/personality-switcher/AIPersonalityContext';
import { motion } from 'framer-motion';
import { InputToolbar } from '../input/InputToolbar';
import { useVoiceInteraction } from '@/hooks/ai/useVoiceInteraction';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';

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
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { currentMode, getInputGlowClass } = useAIPersonality();
  
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

  useEffect(() => {
    setIsListening(voiceIsListening);
  }, [voiceIsListening]);
  
  useEffect(() => {
    if (inputRef.current && !isDisabled && !isListening) {
      inputRef.current.focus();
    }
  }, [isDisabled, currentMode, isListening]);
  
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
    if (onClearChat) {
      setShowClearConfirmation(true);
    }
  };

  const confirmClearChat = () => {
    if (onClearChat) {
      onClearChat();
    }
    setShowClearConfirmation(false);
  };
  
  const getInputBackgroundStyle = () => {
    switch (currentMode) {
      case 'general':
        return 'bg-blue-500/10 border-blue-500/30';
      case 'student':
        return 'bg-green-500/10 border-green-500/30';
      case 'productivity':
        return 'bg-purple-500/10 border-purple-500/30';
      case 'creative':
        return 'bg-pink-500/10 border-pink-500/30';
      default:
        return 'bg-blue-500/10 border-blue-500/30';
    }
  };

  const getClearButtonStyle = () => {
    switch (currentMode) {
      case 'general':
        return 'hover:bg-blue-500/20 text-blue-400 hover:text-blue-500';
      case 'student':
        return 'hover:bg-green-500/20 text-green-400 hover:text-green-500';
      case 'productivity':
        return 'hover:bg-purple-500/20 text-purple-400 hover:text-purple-500';
      case 'creative':
        return 'hover:bg-pink-500/20 text-pink-400 hover:text-pink-500';
      default:
        return 'hover:bg-blue-500/20 text-blue-400 hover:text-blue-500';
    }
  };

  const sendButtonStyle = {
    background: 'rgba(255, 255, 255, 0.12)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.15) inset, 0 0 15px rgba(59, 130, 246, 0.3)',
    backdropFilter: 'blur(12px)',
    transform: 'perspective(1000px) rotateX(2deg)',
    transition: 'all 0.3s ease',
  };
  
  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="relative flex flex-col gap-3 p-4 sm:p-5 border-t border-white/10 bg-transparent backdrop-blur-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      style={{
        boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.4)',
      }}
    >
      <div className="flex flex-col gap-2 w-full">
        <div className="relative w-full">
          <Textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Type a message..."
            disabled={isLoading || isDisabled || isListening}
            className={cn(
              "flex-1 backdrop-blur-xl transition-all duration-300 input-active text-foreground resize-none min-h-[60px] max-h-[120px] px-5 py-4 rounded-xl",
              inputValue && "pr-12",
              isLoading && "opacity-70",
              isListening && "bg-primary/10 border-primary/20",
              getInputGlowClass(isFocused),
              getInputBackgroundStyle(),
              "shadow-[0_15px_35px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(59,130,246,0.3)] focus:shadow-[0_20px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(59,130,246,0.5)] transform hover:translate-y-[-5px] focus:translate-y-[-5px] neon-glow-blue"
            )}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1) inset, 0 0 15px rgba(59, 130, 246, 0.3)',
              transform: 'perspective(1000px) rotateX(2deg)',
              color: 'white'
            }}
          />
        </div>
        
        <div className="flex justify-between items-center w-full mt-1">
          <InputToolbar 
            isLoading={isLoading} 
            isListening={isListening}
            onVoiceToggle={handleVoiceToggle}
          />
          
          <div className="flex items-center gap-2">
            {onClearChat && (
              <motion.div
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  type="button" 
                  size="icon" 
                  variant="ghost"
                  onClick={handleClearChat}
                  className={cn(
                    "rounded-full transition-colors duration-300 shadow-lg h-12 w-12 transform hover:translate-y-[-8px]",
                    "bg-white/10 dark:bg-black/50 border border-red-100/30 backdrop-blur-xl",
                    "hover:shadow-[0_15px_35px_rgba(0,0,0,0.7),0_0_20px_rgba(239,68,68,0.5)]",
                    getClearButtonStyle()
                  )}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
                    backdropFilter: 'blur(12px)',
                    transform: 'perspective(1000px) rotateX(2deg)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Trash2 className="h-6 w-6" />
                </Button>
              </motion.div>
            )}
            
            <motion.div
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                type="submit" 
                size="icon" 
                disabled={!inputValue.trim() || isLoading || isDisabled}
                className={cn(
                  "rounded-full transition-colors duration-300 shadow-lg h-12 w-12 transform hover:translate-y-[-8px] transition-transform duration-300",
                  "bg-white/10 dark:bg-black/50 border border-blue-100/30 dark:border-blue-900/50 backdrop-blur-xl",
                  "hover:shadow-[0_15px_35px_rgba(0,0,0,0.7),0_0_20px_rgba(59,130,246,0.5)]"
                )}
                style={sendButtonStyle}
              >
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
                ) : (
                  <Send className="h-6 w-6 text-blue-400" />
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        open={showClearConfirmation}
        onOpenChange={setShowClearConfirmation}
        title="Clear Chat"
        description="Are you sure you want to clear all chat messages? This action cannot be undone."
        onConfirm={confirmClearChat}
        confirmLabel="Clear"
        cancelLabel="Cancel"
        isDestructive={true}
      />
    </motion.form>
  );
};
