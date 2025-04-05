
import React from "react";
import { AIAssistantRole } from "@/types/ai-assistant.types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, BookOpen, Users, Briefcase } from "lucide-react";

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
    // Map the combined work_creator role to employee
    if (newRole === "work_creator") {
      onRoleChange("employee");
    } else {
      onRoleChange(newRole as AIAssistantRole);
    }
  };

  // Check if current role is either employee or writer for the combined tab
  const isWorkCreatorActive = selectedRole === "employee" || selectedRole === "writer";

  return (
    <Tabs 
      value={isWorkCreatorActive ? "work_creator" : selectedRole} 
      onValueChange={handleRoleChange}
    >
      <TabsList className={`grid grid-cols-4 w-full ${compact ? 'px-1 py-0.5' : ''}`}>
        <TabsTrigger value="general" className="flex items-center gap-1 text-xs sm:text-sm">
          <Bot className="h-4 w-4" />
          <span className={compact ? "hidden" : "hidden sm:inline"}>General</span>
        </TabsTrigger>
        <TabsTrigger value="student" className="flex items-center gap-1 text-xs sm:text-sm">
          <BookOpen className="h-4 w-4" />
          <span className={compact ? "hidden" : "hidden sm:inline"}>Student</span>
        </TabsTrigger>
        <TabsTrigger value="work_creator" className="flex items-center gap-1 text-xs sm:text-sm">
          <Users className="h-4 w-4" />
          <span className={compact ? "hidden" : "hidden sm:inline"}>Work/Creator</span>
        </TabsTrigger>
        <TabsTrigger value="business_owner" className="flex items-center gap-1 text-xs sm:text-sm">
          <Briefcase className="h-4 w-4" />
          <span className={compact ? "hidden" : "hidden sm:inline"}>Business</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
