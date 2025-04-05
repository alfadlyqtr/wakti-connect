
import React from "react";
import { 
  Bot, 
  Sparkles, 
  Keyboard, 
  Mic,
  Megaphone,
  BookOpen,
  Briefcase, 
  Edit,
  Users,
  Settings
} from "lucide-react";
import { motion } from "framer-motion";
import { AIAssistantRole } from "@/types/ai-assistant.types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface AIAssistantHeaderProps {
  userName?: string;
  selectedRole: AIAssistantRole;
  onRoleChange: (role: AIAssistantRole) => void;
  isSpeechEnabled: boolean;
  onToggleSpeech: () => void;
  isListening: boolean;
  onStartListening?: () => void;
  onStopListening?: () => void;
}

export const AIAssistantHeader: React.FC<AIAssistantHeaderProps> = ({
  userName,
  selectedRole,
  onRoleChange,
  isSpeechEnabled,
  onToggleSpeech,
  isListening,
  onStartListening,
  onStopListening
}) => {
  // Get role-specific information for styling
  const getRoleIcon = (role: AIAssistantRole) => {
    switch (role) {
      case "student": return <BookOpen className="h-4 w-4" />;
      case "employee": return <Users className="h-4 w-4" />;
      case "writer": return <Edit className="h-4 w-4" />;
      case "business_owner": return <Briefcase className="h-4 w-4" />;
      default: return <Bot className="h-4 w-4" />;
    }
  };
  
  const getRoleColor = (role: AIAssistantRole) => {
    switch (role) {
      case "student": return "from-blue-600 to-blue-500";
      case "employee": return "from-purple-600 to-purple-500";
      case "writer": return "from-green-600 to-green-500";
      case "business_owner": return "from-amber-600 to-amber-500";
      default: return "from-wakti-blue to-wakti-blue/90";
    }
  };
  
  const getRoleName = (role: AIAssistantRole) => {
    switch (role) {
      case "student": return "Student Assistant";
      case "employee": return "Work Assistant";
      case "writer": return "Creator Assistant";
      case "business_owner": return "Business Assistant";
      default: return "General Assistant";
    }
  };

  return (
    <header className="p-4 bg-white border-b shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Assistant title and info */}
        <div className="flex items-center">
          <div className={cn(
            "h-10 w-10 rounded-full overflow-hidden flex items-center justify-center mr-3 shadow-sm",
            getRoleColor(selectedRole)
          )}>
            <img 
              src="/lovable-uploads/9b7d0693-89eb-4cc5-b90b-7834bfabda0e.png" 
              alt="WAKTI Logo"
              className="h-full w-full object-cover"
            />
          </div>
          
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              WAKTI AI
              <motion.span 
                className="ml-2"
                initial={{ rotate: -10, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 2 }}
              >
                <Sparkles className="h-5 w-5 text-yellow-500" />
              </motion.span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Your personal assistant for productivity and business management
            </p>
          </div>
        </div>
        
        {/* Controls and voice options */}
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground hidden md:inline">Voice</span>
                  <Switch 
                    checked={isSpeechEnabled} 
                    onCheckedChange={onToggleSpeech}
                    className="data-[state=checked]:bg-green-500"
                  />
                  <Megaphone className={cn(
                    "h-4 w-4",
                    isSpeechEnabled ? "text-green-500" : "text-muted-foreground"
                  )} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Turn text-to-speech {isSpeechEnabled ? 'off' : 'on'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {onStartListening && onStopListening && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={isListening ? "destructive" : "outline"}
                    size="sm"
                    className="ml-2"
                    onClick={isListening ? onStopListening : onStartListening}
                  >
                    {isListening ? (
                      <>
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                        >
                          <Mic className="h-4 w-4 mr-2 text-white" />
                        </motion.div>
                        Stop Listening
                      </>
                    ) : (
                      <>
                        <Mic className="h-4 w-4 mr-2" />
                        Start Listening
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isListening ? 'Stop voice recognition' : 'Start voice recognition'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-2">
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>AI Assistant Settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {/* Role selector tabs */}
      <div className="mt-4">
        <Tabs 
          value={selectedRole} 
          onValueChange={val => onRoleChange(val as AIAssistantRole)}
          className="w-full"
        >
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="general" className="flex items-center gap-1">
              <Bot className="h-4 w-4" />
              <span className="hidden md:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="student" className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span className="hidden md:inline">Student</span>
            </TabsTrigger>
            <TabsTrigger value="employee" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="hidden md:inline">Work</span>
            </TabsTrigger>
            <TabsTrigger value="writer" className="flex items-center gap-1">
              <Edit className="h-4 w-4" />
              <span className="hidden md:inline">Creator</span>
            </TabsTrigger>
            <TabsTrigger value="business_owner" className="flex items-center gap-1">
              <Briefcase className="h-4 w-4" />
              <span className="hidden md:inline">Business</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </header>
  );
};
