
import React from 'react';
import { cn } from '@/lib/utils';
import { Bot } from 'lucide-react';
import { motion } from 'framer-motion';

interface AIAssistantMouthAnimationProps {
  isActive: boolean;
  size?: 'small' | 'medium' | 'large';
  mood?: 'neutral' | 'happy' | 'thinking';
  isSpeaking?: boolean;
}

export function AIAssistantMouthAnimation({
  isActive,
  size = 'small',
  mood = 'neutral',
  isSpeaking = false
}: AIAssistantMouthAnimationProps) {
  // Size mapping
  const sizeClasses = {
    'small': 'h-9 w-9',
    'medium': 'h-12 w-12',
    'large': 'h-16 w-16'
  };
  
  return (
    <motion.div 
      className={cn(
        'rounded-full bg-wakti-blue flex items-center justify-center',
        sizeClasses[size]
      )}
      animate={isSpeaking ? { 
        scale: [1, 1.05, 1],
      } : {}}
      transition={{ 
        repeat: isSpeaking ? Infinity : 0, 
        duration: 1,
        repeatType: "reverse" 
      }}
    >
      <Bot className={cn('text-white', size === 'small' ? 'h-5 w-5' : 'h-6 w-6')} />
    </motion.div>
  );
}
