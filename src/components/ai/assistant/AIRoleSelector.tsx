
import React from "react";
import { AIAssistantRole } from "@/types/ai-assistant.types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, BookOpen, Users, Edit, Briefcase } from "lucide-react";

interface AIRoleSelectorProps {
  selectedRole: AIAssistantRole;
  onRoleChange: (role: AIAssistantRole) => void;
}

export const AIRoleSelector: React.FC<AIRoleSelectorProps> = ({
  selectedRole,
  onRoleChange,
}) => {
  return (
    <Tabs value={selectedRole} onValueChange={(val) => onRoleChange(val as AIAssistantRole)}>
      <TabsList className="grid grid-cols-5 w-full">
        <TabsTrigger value="general" className="flex items-center gap-1 text-xs sm:text-sm">
          <Bot className="h-4 w-4" />
          <span className="hidden sm:inline">General</span>
        </TabsTrigger>
        <TabsTrigger value="student" className="flex items-center gap-1 text-xs sm:text-sm">
          <BookOpen className="h-4 w-4" />
          <span className="hidden sm:inline">Student</span>
        </TabsTrigger>
        <TabsTrigger value="employee" className="flex items-center gap-1 text-xs sm:text-sm">
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">Work</span>
        </TabsTrigger>
        <TabsTrigger value="writer" className="flex items-center gap-1 text-xs sm:text-sm">
          <Edit className="h-4 w-4" />
          <span className="hidden sm:inline">Creator</span>
        </TabsTrigger>
        <TabsTrigger value="business_owner" className="flex items-center gap-1 text-xs sm:text-sm">
          <Briefcase className="h-4 w-4" />
          <span className="hidden sm:inline">Business</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
