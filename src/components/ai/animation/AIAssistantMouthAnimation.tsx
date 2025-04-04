
import React from 'react';
import { motion } from 'framer-motion';

interface AIAssistantMouthAnimationProps {
  isActive: boolean;
  isSpeaking: boolean;
  size?: 'small' | 'medium' | 'large';
  mood?: 'neutral' | 'happy' | 'thinking';
}

export const AIAssistantMouthAnimation: React.FC<AIAssistantMouthAnimationProps> = ({
  isActive,
  isSpeaking,
  size = 'medium',
  mood = 'neutral'
}) => {
  if (!isActive) return null;
  
  // Size classes based on prop
  const sizeClass = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10',
    large: 'w-24 h-24',
  }[size];
  
  // Background color based on mood
  const bgColorClass = {
    neutral: 'bg-wakti-blue',
    happy: 'bg-green-500',
    thinking: 'bg-amber-500',
  }[mood];
  
  return (
    <div className={`rounded-full flex items-center justify-center ${sizeClass} ${bgColorClass}`}>
      <div className="relative flex items-center justify-center w-full h-full">
        {/* Eyes */}
        <div className="absolute flex gap-2 top-[30%]">
          <div className="bg-white rounded-full w-[20%] h-[20%]"></div>
          <div className="bg-white rounded-full w-[20%] h-[20%]"></div>
        </div>
        
        {/* Mouth */}
        {isSpeaking ? (
          <motion.div
            className="absolute bottom-[30%] bg-white rounded-md w-[50%] h-[10%]"
            animate={{
              height: ['10%', '25%', '10%', '20%', '10%'],
              y: [0, -2, 0, -1, 0],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              repeatType: 'loop',
            }}
          />
        ) : (
          <div className="absolute bottom-[30%] bg-white rounded-md w-[50%] h-[10%]"></div>
        )}
      </div>
    </div>
  );
};
