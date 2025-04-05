
import React from 'react';
import { cn } from '@/lib/utils';
import { Bot } from 'lucide-react';

interface AIAssistantMouthAnimationProps {
  isActive: boolean;
  size?: 'small' | 'medium' | 'large';
  mood?: 'neutral' | 'happy' | 'thinking';
  isSpeaking?: boolean; // Added this prop to fix the type error
}

export function AIAssistantMouthAnimation({
  isActive,
  size = 'small',
  mood = 'neutral',
  isSpeaking = false // Default to false
}: AIAssistantMouthAnimationProps) {
  // Size mapping
  const sizeClasses = {
    'small': 'h-9 w-9',
    'medium': 'h-12 w-12',
    'large': 'h-16 w-16'
  };
  
  return (
    <div 
      className={cn(
        'rounded-full bg-wakti-blue flex items-center justify-center',
        sizeClasses[size]
      )}
    >
      <Bot className={cn('text-white', size === 'small' ? 'h-5 w-5' : 'h-6 w-6')} />
    </div>
  );
}
