
import React from "react";
import { Bot, Info, Cog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/useIsMobile";

interface AIAssistantHeaderProps {
  userName?: string;
}

export const AIAssistantHeader: React.FC<AIAssistantHeaderProps> = ({ userName }) => {
  const isMobile = useIsMobile();
  
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-2 px-2 md:px-4">
      <div className="flex items-center gap-2">
        <img 
          src="/lovable-uploads/9b7d0693-89eb-4cc5-b90b-7834bfabda0e.png" 
          alt="WAKTI Logo" 
          className="h-7 w-7 sm:h-8 sm:w-8 rounded-md object-cover"
        />
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-primary truncate max-w-[200px] sm:max-w-full">
            WAKTI AI Assistant
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground truncate max-w-[250px] sm:max-w-full">
            {getTimeBasedGreeting()}{userName ? `, ${userName}` : ""}! How can I help you today?
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mt-1 md:mt-0 ml-auto md:ml-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 sm:h-8">
                <Info className="mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                {!isMobile && <span className="text-xs sm:text-sm">AI Capabilities</span>}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-sm">
              <p>WAKTI AI can help with scheduling, task management, planning, and more</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Button variant="outline" size="sm" className="h-7 sm:h-8" asChild>
          <a href="/dashboard/settings?tab=ai-assistant">
            <Cog className="mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5" />
            {!isMobile && <span className="text-xs sm:text-sm">Settings</span>}
          </a>
        </Button>
      </div>
    </div>
  );
};
