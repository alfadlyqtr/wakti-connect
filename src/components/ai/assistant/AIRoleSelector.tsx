
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AIAssistantRole } from '@/types/ai-assistant.types';
import { Book, Briefcase, Pen, Bot, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIRoleSelectorProps {
  selectedRole: AIAssistantRole;
  onRoleChange: (role: AIAssistantRole) => void;
}

export const AIRoleSelector: React.FC<AIRoleSelectorProps> = ({
  selectedRole,
  onRoleChange
}) => {
  const roles: { value: AIAssistantRole; label: string; icon: React.ReactNode; description: string }[] = [
    {
      value: 'general',
      label: 'General',
      icon: <Bot className="h-4 w-4" />,
      description: 'All-purpose productivity assistant'
    },
    {
      value: 'student',
      label: 'Student',
      icon: <GraduationCap className="h-4 w-4" />,
      description: 'For academic tasks & learning'
    },
    {
      value: 'business_owner',
      label: 'Business',
      icon: <Briefcase className="h-4 w-4" />,
      description: 'For business operations & teams'
    },
    {
      value: 'employee',
      label: 'Professional',
      icon: <Bot className="h-4 w-4" />,
      description: 'For workplace productivity'
    },
    {
      value: 'writer',
      label: 'Creative',
      icon: <Pen className="h-4 w-4" />,
      description: 'For content creation & writing'
    }
  ];

  return (
    <RadioGroup
      value={selectedRole}
      onValueChange={(value) => onRoleChange(value as AIAssistantRole)}
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2"
    >
      {roles.map((role) => (
        <div key={role.value}>
          <RadioGroupItem
            value={role.value}
            id={`role-${role.value}`}
            className="peer sr-only"
          />
          <Label
            htmlFor={`role-${role.value}`}
            className={cn(
              "flex flex-col items-center justify-center rounded-md border-2 border-muted p-2 hover:bg-accent hover:text-accent-foreground",
              "peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary",
              "cursor-pointer text-center"
            )}
          >
            <div className={cn(
              "rounded-full p-1 mb-1",
              selectedRole === role.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}>
              {role.icon}
            </div>
            <div className="font-medium text-sm">{role.label}</div>
            <div className="text-xs text-muted-foreground hidden md:block">{role.description}</div>
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};
