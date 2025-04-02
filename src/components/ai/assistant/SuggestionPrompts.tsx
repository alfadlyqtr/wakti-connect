
import React from 'react';
import { Button } from '@/components/ui/button';

export interface SuggestionPromptsProps {
  onPromptClick: (prompt: string) => void;
}

export const SuggestionPrompts: React.FC<SuggestionPromptsProps> = ({ onPromptClick }) => {
  const suggestedPrompts = [
    "How can I make my tasks more organized?",
    "Help me create a booking schedule for next week",
    "Show me my upcoming deadlines",
    "Tips for managing my team better",
    "How do I use the calendar feature?",
    "Create a task for website redesign"
  ];

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
