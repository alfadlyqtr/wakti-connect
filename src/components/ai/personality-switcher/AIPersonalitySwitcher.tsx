
import React from 'react';
import { cn } from '@/lib/utils';
import { WAKTIAIMode, WAKTIAIModes } from '@/types/ai-assistant.types';
import { useIsMobile } from '@/hooks/useIsMobile';
import { Bot, GraduationCap, ListChecks, Sparkles } from 'lucide-react';

interface AIPersonalitySwitcherProps {
  activeMode: WAKTIAIMode;
  onSelectMode: (mode: WAKTIAIMode) => void;
}

export const AIPersonalitySwitcher: React.FC<AIPersonalitySwitcherProps> = ({
  activeMode,
  onSelectMode,
}) => {
  const isMobile = useIsMobile();

  // Helper function to render the correct icon
  const getIcon = (mode: WAKTIAIMode) => {
    switch (mode) {
      case 'general': 
        return <Bot className="w-4 h-4" />;
      case 'student': 
        return <GraduationCap className="w-4 h-4" />;
      case 'productivity': 
        return <ListChecks className="w-4 h-4" />;
      case 'creative': 
        return <Sparkles className="w-4 h-4" />;
      default: 
        return <Bot className="w-4 h-4" />;
    }
  };
  
  // Setup modes for rendering
  const modes = [
    { id: 'general' as WAKTIAIMode, label: 'General' },
    { id: 'student' as WAKTIAIMode, label: 'Learning' },
    { id: 'productivity' as WAKTIAIMode, label: 'Productivity' },
    { id: 'creative' as WAKTIAIMode, label: 'Creative' },
  ];

  return (
    <div className="flex items-center justify-center space-x-1 bg-black/30 rounded-lg p-1">
      {modes.map((mode) => {
        const isActive = mode.id === activeMode;
        return (
          <button
            key={mode.id}
            onClick={() => onSelectMode(mode.id)}
            className={cn(
              "flex items-center justify-center rounded-md px-2.5 py-1.5 text-sm font-medium transition-all",
              isActive ? "bg-gradient-to-r shadow-lg text-white" : "text-white/70 hover:text-white hover:bg-white/10",
              isActive && mode.id === 'general' && "from-blue-600 to-blue-500",
              isActive && mode.id === 'student' && "from-green-600 to-green-500",
              isActive && mode.id === 'productivity' && "from-purple-600 to-purple-500",
              isActive && mode.id === 'creative' && "from-pink-600 to-pink-500"
            )}
          >
            <span className="flex items-center">
              {getIcon(mode.id)}
              {(!isMobile || modes.length <= 3) && (
                <span className="ml-2">{mode.label}</span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};
