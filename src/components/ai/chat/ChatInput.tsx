
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
  
  const getInputBackgroundStyle = () => {
    switch (currentMode) {
      case 'general':
        return 'bg-blue-900/15';
      case 'student':
        return 'bg-green-900/15';
      case 'productivity':
        return 'bg-purple-900/15';
      case 'creative':
        return 'bg-pink-900/15';
      default:
        return 'bg-blue-900/15';
    }
  };
  
  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="relative flex flex-col gap-3 p-5 border-t border-white/10 bg-black/20 backdrop-blur-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      style={{
        boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.4)',
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
            "flex-1 dark:bg-slate-800/25 backdrop-blur-xl border-2 border-white/20 dark:border-slate-700/20 transition-all duration-300 input-active text-foreground resize-none min-h-[60px] max-h-[120px] px-5 py-4 rounded-xl pr-36",
            inputValue && "pr-12",
            isLoading && "opacity-70",
            isListening && "bg-primary/10 border-primary/20",
            getInputGlowClass(isFocused),
            getInputBackgroundStyle(),
            "shadow-[0_15px_35px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(59,130,246,0.3)] focus:shadow-[0_20px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(59,130,246,0.5)] transform hover:translate-y-[-5px] focus:translate-y-[-5px] neon-glow-blue"
          )}
          style={{
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1) inset, 0 0 15px rgba(59, 130, 246, 0.3)',
            transform: 'perspective(1000px) rotateX(1deg)'
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
            "rounded-full transition-colors duration-300 shadow-lg h-12 w-12 sm:h-14 sm:w-14 transform hover:translate-y-[-8px] transition-transform duration-300",
            "bg-black/30 border border-white/10 backdrop-blur-xl",
            "dark:bg-slate-800/30 dark:border-slate-700/20",
            "hover:shadow-[0_15px_35px_rgba(0,0,0,0.7),0_0_20px_rgba(59,130,246,0.5)]"
          )}
          style={{
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1) inset, 0 0 15px rgba(59, 130, 246, 0.3)',
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
