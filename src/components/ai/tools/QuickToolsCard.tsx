
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AIAssistantRole, RoleContexts } from "@/types/ai-assistant.types";
import { 
  Calendar, Check, CheckSquare, Lightbulb, BookOpen, BarChart, 
  Users, Search, FileText, Edit, Mic, HelpCircle, HeartHandshake, Settings 
} from "lucide-react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  
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
      case "Study Planner": return t("ai.tools.quick.studyPlanner");
      case "Note Summarizer": return t("ai.tools.quick.noteSummarizer");
      case "Research Assistant": return t("ai.tools.quick.researchAssistant");
      case "Concept Explainer": return t("ai.tools.quick.conceptExplainer");
      
      case "Staff Scheduler": return t("ai.tools.quick.staffScheduler");
      case "Business Analytics": return t("ai.tools.quick.businessAnalytics");
      case "Customer Service": return t("ai.tools.quick.customerService");
      case "Service Manager": return t("ai.tools.quick.serviceManager");
      
      case "Day Planner": return t("ai.tools.quick.dayPlanner");
      case "Task Creator": return t("ai.tools.quick.taskCreator");
      case "Quick Answer": return t("ai.tools.quick.quickAnswer");
      case "Idea Generator": return t("ai.tools.quick.ideaGenerator");
      
      case "Email Composer": return t("ai.tools.quick.emailComposer");
      case "Content Creator": return t("ai.tools.quick.contentCreator");
      case "Creative Writing": return t("ai.tools.quick.creativeWriting");
      case "Meeting Organizer": return t("ai.tools.quick.meetingOrganizer");
      
      case "Content Generator": return t("ai.tools.quick.contentGenerator");
      case "Editor Helper": return t("ai.tools.quick.editorHelper");
      case "Writing Scheduler": return t("ai.tools.quick.writingScheduler");
      case "Research Tool": return t("ai.tools.quick.researchTool");
      
      default: return `${toolName}`;
    }
  };

  if (inSidebar) {
    return (
      <div className="space-y-3">
        {quickTools.map((tool, index) => (
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
            {selectedRole === "student" ? t("ai.tools.quick.suggestedTools")
             : selectedRole === "business_owner" ? t("ai.tools.quick.suggestedTools")
             : selectedRole === "employee" ? t("ai.tools.quick.suggestedTools")
             : selectedRole === "writer" ? t("ai.tools.quick.suggestedTools")
             : t("ai.tools.quick.suggestedTools")}
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>{t("ai.tools.quick.title")}</CardTitle>
        <CardDescription>
          {selectedRole === "student" ? t("ai.tools.quick.suggestedTools")
           : selectedRole === "business_owner" ? t("ai.tools.quick.suggestedTools")
           : selectedRole === "employee" || selectedRole === "writer" ? t("ai.tools.quick.suggestedTools")
           : t("ai.tools.quick.suggestedTools")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quickTools.map((tool, index) => (
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
