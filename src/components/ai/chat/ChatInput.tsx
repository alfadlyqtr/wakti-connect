
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
  const { currentMode, getInputGlowClass } = useAIPersonality();
  
  // Auto-focus the input when component mounts
  useEffect(() => {
    if (inputRef.current && !isDisabled) {
      inputRef.current.focus();
    }
  }, [isDisabled, currentMode]);
  
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
  
  // Get the background gradient or color for the send button
  const getSendButtonStyle = () => {
    if (isLoading) return '';
    
    switch (currentMode) {
      case 'general':
        return 'hover:bg-blue-500 hover:text-white';
      case 'student':
        return 'hover:bg-green-500 hover:text-white';
      case 'productivity':
        return 'hover:bg-yellow-500 hover:text-white';
      case 'creative':
        return 'hover:bg-purple-500 hover:text-white';
      default:
        return 'hover:bg-blue-500 hover:text-white';
    }
  };
  
  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="flex items-center gap-2 p-3 border-t bg-transparent backdrop-blur-md"
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
          "flex-1 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border transition-all duration-300 input-active text-foreground h-12 px-4",
          inputValue && "pr-10",
          isLoading && "opacity-70",
          getInputGlowClass(isFocused)
        )}
      />
      
      <Button 
        type="submit" 
        size="icon" 
        disabled={!inputValue.trim() || isLoading || isDisabled}
        className={cn(
          "rounded-full transition-colors duration-300 shadow-sm h-12 w-12",
          getSendButtonStyle()
        )}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Send className="h-5 w-5" />
        )}
      </Button>
    </motion.form>
  );
};
