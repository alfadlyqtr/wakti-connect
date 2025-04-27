
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WAKTIAIMode } from '@/components/ai/personality-switcher/types';
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
import { useBreakpoint } from '@/hooks/useBreakpoint';

interface AIModeSwitcherProps {
  activeMode: WAKTIAIMode;
  setActiveMode: (mode: WAKTIAIMode) => void;
}

// Define mode information type
interface ModeInfo {
  id: WAKTIAIMode;
  title: string;
  description: string;
}

// Map of mode IDs to their corresponding icons
const modeIcons = {
  general: MessageCircle,
  productivity: ListTodo,
  student: GraduationCap,
  creative: Sparkles
};

// Define WAKTIAIModes
const WAKTIAIModes: Record<WAKTIAIMode, ModeInfo> = {
  general: {
    id: 'general',
    title: 'General',
    description: 'Ask me anything and get helpful responses'
  },
  student: {
    id: 'student',
    title: 'Student',
    description: 'Help with studying, homework, and learning'
  },
  productivity: {
    id: 'productivity',
    title: 'Productivity',
    description: 'Manage tasks, plan your day, and stay organized'
  },
  creative: {
    id: 'creative',
    title: 'Creative',
    description: 'Generate ideas, content, and creative writing'
  },
  employee: {
    id: 'employee',
    title: 'Employee',
    description: 'Your assistant for workplace productivity'
  },
  writer: {
    id: 'writer',
    title: 'Writer',
    description: 'Your assistant for creative and professional writing'
  },
  business_owner: {
    id: 'business_owner',
    title: 'Business',
    description: 'Your strategic partner for business management'
  }
};

export const AIModeSwitcher = ({ activeMode, setActiveMode }: AIModeSwitcherProps) => {
  const { breakpoint } = useBreakpoint();
  const isMobile = breakpoint === 'sm';
  
  // Filter to just the modes we're showing in the UI
  const displayModes: WAKTIAIMode[] = ['general', 'student', 'productivity', 'creative'];
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center p-3 bg-background gap-2">
      <div className="w-full sm:w-auto text-center sm:text-left sm:flex-1">
        <h1 className="text-sm font-medium">{WAKTIAIModes[activeMode].title} Mode</h1>
      </div>
      
      <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as WAKTIAIMode)} className="w-full sm:w-auto sm:flex-1 flex justify-center">
        <TabsList className="grid grid-cols-4 w-full max-w-sm gap-x-1">
          {displayModes.map((modeId) => {
            const mode = WAKTIAIModes[modeId];
            const Icon = modeIcons[modeId as keyof typeof modeIcons];
            return (
              <TooltipProvider key={modeId}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger 
                      value={modeId} 
                      className={cn(
                        "flex items-center justify-center px-3 py-1.5",
                        activeMode === modeId && "data-[state=active]:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4 mr-1.5" />
                      <span className={isMobile ? "text-xs" : "text-xs sm:text-sm"}>{mode.title}</span>
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
      
      <div className="w-full sm:w-auto flex justify-end sm:flex-1">
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
