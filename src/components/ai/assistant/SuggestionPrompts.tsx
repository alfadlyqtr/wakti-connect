
import React from 'react';
import { Button } from '@/components/ui/button';
import { AIAssistantRole, RoleContexts } from '@/types/ai-assistant.types';

export interface SuggestionPromptsProps {
  onPromptClick: (prompt: string) => void;
  selectedRole: AIAssistantRole;
}

export const SuggestionPrompts: React.FC<SuggestionPromptsProps> = ({ onPromptClick, selectedRole }) => {
  // Get the appropriate suggestions from RoleContexts
  // First try suggestedPrompts, fall back to suggestions if needed
  const promptsData = RoleContexts[selectedRole];
  const suggestedPrompts = promptsData.suggestedPrompts || promptsData.suggestions || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-auto mb-4">
      {suggestedPrompts.map((prompt, index) => (
        <Button
          key={index}
          variant="outline"
          className="justify-start text-left h-auto py-3 px-4 text-sm hover:bg-wakti-blue/10 hover:border-wakti-blue/30 transition-all"
          onClick={() => onPromptClick(prompt)}
          style={{ 
            animationDelay: `${index * 100}ms`,
            animation: 'fade-in 0.5s ease-out forwards'
          }}
        >
          {prompt}
        </Button>
      ))}
    </div>
  );
};
