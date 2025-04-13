
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AIAssistantRole, RoleContexts } from "@/types/ai-assistant.types";
import { 
  Calendar, Check, CheckSquare, Lightbulb, BookOpen, BarChart, 
  Users, Search, FileText, Edit, Mic, HelpCircle, HeartHandshake, Settings 
} from "lucide-react";

interface QuickToolsCardProps {
  selectedRole: AIAssistantRole;
  onToolSelect?: (example: string) => void;
  onToolClick?: (example: string) => void;
  inSidebar?: boolean;
}

export const QuickToolsCard: React.FC<QuickToolsCardProps> = ({
  selectedRole,
  onToolSelect,
  onToolClick,
  inSidebar = false
}) => {
  // Get quick tools for the current role
  const quickTools = RoleContexts[selectedRole]?.quickTools || [];
  
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Calendar": return <Calendar className="h-4 w-4" />;
      case "CheckSquare": return <CheckSquare className="h-4 w-4" />;
      case "Lightbulb": return <Lightbulb className="h-4 w-4" />;
      case "BookOpen": return <BookOpen className="h-4 w-4" />;
      case "HelpCircle": return <HelpCircle className="h-4 w-4" />;
      case "BarChart": return <BarChart className="h-4 w-4" />;
      case "Users": return <Users className="h-4 w-4" />;
      case "Search": return <Search className="h-4 w-4" />;
      case "FileText": return <FileText className="h-4 w-4" />;
      case "Edit": return <Edit className="h-4 w-4" />;
      case "Mic": return <Mic className="h-4 w-4" />;
      case "HeartHandshake": return <HeartHandshake className="h-4 w-4" />;
      case "Settings": return <Settings className="h-4 w-4" />;
      default: return <Check className="h-4 w-4" />;
    }
  };

  // Create example prompts based on the role
  const getPromptForTool = (toolName: string): string => {
    switch (toolName) {
      case "Study Planner": return "Create a study plan for my upcoming exams";
      case "Note Summarizer": return "Help me summarize this chapter's key points";
      case "Research Assistant": return "Find academic sources about climate change";
      case "Concept Explainer": return "Explain quantum physics in simple terms";
      
      case "Staff Scheduler": return "Help me organize staff shifts for next week";
      case "Business Analytics": return "What trends do you see in my recent business data?";
      case "Customer Service": return "Draft a response to this customer complaint";
      case "Service Manager": return "Suggest ways to improve my booking process";
      
      case "Day Planner": return "Help me organize my day efficiently";
      case "Task Creator": return "Create a task list for my home renovation project";
      case "Quick Answer": return "What's the best way to improve productivity?";
      case "Idea Generator": return "Generate ideas for my weekend family activities";
      
      case "Email Composer": return "Draft a professional email to my client";
      case "Content Creator": return "Help me write a blog post about productivity";
      case "Creative Writing": return "Write a short story about space exploration";
      case "Meeting Organizer": return "Create an agenda for my team meeting tomorrow";
      
      case "Content Generator": return "Give me ideas for my next blog post";
      case "Editor Helper": return "Help me improve this paragraph";
      case "Writing Scheduler": return "Create a writing schedule for my book project";
      case "Research Tool": return "Find information about historical fiction writing";
      
      default: return `Help me with ${toolName}`;
    }
  };

  if (inSidebar) {
    return (
      <div className="space-y-3">
        {quickTools.map((tool: any, index: number) => (
          <Button 
            key={index} 
            variant="ghost" 
            className="w-full justify-start text-xs h-auto py-1.5 px-2"
            onClick={() => onToolClick?.(getPromptForTool(tool.name))}
          >
            {getIconComponent(tool.icon)}
            <span className="ml-2 truncate">{tool.name}</span>
          </Button>
        ))}
        
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            These tools are designed to help with your 
            {selectedRole === "general" ? " daily tasks" : 
             selectedRole === "student" ? " studies" :
             selectedRole === "business_owner" ? " business" :
             " work"}
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Quick Tools</CardTitle>
        <CardDescription>
          {selectedRole === "student" ? "Study and learning tools" : 
           selectedRole === "business_owner" ? "Business management tools" :
           selectedRole === "employee" || selectedRole === "writer" ? "Work and creative tools" :
           "Tools to help you be more productive"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quickTools.map((tool: any, index: number) => (
            <Button 
              key={index} 
              variant="outline" 
              className="h-auto flex-col items-start p-4 justify-start text-left"
              onClick={() => onToolSelect?.(getPromptForTool(tool.name))}
            >
              <div className="flex items-center mb-2">
                {getIconComponent(tool.icon)}
                <span className="ml-2 font-medium">{tool.name}</span>
              </div>
              <p className="text-xs text-muted-foreground">{tool.description}</p>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
