
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAIPersonality } from '@/components/ai/personality-switcher/AIPersonalityContext';
import { motion } from 'framer-motion';
import { InputToolbar } from '../input/InputToolbar';
import { useVoiceInteraction } from '@/hooks/ai/useVoiceInteraction';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
  isDisabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  isLoading, 
  isDisabled = false 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
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

  // Update local listening state based on voice interaction hook
  useEffect(() => {
    setIsListening(voiceIsListening);
  }, [voiceIsListening]);
  
  // Auto-focus the input when component mounts
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
  
  // Get the background gradient or color for the send button
  const getSendButtonStyle = () => {
    if (isLoading) return '';
    
    switch (currentMode) {
      case 'general':
        return 'hover:bg-blue-500 hover:text-white';
      case 'student':
        return 'hover:bg-green-500 hover:text-white';
      case 'productivity':
        return 'hover:bg-purple-500 hover:text-white';
      case 'creative':
        return 'hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 hover:text-white';
      default:
        return 'hover:bg-blue-500 hover:text-white';
    }
  };
  
  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="relative flex flex-col gap-3 p-5 border-t border-white/20 bg-white/10 backdrop-blur-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      style={{
        boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.05)',
      }}
    >
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
            "flex-1 bg-white/20 dark:bg-slate-800/20 backdrop-blur-xl border-2 border-white/30 dark:border-slate-700/30 transition-all duration-300 input-active text-foreground resize-none min-h-[60px] max-h-[120px] px-5 py-4 rounded-xl pr-36",
            inputValue && "pr-12",
            isLoading && "opacity-70",
            isListening && "bg-primary/5 border-primary/20",
            getInputGlowClass(isFocused),
            "shadow-lg hover:shadow-xl transform hover:translate-y-[-2px] focus:translate-y-[-2px]"
          )}
          style={{
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(255, 255, 255, 0.3) inset',
          }}
        />
        
        <InputToolbar 
          isLoading={isLoading} 
          isListening={isListening}
          onVoiceToggle={handleVoiceToggle}
        />
      </div>
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          size="icon" 
          disabled={!inputValue.trim() || isLoading || isDisabled}
          className={cn(
            "rounded-full transition-colors duration-300 shadow-lg h-14 w-14",
            "bg-white/40 border border-white/30 backdrop-blur-xl",
            "dark:bg-slate-800/40 dark:border-slate-700/30",
            "hover:shadow-xl transform hover:translate-y-[-2px] transition-transform duration-300",
            getSendButtonStyle()
          )}
          style={{
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2) inset',
          }}
        >
          {isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <Send className="h-6 w-6" />
          )}
        </Button>
      </div>
    </motion.form>
  );
};
