
import React from 'react';
import { Bot } from 'lucide-react';
import { SuggestionPrompts } from './SuggestionPrompts';
import { AIAssistantRole } from '@/types/ai-assistant.types';

export interface EmptyStateViewProps {
  onPromptClick: (prompt: string) => void;
  selectedRole: AIAssistantRole;
}

export const EmptyStateView: React.FC<EmptyStateViewProps> = ({ onPromptClick, selectedRole }) => {
  // Role-specific welcome messages
  const roleMessages = {
    student: "Need help with assignments or study planning?",
    employee: "Looking to boost your productivity at work?",
    writer: "Need inspiration or writing assistance?",
    business_owner: "Need help managing your business operations?",
    general: "How can I help you today?"
  };

  // Role-specific descriptions
  const roleDescriptions = {
    student: "Ask me about homework, assignments, study plans, or any academic tasks. I'm here to help you learn and excel.",
    employee: "Ask me to help organize tasks, draft emails, manage your schedule, or optimize your workflow.",
    writer: "Ask me for help with ideas, outlines, editing, or overcoming writer's block. I'm here to support your creative process.",
    business_owner: "Ask me about operations, customer communications, service management, or business analytics.",
    general: "Ask me anything about tasks, scheduling, or your business. I'm here to make your workflow easier."
  };

  return (
    <div className="h-full flex flex-col">
      <div className="text-center my-8 animate-fade-in">
        <div className="w-16 h-16 bg-wakti-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <Bot className="w-8 h-8 text-wakti-blue" />
        </div>
        <h3 className="mt-4 text-lg font-medium">
          {roleMessages[selectedRole]}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
          {roleDescriptions[selectedRole]}
        </p>
      </div>
      
      <SuggestionPrompts onPromptClick={onPromptClick} selectedRole={selectedRole} />
    </div>
  );
};
