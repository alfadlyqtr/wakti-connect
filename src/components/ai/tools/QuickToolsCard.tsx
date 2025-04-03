
import React from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AIAssistantRole, RoleContexts } from "@/types/ai-assistant.types";
import * as Icons from "lucide-react"; 

interface QuickToolsCardProps {
  selectedRole: AIAssistantRole;
  onToolSelect: (prompt: string) => void;
}

// Dynamic icon component to render icons by name
const DynamicIcon = ({ name }: { name: string }) => {
  const IconComponent = (Icons as any)[name] || Icons.HelpCircle;
  return <IconComponent className="h-5 w-5" />;
};

// Generate tool-specific prompt based on tool name and role
const getToolPrompt = (toolName: string, role: AIAssistantRole): string => {
  const prompts: Record<string, Record<string, string>> = {
    student: {
      "Homework Helper": "I need help with my homework on ",
      "Study Planner": "Create a study plan for me for ",
      "Note Summarizer": "Summarize these notes for me: ",
      "Research Assistant": "Help me research this topic: "
    },
    professional: {
      "Email Composer": "Help me write a professional email about ",
      "Meeting Scheduler": "I need to schedule a meeting for ",
      "Task Prioritizer": "Help me prioritize these tasks: ",
      "Document Creator": "Help me create a document for "
    },
    business_owner: {
      "Staff Scheduler": "Help me create a schedule for my staff for ",
      "Customer Service": "Draft a response to this customer inquiry: ",
      "Business Analytics": "Analyze this business data for me: ",
      "Service Manager": "Help me optimize this service: "
    },
    general: {
      "Day Planner": "Help me plan my day including ",
      "Task Creator": "Create a task list for ",
      "Event Organizer": "Help me organize this event: ",
      "Quick Answer": "I need a quick answer about "
    },
    creator: {
      "Content Generator": "Generate content ideas for ",
      "Content Calendar": "Create a content calendar for ",
      "Caption Writer": "Write a caption for my post about ",
      "Hashtag Generator": "Suggest hashtags for content about "
    },
    employee: {
      "Time Tracker": "Help me track my time for ",
      "Task Reporter": "Help me report these completed tasks: ",
      "Meeting Organizer": "Organize a meeting about ",
      "Work Log": "Create a work log for today including "
    },
    writer: {
      "Email Writer": "Help me write an email about ",
      "Text Editor": "Edit this text for clarity: ",
      "Outline Generator": "Create an outline for ",
      "Grammar Checker": "Check the grammar in this text: "
    }
  };

  // Return default prompt if specific one not found
  return prompts[role]?.[toolName] || "Help me with ";
};

export const QuickToolsCard: React.FC<QuickToolsCardProps> = ({ 
  selectedRole,
  onToolSelect
}) => {
  const roleContext = RoleContexts[selectedRole];
  const quickTools = roleContext.quickTools || [];
  
  const handleToolClick = (toolName: string) => {
    const prompt = getToolPrompt(toolName, selectedRole);
    onToolSelect(prompt);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          Quick Tools
        </CardTitle>
        <CardDescription>
          Get faster assistance with these specialized tools
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        {quickTools.map((tool, index) => (
          <Button
            key={index}
            variant="outline"
            className="flex-col h-auto py-4 justify-start items-center gap-2 bg-muted/40 hover:bg-muted transition-colors"
            onClick={() => handleToolClick(tool.name)}
          >
            <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
              <DynamicIcon name={tool.icon} />
            </div>
            <div className="text-center">
              <h4 className="font-medium text-sm">{tool.name}</h4>
              <p className="text-xs text-muted-foreground">{tool.description}</p>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};
