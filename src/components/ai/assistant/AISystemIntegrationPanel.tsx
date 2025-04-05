
import React from 'react';
import { Button } from "@/components/ui/button";
import { AIAssistantRole } from "@/types/ai-assistant.types";
import { PanelTopOpen, UsersRound, BarChart, Calendar, ClipboardList } from 'lucide-react';

interface AISystemIntegrationPanelProps {
  selectedRole: AIAssistantRole;
  onExampleClick: (example: string) => void;
}

export const AISystemIntegrationPanel: React.FC<AISystemIntegrationPanelProps> = ({
  selectedRole,
  onExampleClick
}) => {
  // Business-specific examples
  const businessExamples = [
    "Show me my staff attendance for this week",
    "Create a new service called 'Premium Consultation' that costs QAR 200",
    "What's my business performance like this month?",
    "Summarize my customer feedback from the last month"
  ];
  
  // General WAKTI information examples
  const waktiInfoExamples = [
    "What features are included in the Business plan?", 
    "What makes WAKTI different from other task managers?",
    "Can you explain the pricing of WAKTI plans?",
    "Tell me about WAKTI's task management system"
  ];
  
  // Show business examples for business role, WAKTI info for others
  const examples = selectedRole === "business_owner" ? businessExamples : waktiInfoExamples;
  
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
        <PanelTopOpen className="h-3.5 w-3.5" />
        <span>Try these examples</span>
      </div>
      
      <div className="space-y-2">
        {examples.map((example, index) => (
          <Button
            key={index}
            variant="ghost"
            className="text-xs justify-start w-full h-auto py-2 px-2.5"
            onClick={() => onExampleClick(example)}
          >
            {example}
          </Button>
        ))}
      </div>
      
      <div className="pt-2 border-t mt-3">
        <p className="text-xs text-muted-foreground">
          The AI assistant knows all about WAKTI's features, plans, and capabilities.
        </p>
      </div>
    </div>
  );
};
