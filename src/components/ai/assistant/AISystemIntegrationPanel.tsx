
import React from 'react';
import { Button } from '@/components/ui/button';
import { AIAssistantRole } from '@/types/ai-assistant.types';
import { Calendar, ClipboardList, Building2, Users, Settings, Heading1 } from 'lucide-react';

interface AISystemIntegrationPanelProps {
  selectedRole: AIAssistantRole;
  onExampleClick: (example: string) => void;
}

export const AISystemIntegrationPanel: React.FC<AISystemIntegrationPanelProps> = ({
  selectedRole,
  onExampleClick
}) => {
  // Example business operations prompts
  const businessExamples = [
    {
      icon: <ClipboardList className="h-3.5 w-3.5" />,
      text: "Create a task to review marketing plan tomorrow at 3pm with high priority"
    },
    {
      icon: <Calendar className="h-3.5 w-3.5" />,
      text: "Schedule a team meeting on Thursday morning about Q2 planning"
    },
    {
      icon: <Users className="h-3.5 w-3.5" />,
      text: "Assign Ali to contact our suppliers about the delayed shipment"
    },
    {
      icon: <Building2 className="h-3.5 w-3.5" />,
      text: "Create a task to prepare the monthly financial report by Friday"
    },
    {
      icon: <Settings className="h-3.5 w-3.5" />,
      text: "Set up a reminder to review staff performance next week"
    }
  ];

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground mb-1">Try these examples:</p>
      <div className="space-y-1.5">
        {businessExamples.map((example, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            className="w-full justify-start text-xs h-auto py-1.5 px-2 rounded-sm font-normal"
            onClick={() => onExampleClick(example.text)}
          >
            <span className="mr-1.5 text-muted-foreground">{example.icon}</span>
            <span className="truncate">{example.text}</span>
          </Button>
        ))}
      </div>
      
      <div className="pt-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-xs"
          onClick={() => onExampleClick("What tasks can you help me create?")}
        >
          <Heading1 className="h-3 w-3 mr-1.5" />
          Learn about smart tasks
        </Button>
      </div>
    </div>
  );
};
