
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAIPersonality } from '@/components/ai/personality-switcher/AIPersonalityContext';

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
  const inputRef = useRef<HTMLInputElement>(null);
  const { currentPersonality } = useAIPersonality();
  
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
  
  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex items-center gap-2 p-3 border-t bg-card/50"
    >
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        disabled={isLoading || isDisabled}
        className={cn(
          "flex-1 bg-background/50 backdrop-blur-sm border transition-all",
          inputValue && "pr-10",
          isLoading && "opacity-70"
        )}
      />
      
      <Button 
        type="submit" 
        size="icon" 
        disabled={!inputValue.trim() || isLoading || isDisabled}
        className={cn(
          "rounded-full transition-colors",
          !isLoading && inputValue.trim() && 
          `hover:bg-${currentPersonality.iconColor} hover:text-background`
        )}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
};
