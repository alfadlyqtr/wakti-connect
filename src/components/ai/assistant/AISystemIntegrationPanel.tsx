
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AIAssistantRole } from '@/types/ai-assistant.types';
import { CalendarClock, ListTodo, BarChart, Users } from 'lucide-react';

interface AISystemIntegrationPanelProps {
  selectedRole: AIAssistantRole;
  onExampleClick: (example: string) => void;
}

export const AISystemIntegrationPanel: React.FC<AISystemIntegrationPanelProps> = ({
  selectedRole,
  onExampleClick
}) => {
  // Define role-specific integration suggestions
  const getBusinessSuggestions = () => [
    {
      title: "Task Management",
      icon: <ListTodo className="h-4 w-4" />,
      examples: [
        "Create a task for staff meeting tomorrow at 10am",
        "Show my pending tasks for this week",
        "Assign a high priority task to Sarah"
      ]
    },
    {
      title: "Scheduling",
      icon: <CalendarClock className="h-4 w-4" />,
      examples: [
        "Schedule a client meeting for Friday",
        "Show my upcoming appointments",
        "Set up a team review for next Monday"
      ]
    },
    {
      title: "Staff Management",
      icon: <Users className="h-4 w-4" />,
      examples: [
        "Review staff performance this month",
        "See which staff are working today",
        "Check staff schedule conflicts"
      ]
    },
    {
      title: "Analytics",
      icon: <BarChart className="h-4 w-4" />,
      examples: [
        "Show me my business growth this quarter",
        "Analyze booking trends for the last month",
        "Compare service popularity metrics"
      ]
    }
  ];

  const integrations = getBusinessSuggestions();

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-2">
        Use the assistant to manage your WAKTI business operations:
      </div>
      
      {integrations.map((integration, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center gap-1 text-xs font-medium">
            {integration.icon}
            <span>{integration.title}</span>
          </div>
          
          <div className="space-y-1">
            {integration.examples.map((example, eIdx) => (
              <Button
                key={eIdx}
                variant="ghost"
                size="sm"
                className="text-xs justify-start w-full h-auto py-1 font-normal text-left"
                onClick={() => onExampleClick(example)}
              >
                {example}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
