
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAIPersonality } from '@/components/ai/personality-switcher/AIPersonalityContext';
import { AIPersonalityMode } from '@/components/ai/personality-switcher/types';
import { personalityPresets } from '@/components/ai/personality-switcher/personalityPresets'; // Added this import
import { Bot, Book, Zap, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

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
  const { currentMode, setCurrentMode, currentPersonality } = useAIPersonality();
  
  const handleModeChange = (mode: AIPersonalityMode) => {
    setCurrentMode(mode);
  };
  
  return (
    <motion.div 
      className="flex items-center justify-center gap-2 p-3 glassmorphism rounded-xl shadow-lg floating-card z-10"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {(Object.keys(modeIcons) as AIPersonalityMode[]).map((mode) => {
        const Icon = modeIcons[mode];
        const isActive = currentMode === mode;
        const activeColor = modeColors[mode];
        
        return (
          <HoverCard key={mode} openDelay={300} closeDelay={100}>
            <HoverCardTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleModeChange(mode)}
                  className={cn(
                    "rounded-md px-3 py-2 gap-1.5 transition-all duration-300",
                    isActive ? activeColor : "hover:bg-muted"
                  )}
                >
                  <Icon className={cn(
                    "h-4 w-4", 
                    isActive && "text-white animate-pulse duration-1000"
                  )} />
                  <span className="capitalize text-sm">{mode}</span>
                </Button>
              </motion.div>
            </HoverCardTrigger>
            <HoverCardContent className="p-3 text-sm" align="center" side="bottom">
              <div className="font-medium mb-1">{personalityPresets[mode].title}</div>
              <p className="text-xs text-muted-foreground">{personalityPresets[mode].description}</p>
            </HoverCardContent>
          </HoverCard>
        );
      })}
    </motion.div>
  );
};
