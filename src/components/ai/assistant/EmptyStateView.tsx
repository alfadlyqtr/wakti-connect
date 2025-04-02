
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, FileText, Calendar, CheckSquare, PenTool, Mail } from 'lucide-react';

interface EmptyStateViewProps {
  onPromptClick: (prompt: string) => void;
}

export const EmptyStateView: React.FC<EmptyStateViewProps> = ({ onPromptClick }) => {
  const suggestedPrompts = [
    {
      icon: <CheckSquare className="h-5 w-5 text-wakti-blue" />,
      title: "Task Management",
      prompt: "Help me organize my tasks for today",
    },
    {
      icon: <Calendar className="h-5 w-5 text-wakti-blue" />,
      title: "Appointment Planning",
      prompt: "I need to schedule a client meeting next week",
    },
    {
      icon: <PenTool className="h-5 w-5 text-wakti-blue" />,
      title: "Content Creation",
      prompt: "Help me create a business email to follow up with clients",
    },
    {
      icon: <Mail className="h-5 w-5 text-wakti-blue" />,
      title: "Email Signature",
      prompt: "Create a professional email signature for me",
    },
    {
      icon: <FileText className="h-5 w-5 text-wakti-blue" />,
      title: "Document Templates",
      prompt: "I need a template for a business proposal",
    },
    {
      icon: <Bot className="h-5 w-5 text-wakti-blue" />,
      title: "WAKTI Exploration",
      prompt: "What features does WAKTI offer to help with my productivity?",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 gap-6">
      <div className="text-center space-y-2 max-w-md">
        <h2 className="text-xl font-bold">Welcome to WAKTI AI</h2>
        <p className="text-sm text-muted-foreground">
          Your personal AI assistant for tasks, appointments, and productivity. Ask me anything or try one of the suggestions below.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-3xl">
        {suggestedPrompts.map((item, index) => (
          <Card 
            key={index}
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => onPromptClick(item.prompt)}
          >
            <CardContent className="p-4 flex items-start gap-3">
              <div className="mt-0.5">
                {item.icon}
              </div>
              <div>
                <h3 className="font-medium text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{item.prompt}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
