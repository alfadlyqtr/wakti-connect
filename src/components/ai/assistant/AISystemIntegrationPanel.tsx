
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarClock, MessageSquare, BriefcaseBusiness, FileText } from 'lucide-react';
import { AIAssistantRole } from '@/types/ai-assistant.types';

interface AISystemIntegrationPanelProps {
  selectedRole: AIAssistantRole;
  onExampleClick: (text: string) => void;
}

export const AISystemIntegrationPanel: React.FC<AISystemIntegrationPanelProps> = ({
  selectedRole,
  onExampleClick
}) => {
  // Examples based on role
  const getRoleExamples = (): {icon: React.ReactNode; text: string; example: string}[] => {
    const baseExamples = [
      {
        icon: <MessageSquare className="h-4 w-4" />,
        text: 'Chat with the assistant',
        example: 'How can you help me with my business?'
      }
    ];
    
    switch (selectedRole) {
      case 'student':
        return [
          ...baseExamples,
          {
            icon: <FileText className="h-4 w-4" />,
            text: 'Get help with studying',
            example: 'Help me create a study plan for my exam next week'
          }
        ];
      case 'employee':
      case 'writer':
        return [
          ...baseExamples,
          {
            icon: <FileText className="h-4 w-4" />,
            text: 'Create professional content',
            example: 'Help me draft an email to my team about the upcoming project'
          }
        ];
      case 'business_owner':
        return [
          ...baseExamples,
          {
            icon: <BriefcaseBusiness className="h-4 w-4" />,
            text: 'Business operations',
            example: 'What strategies can I use to improve customer retention?'
          }
        ];
      default:
        return [
          ...baseExamples,
          {
            icon: <CalendarClock className="h-4 w-4" />,
            text: 'Schedule management',
            example: 'Help me organize my tasks for the week'
          }
        ];
    }
  };
  
  const examples = getRoleExamples();
  
  return (
    <Card className="bg-muted/30 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">WAKTI System Integration</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          Your AI assistant can interact with various WAKTI systems to provide comprehensive assistance.
        </p>
        
        <div className="space-y-3">
          {examples.map((example, index) => (
            <Button
              key={index}
              variant="outline"
              className="justify-start w-full text-left h-auto py-2"
              onClick={() => onExampleClick(example.example)}
            >
              {example.icon}
              <span className="ml-2 text-sm">{example.text}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
