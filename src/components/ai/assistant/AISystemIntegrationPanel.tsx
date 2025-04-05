
import React from 'react';
import { Button } from "@/components/ui/button";
import { AIAssistantRole } from "@/types/ai-assistant.types";
import { 
  CalendarCheck, 
  Users, 
  BarChart, 
  BookOpen, 
  BriefcaseBusiness,
  ListChecks,
  MessageSquare
} from "lucide-react";

interface AISystemIntegrationPanelProps {
  selectedRole: AIAssistantRole;
  onExampleClick: (example: string) => void;
}

export const AISystemIntegrationPanel: React.FC<AISystemIntegrationPanelProps> = ({
  selectedRole,
  onExampleClick
}) => {
  const businessExamples = [
    { text: "Show my staff status", icon: <Users className="h-4 w-4 mr-2" /> },
    { text: "View my business analytics", icon: <BarChart className="h-4 w-4 mr-2" /> },
    { text: "Check upcoming bookings", icon: <CalendarCheck className="h-4 w-4 mr-2" /> },
    { text: "Create a task for my team", icon: <ListChecks className="h-4 w-4 mr-2" /> },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 rounded-md p-3 mb-4 border border-amber-200">
        <p className="text-xs text-amber-800 flex items-center mb-2">
          <BriefcaseBusiness className="h-3.5 w-3.5 mr-1.5" />
          <span className="font-medium">Business Integration</span>
        </p>
        <p className="text-xs text-amber-700">
          The AI can integrate with your WAKTI business features
        </p>
      </div>
      
      <div className="space-y-2">
        {businessExamples.map((example, i) => (
          <Button 
            key={i} 
            variant="ghost" 
            className="w-full justify-start text-xs h-auto py-1.5 px-2"
            onClick={() => onExampleClick(example.text)}
          >
            {example.icon}
            {example.text}
          </Button>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Your business assistant can access your WAKTI business data and integrations.
        </p>
      </div>
    </div>
  );
};
