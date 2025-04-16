
import React, { useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useAIPersonality } from '@/components/ai/personality-switcher/AIPersonalityContext';

interface ChatInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
  isDisabled: boolean;
  isListening: boolean;
  autoFocus?: boolean;
}

export const ChatInputField: React.FC<ChatInputFieldProps> = ({
  value,
  onChange,
  onKeyDown,
  isLoading,
  isDisabled,
  isListening,
  autoFocus = true
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { getInputGlowClass } = useAIPersonality();

  useEffect(() => {
    if (inputRef.current && autoFocus && !isDisabled && !isListening) {
      inputRef.current.focus();
    }
  }, [isDisabled, isListening, autoFocus]);

  return (
    <Textarea
      ref={inputRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      placeholder="Type a message..."
      disabled={isLoading || isDisabled || isListening}
      className={cn(
        "flex-1 backdrop-blur-xl transition-all duration-300 input-active text-foreground resize-none min-h-[60px] max-h-[120px] px-5 py-4 rounded-xl",
        value && "pr-12",
        isLoading && "opacity-70",
        isListening && "bg-primary/10 border-primary/20",
        getInputGlowClass(isFocused),
        "shadow-[0_15px_35px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(59,130,246,0.3)] focus:shadow-[0_20px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(59,130,246,0.5)] transform hover:translate-y-[-5px] focus:translate-y-[-5px] neon-glow-blue"
      )}
      style={{
        background: 'rgba(255, 255, 255, 0.08)',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1) inset, 0 0 15px rgba(59, 130, 246, 0.3)',
        transform: 'perspective(1000px) rotateX(2deg)',
        color: 'white'
      }}
    />
  );
};
