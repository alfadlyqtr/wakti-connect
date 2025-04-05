
import React from "react";
import { AIAssistantRole } from "@/types/ai-assistant.types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, BookOpen, Pen, Briefcase } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AIRoleSelectorProps {
  selectedRole: AIAssistantRole;
  onRoleChange: (role: AIAssistantRole) => void;
  compact?: boolean;
}

export const AIRoleSelector: React.FC<AIRoleSelectorProps> = ({
  selectedRole,
  onRoleChange,
  compact = false
}) => {
  // Handle the combined Work/Creator role
  const handleRoleChange = (newRole: string) => {
    // Map the combined creative role to employee
    if (newRole === "creative") {
      onRoleChange("employee");
    } else {
      onRoleChange(newRole as AIAssistantRole);
    }
  };

  // Check if current role is either employee or writer for the combined tab
  const isCreativeActive = selectedRole === "employee" || selectedRole === "writer";
  
  // Role descriptions for tooltips
  const roleDescriptions = {
    general: "Day planning, tasks, reminders, and general assistance",
    student: "Study help, research, assignments, and academic support",
    creative: "Content creation, professional writing, emails, and creative assistance",
    business_owner: "Business operations, staff management, analytics, and reporting"
  };

  return (
    <TooltipProvider delayDuration={300}>
      <Tabs 
        value={isCreativeActive ? "creative" : selectedRole} 
        onValueChange={handleRoleChange}
      >
        <TabsList className={`grid grid-cols-4 w-full ${compact ? 'px-1 py-0.5' : ''}`}>
          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger 
                value="general" 
                className="flex items-center gap-1 text-xs sm:text-sm"
              >
                <Bot className="h-4 w-4" />
                <span className={compact ? "hidden" : "hidden sm:inline"}>General</span>
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs">{roleDescriptions.general}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger 
                value="student" 
                className="flex items-center gap-1 text-xs sm:text-sm"
              >
                <BookOpen className="h-4 w-4" />
                <span className={compact ? "hidden" : "hidden sm:inline"}>Student</span>
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs">{roleDescriptions.student}</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger 
                value="creative" 
                className="flex items-center gap-1 text-xs sm:text-sm"
              >
                <Pen className="h-4 w-4" />
                <span className={compact ? "hidden" : "hidden sm:inline"}>Creative</span>
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs">{roleDescriptions.creative}</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger 
                value="business_owner" 
                className="flex items-center gap-1 text-xs sm:text-sm"
              >
                <Briefcase className="h-4 w-4" />
                <span className={compact ? "hidden" : "hidden sm:inline"}>Business</span>
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs">{roleDescriptions.business_owner}</p>
            </TooltipContent>
          </Tooltip>
        </TabsList>
      </Tabs>
    </TooltipProvider>
  );
};
