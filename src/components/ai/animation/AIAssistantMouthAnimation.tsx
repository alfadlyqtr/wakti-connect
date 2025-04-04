
import React from 'react';
import { cn } from '@/lib/utils';
import { Bot } from 'lucide-react';

interface AIAssistantMouthAnimationProps {
  isActive: boolean;
  isSpeaking?: boolean;
  size?: 'small' | 'medium' | 'large';
  mood?: 'neutral' | 'happy' | 'thinking';
}

export function AIAssistantMouthAnimation({
  isActive,
  isSpeaking = false,
  size = 'small',
  mood = 'neutral'
}: AIAssistantMouthAnimationProps) {
  // Size mapping
  const sizeClasses = {
    'small': 'h-9 w-9',
    'medium': 'h-12 w-12',
    'large': 'h-16 w-16'
  };
  
  // Since we no longer have text-to-speech functionality, this is simplified
  // to just show a static bot icon with some visual styling
  return (
    <div 
      className={cn(
        'rounded-full bg-wakti-blue flex items-center justify-center',
        sizeClasses[size],
        isSpeaking && 'animate-pulse'
      )}
    >
      <Bot className={cn('text-white', size === 'small' ? 'h-5 w-5' : 'h-6 w-6')} />
    </div>
  );
}
