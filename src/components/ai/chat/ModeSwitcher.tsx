
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAIPersonality } from '@/components/ai/personality-switcher/AIPersonalityContext';
import { AIPersonalityMode } from '@/components/ai/personality-switcher/types';
import { Bot, Book, Zap, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const modeIcons = {
  general: Bot,
  student: Book,
  productivity: Zap,
  creative: Sparkles,
};

const modeColors = {
  general: 'bg-blue-500 hover:bg-blue-600',
  student: 'bg-green-500 hover:bg-green-600',
  productivity: 'bg-purple-500 hover:bg-purple-600',
  creative: 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600',
};

export const ModeSwitcher: React.FC = () => {
  const { currentMode, setCurrentMode } = useAIPersonality();
  
  const handleModeChange = (mode: AIPersonalityMode) => {
    setCurrentMode(mode);
  };
  
  return (
    <motion.div 
      className="flex items-center justify-center gap-1 p-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {(Object.keys(modeIcons) as AIPersonalityMode[]).map((mode) => {
        const Icon = modeIcons[mode];
        const isActive = currentMode === mode;
        const activeColor = modeColors[mode];
        
        return (
          <Button
            key={mode}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={() => handleModeChange(mode)}
            className={cn(
              "rounded-md px-3 gap-1.5 transition-all duration-300",
              isActive ? activeColor : "hover:bg-muted"
            )}
          >
            <Icon className={cn("h-3.5 w-3.5", isActive && "animate-pulse duration-1000")} />
            <span className="hidden sm:inline capitalize">{mode}</span>
          </Button>
        );
      })}
    </motion.div>
  );
};
