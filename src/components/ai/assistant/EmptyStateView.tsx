
import React from 'react';
import { Bot } from 'lucide-react';
import { SuggestionPrompts } from './SuggestionPrompts';
import { AIAssistantRole, RoleContexts } from '@/types/ai-assistant.types';

export interface EmptyStateViewProps {
  onPromptClick: (prompt: string) => void;
  selectedRole: AIAssistantRole;
}

export const EmptyStateView: React.FC<EmptyStateViewProps> = ({ onPromptClick, selectedRole }) => {
  const roleContext = RoleContexts[selectedRole];

  return (
    <div className="h-full flex flex-col">
      <div className="text-center my-8 animate-fade-in">
        <div className="w-16 h-16 bg-wakti-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <Bot className="w-8 h-8 text-wakti-blue" />
        </div>
        <h3 className="mt-4 text-lg font-medium">
          {roleContext.description}
        </h3>
        
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {roleContext.toolsAvailable.map((tool, index) => (
            <div 
              key={index} 
              className="px-3 py-1 bg-wakti-blue/10 text-wakti-blue text-xs rounded-full"
            >
              {tool}
            </div>
          ))}
        </div>
      </div>
      
      <SuggestionPrompts onPromptClick={onPromptClick} selectedRole={selectedRole} />
    </div>
  );
};
