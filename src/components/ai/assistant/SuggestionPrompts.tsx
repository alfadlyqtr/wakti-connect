
import React from 'react';
import { Button } from '@/components/ui/button';
import { AIAssistantRole } from '@/types/ai-assistant.types';

export interface SuggestionPromptsProps {
  onPromptClick: (prompt: string) => void;
  selectedRole: AIAssistantRole;
}

export const SuggestionPrompts: React.FC<SuggestionPromptsProps> = ({ onPromptClick, selectedRole }) => {
  // Role-specific suggested prompts
  const roleSuggestedPrompts = {
    student: [
      "Help me create a study plan for my upcoming exam",
      "Can you explain this math problem to me?",
      "I need help with my essay on American history",
      "How do I structure a research paper?",
      "Help me summarize this chapter for my notes",
      "What are some effective study techniques?"
    ],
    employee: [
      "Draft an email to reschedule a meeting",
      "Help me prioritize my tasks for today",
      "I need to prepare for a presentation",
      "Create a weekly schedule template for me",
      "What's an efficient way to organize my digital files?",
      "Help me write meeting notes from these bullet points"
    ],
    writer: [
      "I'm experiencing writer's block, can you help?",
      "Help me develop this character concept",
      "Can you suggest a plot outline for my story?",
      "How can I improve this paragraph?",
      "Suggest some creative writing prompts",
      "Help me write a compelling blog introduction"
    ],
    business_owner: [
      "Draft a response to a customer inquiry",
      "Help me organize my staff tasks better",
      "Create a template for appointment reminders",
      "What metrics should I track for my business?",
      "How can I improve my booking process?",
      "Draft a professional service description"
    ],
    general: [
      "How can I make my tasks more organized?",
      "Help me create a booking schedule for next week",
      "Show me my upcoming deadlines",
      "Tips for managing my team better",
      "How do I use the calendar feature?",
      "Create a task for website redesign"
    ]
  };

  const suggestedPrompts = roleSuggestedPrompts[selectedRole];

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
