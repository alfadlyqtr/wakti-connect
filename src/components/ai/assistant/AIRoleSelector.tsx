
import React from 'react';
import { AIAssistantRole } from '@/types/ai-assistant.types';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Briefcase, 
  PenTool, 
  Building2, 
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface AIRoleSelectorProps {
  selectedRole: AIAssistantRole;
  onRoleChange: (role: AIAssistantRole) => void;
}

export const AIRoleSelector: React.FC<AIRoleSelectorProps> = ({ selectedRole, onRoleChange }) => {
  const roles: { role: AIAssistantRole; label: string; icon: React.ReactNode; color: string }[] = [
    { 
      role: 'student', 
      label: 'Student', 
      icon: <BookOpen className="h-4 w-4" />,
      color: 'bg-blue-100 text-blue-700 hover:bg-blue-200 data-[state=selected]:bg-blue-200'
    },
    { 
      role: 'professional', 
      label: 'Work', 
      icon: <Briefcase className="h-4 w-4" />,
      color: 'bg-purple-100 text-purple-700 hover:bg-purple-200 data-[state=selected]:bg-purple-200'
    },
    { 
      role: 'creator', 
      label: 'Creator', 
      icon: <PenTool className="h-4 w-4" />,
      color: 'bg-green-100 text-green-700 hover:bg-green-200 data-[state=selected]:bg-green-200'
    },
    { 
      role: 'business_owner', 
      label: 'Business', 
      icon: <Building2 className="h-4 w-4" />,
      color: 'bg-amber-100 text-amber-700 hover:bg-amber-200 data-[state=selected]:bg-amber-200'
    },
    { 
      role: 'general', 
      label: 'General', 
      icon: <HelpCircle className="h-4 w-4" />,
      color: 'bg-gray-100 text-gray-700 hover:bg-gray-200 data-[state=selected]:bg-gray-200'
    }
  ];

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 overflow-x-auto p-1 rounded-lg bg-gray-100/50 border">
        {roles.map((role) => (
          <Button
            key={role.role}
            size="sm"
            variant={selectedRole === role.role ? "default" : "ghost"}
            onClick={() => onRoleChange(role.role)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md ${
              selectedRole === role.role 
                ? 'bg-gradient-to-br from-wakti-blue to-wakti-blue/90 text-white' 
                : `${role.color}`
            }`}
          >
            {role.icon}
            <span className="text-xs font-medium">{role.label}</span>
            {selectedRole === role.role && <Sparkles className="h-3 w-3 ml-1 opacity-70" />}
          </Button>
        ))}
      </div>
    </div>
  );
};
