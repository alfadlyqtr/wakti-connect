
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mortarboard, Briefcase, Building2, User } from "lucide-react";

type UserRole = "student" | "professional" | "business_owner" | "other";

interface RoleSelectionProps {
  onSelect: (role: UserRole) => void;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelect }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-4">What best describes you?</h3>
      <p className="text-sm text-muted-foreground mb-6">
        We'll personalize your AI assistant based on your selection.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="flex flex-col items-center h-auto p-4 gap-2"
          onClick={() => onSelect("student")}
        >
          <Mortarboard className="h-8 w-8 mb-1 text-wakti-blue" />
          <span className="font-medium">Student</span>
          <span className="text-xs text-muted-foreground text-center">
            Homework help, study guidance, and academic support
          </span>
        </Button>
        
        <Button
          variant="outline"
          className="flex flex-col items-center h-auto p-4 gap-2"
          onClick={() => onSelect("professional")}
        >
          <Briefcase className="h-8 w-8 mb-1 text-wakti-blue" />
          <span className="font-medium">Professional</span>
          <span className="text-xs text-muted-foreground text-center">
            Work-related tasks, time management, and productivity
          </span>
        </Button>
        
        <Button
          variant="outline"
          className="flex flex-col items-center h-auto p-4 gap-2"
          onClick={() => onSelect("business_owner")}
        >
          <Building2 className="h-8 w-8 mb-1 text-wakti-blue" />
          <span className="font-medium">Business Owner</span>
          <span className="text-xs text-muted-foreground text-center">
            Business management, staff coordination, and operations
          </span>
        </Button>
        
        <Button
          variant="outline"
          className="flex flex-col items-center h-auto p-4 gap-2"
          onClick={() => onSelect("other")}
        >
          <User className="h-8 w-8 mb-1 text-wakti-blue" />
          <span className="font-medium">Other</span>
          <span className="text-xs text-muted-foreground text-center">
            General assistance with tasks and productivity
          </span>
        </Button>
      </div>
    </div>
  );
};
