
import React from 'react';
import { Button } from '@/components/ui/button';
import { AIAssistantRole, RoleContexts } from '@/types/ai-assistant.types';

export interface SuggestionPromptsProps {
  onPromptClick: (prompt: string) => void;
  selectedRole: AIAssistantRole;
}

export const SuggestionPrompts: React.FC<SuggestionPromptsProps> = ({ onPromptClick, selectedRole }) => {
  // Get the appropriate suggestions from RoleContexts
  const promptsData = RoleContexts[selectedRole];
  
  // Handle property access safely - first try suggestedPrompts, then fallback to commandSuggestions
  const suggestedPrompts = promptsData.suggestedPrompts || 
                          promptsData.commandSuggestions || 
                          [];

  return (
    <div className="grid grid-cols-1 gap-3 mt-auto mb-4 max-w-full">
      {suggestedPrompts.map((prompt, index) => (
        <Button
          key={index}
          variant="outline"
          className="justify-start text-left h-auto py-3 px-4 text-sm hover:bg-wakti-blue/10 hover:border-wakti-blue/30 transition-all w-full overflow-hidden text-ellipsis whitespace-normal break-words"
          onClick={() => onPromptClick(prompt)}
          style={{ 
            animationDelay: `${index * 100}ms`,
            animation: 'fade-in 0.5s ease-out forwards',
            minHeight: '60px'
          }}
        >
          {prompt}
        </Button>
      ))}
    </div>
  );
};
