
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AIAssistantRole, RoleContexts } from "@/types/ai-assistant.types";
import { 
  LucideIcon, 
  Rocket, 
  BookOpen, 
  Calendar, 
  Clock, 
  Users, 
  BarChart, 
  FileText, 
  MessageSquare,
  Search,
  ClipboardCheck,
  CheckSquare,
  HelpCircle,
  Lightbulb,
  Edit,
  CalendarClock,
  Mail,
  ListChecks,
  Hash,
  HeartHandshake,
  Settings,
} from "lucide-react";

interface QuickToolsCardProps {
  selectedRole: AIAssistantRole;
  onToolClick: (toolDescription: string) => void;
}

// Map string icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  Calendar,
  FileText,
  Search,
  Clock,
  ClipboardCheck,
  Users,
  CheckSquare,
  CalendarClock,
  HelpCircle,
  Lightbulb,
  Edit,
  BarChart,
  HeartHandshake,
  Settings,
  Mail,
  ListChecks,
  MessageSquare,
  Hash,
};

export const QuickToolsCard: React.FC<QuickToolsCardProps> = ({ 
  selectedRole, 
  onToolClick 
}) => {
  // Get role context
  const roleContext = RoleContexts[selectedRole];
  
  // Default tools if role doesn't have specific ones
  const defaultTools = [
    { name: "Quick Help", description: "Get assistance with basic tasks", icon: "HelpCircle" },
    { name: "Task Creator", description: "Create a new task", icon: "CheckSquare" },
    { name: "Calendar", description: "Manage your schedule", icon: "Calendar" },
  ];
  
  // Use role-specific tools or fall back to default
  const tools = roleContext.quickTools || defaultTools;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Rocket className="h-5 w-5 mr-2" />
          Quick Tools
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        {tools.map((tool, index) => {
          // Get icon component
          const IconComponent = tool.icon in iconMap ? iconMap[tool.icon] : Rocket;
          
          return (
            <Button
              key={index}
              variant="outline"
              className="h-auto py-3 flex flex-col items-center justify-center text-center gap-2 hover:bg-wakti-blue/5 hover:border-wakti-blue/20"
              onClick={() => onToolClick(tool.description)}
            >
              <IconComponent className="h-5 w-5 text-wakti-blue mb-1" />
              <div>
                <p className="font-medium text-sm">{tool.name}</p>
                <p className="text-xs text-muted-foreground">{tool.description}</p>
              </div>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
};
