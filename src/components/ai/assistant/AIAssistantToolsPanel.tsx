
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AIAssistantRole } from '@/types/ai-assistant.types';
import { Briefcase, BookOpen, PenTool, User2, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIAssistantToolsPanelProps {
  selectedRole: AIAssistantRole;
  onSelectRole: (role: AIAssistantRole) => void;
  onOpenRoleProfile?: () => void;
}

export const AIAssistantToolsPanel: React.FC<AIAssistantToolsPanelProps> = ({
  selectedRole,
  onSelectRole,
  onOpenRoleProfile
}) => {
  const roles: { id: AIAssistantRole; name: string; icon: React.ReactNode; description: string }[] = [
    { 
      id: 'general', 
      name: 'General Assistant',
      icon: <User2 className="h-4 w-4" />,
      description: 'Everyday tasks and general assistance'
    },
    { 
      id: 'business_owner', 
      name: 'Business',
      icon: <Briefcase className="h-4 w-4" />,
      description: 'Managing business operations and staff'
    },
    { 
      id: 'student', 
      name: 'Student',
      icon: <BookOpen className="h-4 w-4" />,
      description: 'Academic tasks and study organization'
    },
    { 
      id: 'writer', 
      name: 'Creative',
      icon: <PenTool className="h-4 w-4" />,
      description: 'Creative writing and content creation'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Assistant Roles</CardTitle>
        <CardDescription>
          Choose a specialized role for the AI assistant
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {roles.map(role => (
            <Button
              key={role.id}
              variant={selectedRole === role.id ? 'default' : 'outline'}
              className={cn(
                'justify-start h-auto py-3 px-3',
                selectedRole === role.id ? 'border-2 border-primary' : ''
              )}
              onClick={() => onSelectRole(role.id)}
            >
              <div className="flex items-center space-x-2">
                <div className={cn(
                  'p-1.5 rounded-md',
                  selectedRole === role.id ? 'bg-primary-foreground' : 'bg-muted'
                )}>
                  {role.icon}
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm">{role.name}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[120px] sm:max-w-[150px]">
                    {role.description}
                  </p>
                </div>
              </div>
            </Button>
          ))}
        </div>

        {selectedRole !== 'general' && onOpenRoleProfile && (
          <Button 
            variant="outline" 
            className="w-full mt-2"
            onClick={onOpenRoleProfile}
          >
            <Settings className="h-4 w-4 mr-2" />
            Configure {selectedRole === 'business_owner' ? 'Business' : selectedRole} Profile
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
