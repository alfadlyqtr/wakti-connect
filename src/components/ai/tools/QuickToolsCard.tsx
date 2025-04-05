
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AIAssistantRole } from "@/types/ai-assistant.types";
import { 
  Calendar, User, BarChart2, CircleDollarSign, 
  BriefcaseBusiness, Brain, MessageSquare, Receipt,
  TrendingUp, Users, ShieldCheck, Settings,
  Mic, FileType, List, Clock, FileText, 
  CheckSquare, Book, GraduationCap, Search, 
  Mail, Edit, MessageCircle, Pen, Code, 
  Lightbulb, ScrollText, BookOpen, HeartHandshake,
  Presentation, FileDigit, Calculator, BookCopy,
  Languages, Award, FileBadge, Highlighter, 
  PencilRuler, LineChart, BellRing, Plane
} from "lucide-react";

interface QuickToolsCardProps {
  selectedRole: AIAssistantRole;
  onToolClick?: (toolDescription: string) => void;
  onToolSelect?: (toolDescription: string) => void;
  compact?: boolean;
  inSidebar?: boolean;
}

export const QuickToolsCard: React.FC<QuickToolsCardProps> = ({
  selectedRole,
  onToolClick,
  onToolSelect,
  compact = false,
  inSidebar = false
}) => {
  // Define role-specific tools - ensure each tool is unique
  const getRoleSpecificTools = () => {
    switch (selectedRole) {
      case 'general':
        return [
          { name: "Task Planner", description: "Plan my daily tasks and priorities", icon: "CheckSquare" },
          { name: "Daily Schedule", description: "Optimize my daily schedule", icon: "Calendar" },
          { name: "Shopping List", description: "Create a shopping list for me", icon: "List" },
          { name: "Travel Planner", description: "Help me plan my upcoming trip", icon: "Plane" },
          { name: "Meeting Planner", description: "Schedule and plan meetings", icon: "Users" },
          { name: "Reminder Setup", description: "Create reminders for important events", icon: "BellRing" },
          { name: "Note Taking", description: "Help me organize my thoughts", icon: "FileText" },
          { name: "Quick Answer", description: "Get fast answers to questions", icon: "Search" }
        ];
      case 'student':
        return [
          { name: "Study Plan", description: "Create a study plan for my exams", icon: "Book" },
          { name: "Research Help", description: "Help with research for my paper", icon: "Search" },
          { name: "Note Summarizer", description: "Summarize my lecture notes", icon: "FileText" },
          { name: "Exam Prep", description: "Prepare for upcoming exams", icon: "GraduationCap" },
          { name: "Bibliography", description: "Format citations for my paper", icon: "BookCopy" },
          { name: "Math Solver", description: "Help solve math problems", icon: "Calculator" },
          { name: "Language Helper", description: "Translation and language assistance", icon: "Languages" },
          { name: "Study Schedule", description: "Organize my study sessions", icon: "Calendar" }
        ];
      case 'employee':
      case 'writer':
        return [
          { name: "Email Assistant", description: "Draft professional emails", icon: "Mail" },
          { name: "Content Creator", description: "Generate creative content", icon: "Edit" },
          { name: "Script Writer", description: "Help write scripts for presentations", icon: "Pen" },
          { name: "Blog Post", description: "Create blog post outlines", icon: "FileDigit" },
          { name: "Social Media", description: "Draft engaging social media posts", icon: "Presentation" },
          { name: "Proofreading", description: "Proofread and improve my text", icon: "Highlighter" },
          { name: "Copywriting", description: "Create persuasive marketing copy", icon: "ScrollText" },
          { name: "Creative Writing", description: "Write stories and creative pieces", icon: "Lightbulb" }
        ];
      case 'business_owner':
        return [
          { name: "Analytics", description: "Analyze my business performance", icon: "BarChart2" },
          { name: "Staff Management", description: "Optimize team assignments", icon: "Users" },
          { name: "Marketing", description: "Create marketing materials", icon: "Lightbulb" },
          { name: "Financial Report", description: "Summarize financial data", icon: "CircleDollarSign" },
          { name: "Customer Insights", description: "Analyze customer feedback data", icon: "LineChart" },
          { name: "Service Proposal", description: "Draft service proposals", icon: "FileBadge" },
          { name: "Business Plan", description: "Develop business strategies", icon: "BriefcaseBusiness" },
          { name: "Operations", description: "Optimize business operations", icon: "Settings" }
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
      case "BarChart2": return <BarChart2 className="h-5 w-5" />;
      case "Lightbulb": return <Lightbulb className="h-5 w-5" />;
      case "ScrollText": return <ScrollText className="h-5 w-5" />;
      case "Code": return <Code className="h-5 w-5" />;
      case "BriefcaseBusiness": return <BriefcaseBusiness className="h-5 w-5" />;
      case "CircleDollarSign": return <CircleDollarSign className="h-5 w-5" />;
      case "TrendingUp": return <TrendingUp className="h-5 w-5" />;
      case "Receipt": return <Receipt className="h-5 w-5" />;
      case "Brain": return <Brain className="h-5 w-5" />;
      case "ShieldCheck": return <ShieldCheck className="h-5 w-5" />;
      case "BookOpen": return <BookOpen className="h-5 w-5" />;
      case "HeartHandshake": return <HeartHandshake className="h-5 w-5" />;
      case "Settings": return <Settings className="h-5 w-5" />;
      case "Mic": return <Mic className="h-5 w-5" />;
      case "FileType": return <FileType className="h-5 w-5" />;
      case "List": return <List className="h-5 w-5" />;
      case "Presentation": return <Presentation className="h-5 w-5" />;
      case "FileDigit": return <FileDigit className="h-5 w-5" />;
      case "Calculator": return <Calculator className="h-5 w-5" />;
      case "BookCopy": return <BookCopy className="h-5 w-5" />;
      case "Languages": return <Languages className="h-5 w-5" />;
      case "Award": return <Award className="h-5 w-5" />;
      case "FileBadge": return <FileBadge className="h-5 w-5" />;
      case "Highlighter": return <Highlighter className="h-5 w-5" />;
      case "PencilRuler": return <PencilRuler className="h-5 w-5" />;
      case "LineChart": return <LineChart className="h-5 w-5" />;
      case "BellRing": return <BellRing className="h-5 w-5" />;
      case "Plane": return <Plane className="h-5 w-5" />;
      default: return <Brain className="h-5 w-5" />;
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

  // Get all tools based on role
  const allRoleTools = getRoleSpecificTools();
  
  // For sidebar view, display specific tools
  // For sidebar, display a different set of tools than the main panel to avoid duplicates
  const roleTools = inSidebar 
    ? allRoleTools.slice(4, 8)  // Use second set of tools for sidebar
    : allRoleTools.slice(0, 6); // Use first set of tools for main panel

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
    general: "Productivity Tools",
    student: "Academic Tools",
    employee: "Creative Tools",
    writer: "Creative Tools",
    business_owner: "Business Tools"
  }[selectedRole] || "Quick Tools";

  // Get role description
  const roleDescription = {
    general: "Everyday planning and organization",
    student: "Study and academic assistance",
    employee: "Content creation and professional writing",
    writer: "Content creation and professional writing",
    business_owner: "Business analytics and management"
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
            <BarChart2 className="h-4 w-4" />
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
