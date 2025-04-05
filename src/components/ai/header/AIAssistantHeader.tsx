
import React from "react";
import { Bot, Info, Cog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface AIAssistantHeaderProps {
  userName?: string;
}

export const AIAssistantHeader: React.FC<AIAssistantHeaderProps> = ({ userName }) => {
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-2">
      <div className="flex items-center gap-2">
        <img 
          src="/lovable-uploads/9b7d0693-89eb-4cc5-b90b-7834bfabda0e.png" 
          alt="WAKTI Logo" 
          className="h-8 w-8 rounded-md object-cover"
        />
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-primary">
            WAKTI AI Assistant
          </h1>
          <p className="text-sm text-muted-foreground">
            {getTimeBasedGreeting()}{userName ? `, ${userName}` : ""}! How can I help you today?
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mt-2 md:mt-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Info className="mr-1 h-3.5 w-3.5" />
                <span className="hidden sm:inline">AI Capabilities</span>
                <span className="sm:hidden">Info</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-sm">
              <p>WAKTI AI can help with scheduling, task management, planning, and more</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Button variant="outline" size="sm" className="h-8" asChild>
          <a href="/dashboard/settings?tab=ai-assistant">
            <Cog className="mr-1 h-3.5 w-3.5" />
            <span className="hidden sm:inline">Customize AI</span>
            <span className="sm:hidden">Settings</span>
          </a>
        </Button>
      </div>
    </div>
  );
};
