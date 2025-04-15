
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAIPersonality } from '@/components/ai/personality-switcher/AIPersonalityContext';
import { AIPersonalityMode } from '@/components/ai/personality-switcher/types';
import { Bot, Book, Zap, Sparkles } from 'lucide-react';

const modeIcons = {
  general: Bot,
  student: Book,
  productivity: Zap,
  creative: Sparkles,
};

export const ModeSwitcher: React.FC = () => {
  const { currentMode, setCurrentMode, currentPersonality } = useAIPersonality();
  
  const handleModeChange = (mode: AIPersonalityMode) => {
    setCurrentMode(mode);
  };
  
  return (
    <div className="flex items-center justify-center gap-1 p-2 bg-background/80 backdrop-blur-sm rounded-lg shadow-sm border">
      {Object.entries(modeIcons).map(([mode, Icon]) => {
        const isActive = currentMode === mode;
        return (
          <Button
            key={mode}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={() => handleModeChange(mode as AIPersonalityMode)}
            className={cn(
              "rounded-md px-3 gap-1.5 transition-all",
              isActive && `bg-${currentPersonality.color} hover:bg-${currentPersonality.color}/90`
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{mode.charAt(0).toUpperCase() + mode.slice(1)}</span>
          </Button>
        );
      })}
    </div>
  );
};
