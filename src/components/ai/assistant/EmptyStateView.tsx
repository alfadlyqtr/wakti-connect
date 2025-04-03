
import React from "react";
import { Bot, Sparkles } from "lucide-react";
import { AIAssistantRole, RoleContexts } from "@/types/ai-assistant.types";
import { SuggestionPrompts } from "./SuggestionPrompts";

interface EmptyStateViewProps {
  onPromptClick: (prompt: string) => void;
  selectedRole: AIAssistantRole;
}

export const EmptyStateView: React.FC<EmptyStateViewProps> = ({ 
  onPromptClick,
  selectedRole
}) => {
  // Get role-specific colors
  const getRoleColor = () => {
    switch (selectedRole) {
      case 'student': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'professional': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'creator': return 'text-green-600 bg-green-50 border-green-200';
      case 'business_owner': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-wakti-blue bg-wakti-blue/5 border-wakti-blue/20';
    }
  };
  
  const getRoleTitle = () => {
    switch (selectedRole) {
      case 'student': return 'Study';
      case 'professional': return 'Work';
      case 'creator': return 'Creator';
      case 'business_owner': return 'Business';
      default: return 'WAKTI';
    }
  };
  
  return (
    <div className="flex flex-col justify-between h-full">
      <div className="text-center my-8 px-4">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-wakti-blue to-wakti-blue/80 mb-4">
          <Bot className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Your {getRoleTitle()} Assistant</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          {RoleContexts[selectedRole].description}
        </p>
        
        <div className={`mt-6 p-4 rounded-lg ${getRoleColor()} inline-flex items-center`}>
          <Sparkles className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">
            {selectedRole === 'student' ? 'Optimized for academic success' :
             selectedRole === 'professional' ? 'Focused on your productivity' :
             selectedRole === 'creator' ? 'Built for creative excellence' :
             selectedRole === 'business_owner' ? 'Tailored for business growth' :
             'Designed to help with anything'}
          </span>
        </div>
      </div>
      
      <div className="mt-auto">
        <h4 className="font-medium text-sm mb-3 text-center">Try asking something like:</h4>
        <SuggestionPrompts onPromptClick={onPromptClick} selectedRole={selectedRole} />
      </div>
    </div>
  );
};
