
import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAIPersonality } from '../personality-switcher/AIPersonalityContext';

interface AIAssistantMouthAnimationProps {
  isActive: boolean;
  isSpeaking: boolean;
}

export const AIAssistantMouthAnimation: React.FC<AIAssistantMouthAnimationProps> = ({
  isActive,
  isSpeaking
}) => {
  const { currentMode } = useAIPersonality();
  
  const getAvatarClass = () => {
    switch (currentMode) {
      case 'general': return 'bg-blue-500';
      case 'student': return 'bg-green-500';
      case 'productivity': return 'bg-purple-500';
      case 'creative': return 'bg-pink-500';
      default: return 'bg-blue-500';
    }
  };

  // Different animation states
  const idleVariants = {
    hidden: { scale: 1 },
    visible: { scale: [1, 1.05, 1], transition: { duration: 2, repeat: Infinity, repeatDelay: 1 } }
  };
  
  const activeVariants = {
    hidden: { opacity: 0.8, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: isSpeaking ? [1, 1.1, 1, 1.05, 1] : 1,
      transition: { duration: isSpeaking ? 0.5 : 0.2, repeat: isSpeaking ? Infinity : 0 } 
    }
  };

  return (
    <motion.div
      variants={isActive ? activeVariants : idleVariants}
      initial="hidden"
      animate="visible"
    >
      <Avatar className={`h-8 w-8 ${getAvatarClass()} shadow-lg`}>
        <AvatarFallback className={getAvatarClass()}>
          <Bot className="h-4 w-4 text-white" />
        </AvatarFallback>
      </Avatar>
    </motion.div>
  );
};
