
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { AIAssistantRole, RoleContexts } from '@/types/ai-assistant.types';
import { AISystemIntegrationPanel } from './AISystemIntegrationPanel';

interface QuickPrompt {
  text: string;
  icon: React.ReactNode;
}

interface EmptyStateViewProps {
  selectedRole: AIAssistantRole;
  onPromptClick: (prompt: string) => void;
}

export const EmptyStateView: React.FC<EmptyStateViewProps> = ({ selectedRole, onPromptClick }) => {
  const roleInfo = RoleContexts[selectedRole];
  
  // Generate role-specific quick prompts
  const getQuickPrompts = (): QuickPrompt[] => {
    const basePrompts: QuickPrompt[] = [
      {
        text: "What can you help me with?",
        icon: <MessageCircle className="h-4 w-4" />
      }
    ];
    
    // Add role-specific prompts if available
    if (roleInfo.commandSuggestions && roleInfo.commandSuggestions.length > 0) {
      roleInfo.commandSuggestions.forEach(suggestion => {
        basePrompts.push({
          text: suggestion,
          icon: <MessageCircle className="h-4 w-4" />
        });
      });
    }
    
    return basePrompts.slice(0, 4); // Limit to 4 prompts
  };
  
  const quickPrompts = getQuickPrompts();
  
  return (
    <div className="flex flex-col gap-6">
      <Card className="bg-gradient-to-br from-wakti-blue/5 to-blue-50/50 shadow-sm border-wakti-blue/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            {roleInfo.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            {roleInfo.description}. I can help you manage tasks, schedule events, and boost your productivity.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {quickPrompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start h-auto py-2"
                onClick={() => onPromptClick(prompt.text)}
              >
                {prompt.icon}
                <span className="ml-2 text-sm">{prompt.text}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* System integration panel to showcase WAKTI system capabilities */}
      <AISystemIntegrationPanel
        selectedRole={selectedRole}
        onExampleClick={onPromptClick}
      />
    </div>
  );
};
