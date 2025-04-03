
import React from 'react';
import { Check, GraduationCap, Briefcase, PenTool, Building, User } from 'lucide-react';
import { AIAssistantRole } from '@/types/ai-assistant.types';
import { cn } from '@/lib/utils';

interface AIRoleSelectorProps {
  selectedRole: AIAssistantRole;
  onRoleChange: (role: AIAssistantRole) => void;
}

interface RoleOption {
  value: AIAssistantRole;
  label: string;
  icon: React.ReactNode;
  description: string;
}

export const AIRoleSelector = ({ selectedRole, onRoleChange }: AIRoleSelectorProps) => {
  const roleOptions: RoleOption[] = [
    {
      value: 'student',
      label: 'Student',
      icon: <GraduationCap className="h-4 w-4" />,
      description: 'Homework, study plans & assignments'
    },
    {
      value: 'professional',
      label: 'Professional',
      icon: <Briefcase className="h-4 w-4" />,
      description: 'Emails, tasks & workplace productivity'
    },
    {
      value: 'creator',
      label: 'Creator',
      icon: <PenTool className="h-4 w-4" />,
      description: 'Creative writing & content creation'
    },
    {
      value: 'business_owner',
      label: 'Business',
      icon: <Building className="h-4 w-4" />,
      description: 'Operations & management support'
    },
    {
      value: 'general',
      label: 'General',
      icon: <User className="h-4 w-4" />,
      description: 'All-purpose assistant'
    }
  ];

  return (
    <div className="w-full overflow-auto pb-2">
      <div className="flex flex-nowrap gap-2 md:flex-wrap">
        {roleOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onRoleChange(option.value)}
            className={cn(
              "flex flex-col items-center justify-center min-w-[120px] p-3 rounded-lg border transition-all",
              selectedRole === option.value
                ? "border-wakti-blue bg-wakti-blue/5 text-wakti-blue"
                : "border-gray-200 hover:border-wakti-blue/50 hover:bg-wakti-blue/5"
            )}
          >
            <div className="relative mb-1">
              <div className={cn(
                "p-2 rounded-full",
                selectedRole === option.value ? "bg-wakti-blue/10" : "bg-gray-100"
              )}>
                {option.icon}
              </div>
              {selectedRole === option.value && (
                <div className="absolute -top-1 -right-1 bg-wakti-blue text-white rounded-full p-0.5">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </div>
            <span className="text-sm font-medium">{option.label}</span>
            <span className="text-xs text-muted-foreground mt-1 text-center">
              {option.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
