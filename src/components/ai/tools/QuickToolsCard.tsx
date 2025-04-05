
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AIAssistantRole, RoleContexts } from "@/types/ai-assistant.types";
import { 
  Calendar, 
  CheckSquare, 
  FileText, 
  HelpCircle, 
  Users, 
  Clock, 
  ClipboardCheck, 
  Lightbulb, 
  Edit, 
  Search, 
  BookOpen, 
  BarChart, 
  HeartHandshake, 
  Settings,
  Mic,
  FileType,
  List
} from "lucide-react";

interface QuickToolsCardProps {
  selectedRole: AIAssistantRole;
  onToolClick?: (toolDescription: string) => void;
  onToolSelect?: (toolDescription: string) => void;
  compact?: boolean;
}

export const QuickToolsCard: React.FC<QuickToolsCardProps> = ({
  selectedRole,
  onToolClick,
  onToolSelect,
  compact = false
}) => {
  const roleContext = RoleContexts[selectedRole];
  
  // Function to get Lucide icon by name
  const getIconByName = (iconName: string) => {
    switch (iconName) {
      case "Calendar": return <Calendar className="h-5 w-5" />;
      case "CheckSquare": return <CheckSquare className="h-5 w-5" />;
      case "FileText": return <FileText className="h-5 w-5" />;
      case "HelpCircle": return <HelpCircle className="h-5 w-5" />;
      case "Users": return <Users className="h-5 w-5" />;
      case "Clock": return <Clock className="h-5 w-5" />;
      case "ClipboardCheck": return <ClipboardCheck className="h-5 w-5" />;
      case "Lightbulb": return <Lightbulb className="h-5 w-5" />;
      case "Edit": return <Edit className="h-5 w-5" />;
      case "Search": return <Search className="h-5 w-5" />;
      case "BookOpen": return <BookOpen className="h-5 w-5" />;
      case "BarChart": return <BarChart className="h-5 w-5" />;
      case "HeartHandshake": return <HeartHandshake className="h-5 w-5" />;
      case "Settings": return <Settings className="h-5 w-5" />;
      case "Mic": return <Mic className="h-5 w-5" />;
      case "FileType": return <FileType className="h-5 w-5" />;
      case "List": return <List className="h-5 w-5" />;
      default: return <HelpCircle className="h-5 w-5" />;
    }
  };

  const handleToolClicked = (description: string) => {
    if (onToolClick) {
      onToolClick(description);
    }
    if (onToolSelect) {
      onToolSelect(description);
    }
  };

  if (!roleContext.quickTools || roleContext.quickTools.length === 0) {
    return null;
  }

  const roleTitle = {
    general: "Productivity Tools",
    student: "Study Tools",
    employee: "Creative Tools",
    writer: "Writing Tools",
    business_owner: "Business Tools"
  }[selectedRole] || "Quick Tools";

  // For the right sidebar panel, display without the card wrapper
  if (compact) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {roleContext.quickTools.slice(0, 4).map((tool, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="h-auto py-2 px-3 flex flex-col items-center justify-center text-center"
            onClick={() => handleToolClicked(tool.description)}
          >
            <div className="text-wakti-blue mb-1">
              {getIconByName(tool.icon)}
            </div>
            <span className="text-xs font-medium">{tool.name}</span>
          </Button>
        ))}
      </div>
    );
  }

  // For the full card view
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          {selectedRole === "student" ? (
            <BookOpen className="h-4 w-4" />
          ) : selectedRole === "employee" || selectedRole === "writer" ? (
            <Edit className="h-4 w-4" />
          ) : selectedRole === "business_owner" ? (
            <BarChart className="h-4 w-4" />
          ) : (
            <CheckSquare className="h-4 w-4" />
          )}
          {roleTitle}
        </CardTitle>
        <CardDescription className="text-xs">
          Role-specific tools for {roleContext.title.toLowerCase()}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3">
        <div className="grid grid-cols-2 gap-2">
          {roleContext.quickTools.map((tool, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="h-auto py-2 px-3 flex flex-col items-center justify-center text-center"
              onClick={() => handleToolClicked(tool.description)}
            >
              <div className="text-wakti-blue mb-1">
                {getIconByName(tool.icon)}
              </div>
              <span className="text-xs font-medium">{tool.name}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
