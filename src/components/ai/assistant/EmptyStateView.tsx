
import React from 'react';
import { Bot } from 'lucide-react';
import { SuggestionPrompts } from './SuggestionPrompts';

export interface EmptyStateViewProps {
  onPromptClick: (prompt: string) => void;
}

export const EmptyStateView: React.FC<EmptyStateViewProps> = ({ onPromptClick }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="text-center my-8 animate-fade-in">
        <div className="w-16 h-16 bg-wakti-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <Bot className="w-8 h-8 text-wakti-blue" />
        </div>
        <h3 className="mt-4 text-lg font-medium">
          How can I help you today?
        </h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
          Ask me anything about tasks, scheduling, or your business. I'm here to make your workflow easier.
        </p>
      </div>
      
      <SuggestionPrompts onPromptClick={onPromptClick} />
    </div>
  );
};
