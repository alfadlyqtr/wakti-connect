
import React from 'react';
import { Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAISettings } from '@/components/settings/ai/context/AISettingsContext';

interface EmptyStateViewProps {
  onPromptClick: (prompt: string) => void;
}

export const EmptyStateView: React.FC<EmptyStateViewProps> = ({ onPromptClick }) => {
  const { settings } = useAISettings();
  
  // Get role-specific suggestions
  const getSuggestions = () => {
    // Default suggestions for everyone
    const defaultSuggestions = [
      "Help me organize my day",
      "Create a to-do list for me",
      "Draft an email to a client",
      "Create a professional email signature for me"
    ];
    
    // Check for specific roles/modes
    if (settings?.user_role === "student" || settings?.assistant_mode === "tutor") {
      return [
        "Help me create a study schedule",
        "Explain this concept to me: [topic]",
        "Help me organize my assignments",
        "Create a study guide for my upcoming exam"
      ];
    }
    
    if (settings?.user_role === "business_owner" || settings?.assistant_mode === "business_manager") {
      return [
        "Draft a follow-up email to a customer",
        "Create a staff announcement",
        "Help me organize my business tasks",
        "Generate marketing content for my business"
      ];
    }
    
    if (settings?.assistant_mode === "content_creator") {
      return [
        "Help me write a professional email",
        "Draft a response to this customer inquiry",
        "Create content for my social media page",
        "Generate a business proposal outline"
      ];
    }
    
    if (settings?.assistant_mode === "project_manager") {
      return [
        "Help me organize this project timeline",
        "Create a project status update email",
        "Draft a meeting agenda for my team",
        "Help me prioritize these tasks"
      ];
    }
    
    return defaultSuggestions;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6 text-center px-4 py-8">
      <div className="bg-primary/10 p-3 rounded-full">
        <Bot className="h-10 w-10 text-primary" />
      </div>
      
      <div className="space-y-2">
        <h3 className="font-semibold text-xl">Welcome to WAKTI AI</h3>
        <p className="text-muted-foreground text-sm max-w-md">
          Your personal AI assistant for all your productivity needs. Ask me anything about tasks, appointments, or how I can help you!
        </p>
      </div>
      
      <div className="space-y-2 w-full max-w-md">
        <p className="text-sm font-medium">Try asking me:</p>
        <div className="grid grid-cols-1 gap-2">
          {getSuggestions().map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              className="justify-start text-left h-auto py-3 px-4"
              onClick={() => onPromptClick(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
