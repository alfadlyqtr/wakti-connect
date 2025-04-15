
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAIPersonality } from '@/components/ai/personality-switcher/AIPersonalityContext';
import { motion } from 'framer-motion';

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
  const inputRef = useRef<HTMLInputElement>(null);
  const { currentPersonality, currentMode } = useAIPersonality();
  
  // Auto-focus the input when component mounts
  useEffect(() => {
    if (inputRef.current && !isDisabled) {
      inputRef.current.focus();
    }
  }, [isDisabled, currentMode]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading || isDisabled) return;
    
    await onSendMessage(inputValue);
    setInputValue('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };
  
  // Get input glow color based on current mode
  const getInputGlowColor = () => {
    if (!isFocused || !inputValue) return '';
    
    switch (currentMode) {
      case 'general':
        return 'ring-2 ring-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.3)]';
      case 'student':
        return 'ring-2 ring-green-300 shadow-[0_0_10px_rgba(34,197,94,0.3)]';
      case 'productivity':
        return 'ring-2 ring-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]';
      case 'creative':
        return 'ring-2 ring-pink-300 shadow-[0_0_10px_rgba(236,72,153,0.3)]';
      default:
        return 'ring-2 ring-blue-300';
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
      className="flex items-center gap-2 p-3 border-t bg-background/30 backdrop-blur-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Type a message..."
        disabled={isLoading || isDisabled}
        className={cn(
          "flex-1 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border transition-all duration-300",
          inputValue && "pr-10",
          getInputGlowColor(),
          isLoading && "opacity-70"
        )}
      />
      
      <Button 
        type="submit" 
        size="icon" 
        disabled={!inputValue.trim() || isLoading || isDisabled}
        className={cn(
          "rounded-full transition-colors duration-300",
          getSendButtonStyle()
        )}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </motion.form>
  );
};
