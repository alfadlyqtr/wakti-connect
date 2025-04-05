
import React from "react";
import { AIAssistantRole } from "@/types/ai-assistant.types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, BookOpen, Users, Briefcase, Edit } from "lucide-react";

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
  // Map combined roles
  const getMappedRole = (role: AIAssistantRole): string => {
    // Create role groups
    if (role === "student") return "student";
    if (role === "work" || role === "writer" || role === "employee") return "work";
    if (role === "business_owner") return "business";
    return "general";
  };
  
  const effectiveRole = getMappedRole(selectedRole);
  
  const handleRoleChange = (newRoleGroup: string) => {
    // Convert role group back to specific role
    let specificRole: AIAssistantRole = "general";
    
    switch (newRoleGroup) {
      case "student":
        specificRole = "student";
        break;
      case "work":
        specificRole = "work";
        break;
      case "business":
        specificRole = "business_owner";
        break;
      default:
        specificRole = "general";
    }
    
    onRoleChange(specificRole);
  };

  return (
    <Tabs value={effectiveRole} onValueChange={handleRoleChange} className="w-full">
      <TabsList className={`grid grid-cols-4 ${compact ? 'w-auto px-1 py-0.5' : 'w-full'}`}>
        <TabsTrigger value="general" className="flex items-center gap-1 text-xs sm:text-sm">
          <Bot className="h-4 w-4" />
          <span className={compact ? "hidden" : "hidden sm:inline"}>General</span>
        </TabsTrigger>
        <TabsTrigger value="student" className="flex items-center gap-1 text-xs sm:text-sm">
          <BookOpen className="h-4 w-4" />
          <span className={compact ? "hidden" : "hidden sm:inline"}>Student/Tutor</span>
        </TabsTrigger>
        <TabsTrigger value="work" className="flex items-center gap-1 text-xs sm:text-sm">
          <Edit className="h-4 w-4" />
          <span className={compact ? "hidden" : "hidden sm:inline"}>Work/Creator</span>
        </TabsTrigger>
        <TabsTrigger value="business" className="flex items-center gap-1 text-xs sm:text-sm">
          <Briefcase className="h-4 w-4" />
          <span className={compact ? "hidden" : "hidden sm:inline"}>Business</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
