
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
  List,
  ScrollText,
  Book,
  GraduationCap,
  Mail,
  MessageCircle,
  Pen,
  Code
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
  // Define role-specific unique tools
  const getRoleSpecificTools = () => {
    switch (selectedRole) {
      case 'general':
        return [
          { name: "Task Planner", description: "Help me plan my tasks for today", icon: "CheckSquare" },
          { name: "Reminder", description: "Set a reminder for an important event", icon: "Calendar" },
          { name: "Notes", description: "Help me write notes about this topic", icon: "FileText" },
          { name: "Schedule", description: "Organize my day schedule", icon: "Clock" }
        ];
      case 'student':
        return [
          { name: "Study Plan", description: "Create a study plan for my exam", icon: "Book" },
          { name: "Assignment", description: "Help me with my assignment", icon: "GraduationCap" },
          { name: "Research", description: "Help me research this topic", icon: "Search" },
          { name: "Notes", description: "Summarize my lecture notes", icon: "FileText" }
        ];
      case 'employee':
      case 'writer':
        return [
          { name: "Email", description: "Help me write a professional email", icon: "Mail" },
          { name: "Content", description: "Create content for my project", icon: "Edit" },
          { name: "Message", description: "Draft a message to my colleague", icon: "MessageCircle" },
          { name: "Creative", description: "Help me write something creative", icon: "Pen" }
        ];
      case 'business_owner':
        return [
          { name: "Analytics", description: "Analyze my business performance", icon: "BarChart" },
          { name: "Team Tasks", description: "Assign tasks to my team", icon: "Users" },
          { name: "Marketing", description: "Help with marketing content", icon: "Lightbulb" },
          { name: "Reports", description: "Generate a business report", icon: "ScrollText" }
        ];
      default:
        return [
          { name: "Task Planner", description: "Help me plan my tasks for today", icon: "CheckSquare" },
          { name: "Notes", description: "Help me write notes about this topic", icon: "FileText" },
          { name: "Reminder", description: "Set a reminder for an important event", icon: "Calendar" },
          { name: "Schedule", description: "Organize my day schedule", icon: "Clock" }
        ];
    }
  };
  
  // Function to get Lucide icon by name
  const getIconByName = (iconName: string) => {
    switch (iconName) {
      case "Calendar": return <Calendar className="h-5 w-5" />;
      case "CheckSquare": return <CheckSquare className="h-5 w-5" />;
      case "FileText": return <FileText className="h-5 w-5" />;
      case "Clock": return <Clock className="h-5 w-5" />;
      case "Users": return <Users className="h-5 w-5" />;
      case "Book": return <Book className="h-5 w-5" />;
      case "GraduationCap": return <GraduationCap className="h-5 w-5" />;
      case "Search": return <Search className="h-5 w-5" />;
      case "Mail": return <Mail className="h-5 w-5" />;
      case "Edit": return <Edit className="h-5 w-5" />;
      case "MessageCircle": return <MessageCircle className="h-5 w-5" />;
      case "Pen": return <Pen className="h-5 w-5" />;
      case "BarChart": return <BarChart className="h-5 w-5" />;
      case "Lightbulb": return <Lightbulb className="h-5 w-5" />;
      case "ScrollText": return <ScrollText className="h-5 w-5" />;
      case "Code": return <Code className="h-5 w-5" />;
      case "ClipboardCheck": return <ClipboardCheck className="h-5 w-5" />;
      case "HelpCircle": return <HelpCircle className="h-5 w-5" />;
      case "BookOpen": return <BookOpen className="h-5 w-5" />;
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

  // Get tools based on role
  const roleTools = getRoleSpecificTools();

  // For the right sidebar panel, display without the card wrapper
  if (compact) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {roleTools.map((tool, index) => (
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

  // Get role title
  const roleTitle = {
    general: "General Tools",
    student: "Study Tools",
    employee: "Creative Tools",
    writer: "Creative Tools",
    business_owner: "Business Tools"
  }[selectedRole] || "Quick Tools";

  // Get role description
  const roleDescription = {
    general: "Everyday productivity and organization",
    student: "Academic and learning assistance",
    employee: "Professional content creation",
    writer: "Professional content creation",
    business_owner: "Business management and analytics"
  }[selectedRole] || "Role-specific tools";

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
          {roleDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3">
        <div className="grid grid-cols-2 gap-2">
          {roleTools.map((tool, index) => (
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
};
