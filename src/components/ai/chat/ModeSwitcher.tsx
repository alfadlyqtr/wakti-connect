
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAIPersonality } from '@/components/ai/personality-switcher/AIPersonalityContext';
import { WAKTIAIMode } from '@/components/ai/personality-switcher/types';
import { personalityPresets } from '@/components/ai/personality-switcher/personalityPresets';
import { Bot, Book, Zap, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { useBreakpoint } from '@/hooks/useBreakpoint';

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
  const { breakpoint } = useBreakpoint();
  const isMobile = breakpoint === 'sm' || breakpoint === 'md';
  
  const handleModeChange = (mode: WAKTIAIMode) => {
    setCurrentMode(mode);
  };
  
  return (
    <motion.div 
      className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 sm:gap-3 p-3 sm:p-4 glassmorphism rounded-xl transform hover:translate-y-[-5px] transition-all duration-300 z-10"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        backdropFilter: 'blur(20px)',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1) inset, 0 0 20px rgba(59, 130, 246, 0.3)',
        borderRadius: '16px',
      }}
    >
      {(Object.keys(modeIcons) as WAKTIAIMode[]).map((mode) => {
        const Icon = modeIcons[mode];
        const isActive = currentMode === mode;
        const activeColor = modeColors[mode as keyof typeof modeColors];
        
        return (
          <HoverCard key={mode} openDelay={300} closeDelay={100}>
            <HoverCardTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="w-[calc(50%-4px)] sm:w-auto"
              >
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size={isMobile ? "sm" : "lg"}
                  onClick={() => handleModeChange(mode)}
                  className={cn(
                    "rounded-xl py-2 sm:py-3 gap-1.5 transition-all duration-300 w-full",
                    isActive ? activeColor : "hover:bg-white/10",
                    "transform perspective-800 hover:perspective-800 hover:rotate-x-2 hover:rotate-y-1 transition-transform",
                    isMobile ? "px-2.5 text-xs h-10" : "px-4 text-sm"
                  )}
                  style={{
                    boxShadow: isActive ? '0 10px 25px rgba(0, 0, 0, 0.5), 0 0 15px rgba(59, 130, 246, 0.5)' : '0 5px 15px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  <Icon className={cn(
                    "h-4 w-4 sm:h-5 sm:w-5", 
                    isActive && "text-white animate-pulse duration-1000"
                  )} />
                  <span className="capitalize font-semibold whitespace-nowrap">{mode}</span>
                </Button>
              </motion.div>
            </HoverCardTrigger>
            <HoverCardContent className="p-3 text-sm" align="center" side="bottom">
              <div className="font-medium mb-1">{personalityPresets[mode]?.title}</div>
              <p className="text-xs text-muted-foreground">{personalityPresets[mode]?.description}</p>
            </HoverCardContent>
          </HoverCard>
        );
      })}
    </motion.div>
  );
};
