
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WAKTIAIMode, WAKTIAIModes } from '@/types/ai-assistant.types';
import { 
  MessageCircle, 
  ListTodo, 
  GraduationCap, 
  Sparkles,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AIModeSwitcherProps {
  activeMode: WAKTIAIMode;
  setActiveMode: (mode: WAKTIAIMode) => void;
}

// Map of mode IDs to their corresponding icons
const modeIcons = {
  general: MessageCircle,
  productivity: ListTodo,
  student: GraduationCap,
  creative: Sparkles
};

export const AIModeSwitcher = ({ activeMode, setActiveMode }: AIModeSwitcherProps) => {
  return (
    <div className="flex justify-between items-center p-3 bg-background">
      <div className="flex-1">
        <h1 className="text-sm font-medium hidden sm:block">{WAKTIAIModes[activeMode].title} Mode</h1>
      </div>
      
      <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as WAKTIAIMode)} className="flex-1 flex justify-center">
        <TabsList className="grid grid-cols-4 w-full max-w-xs">
          {Object.values(WAKTIAIModes).map((mode) => {
            const Icon = modeIcons[mode.id as keyof typeof modeIcons];
            return (
              <TooltipProvider key={mode.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger 
                      value={mode.id} 
                      className={cn(
                        "flex items-center justify-center",
                        activeMode === mode.id && "data-[state=active]:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="sr-only">{mode.title}</span>
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{mode.title}</p>
                    <p className="text-xs text-muted-foreground">{mode.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </TabsList>
      </Tabs>
      
      <div className="flex-1 flex justify-end">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="rounded-full p-1.5 hover:bg-muted">
                <Info className="h-4 w-4 text-muted-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p className="font-medium">{WAKTIAIModes[activeMode].title}</p>
              <p className="text-xs max-w-[200px]">{WAKTIAIModes[activeMode].description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
