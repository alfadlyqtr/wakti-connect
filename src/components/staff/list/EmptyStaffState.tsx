
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export interface EmptyStaffStateProps {
  onAddStaffClick: () => void;
}

const EmptyStaffState: React.FC<EmptyStaffStateProps> = ({ onAddStaffClick }) => {
  return (
    <Card className="text-center p-6">
      <div className="flex flex-col items-center justify-center">
        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
          <UserPlus className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-medium mb-2">No Staff Members Yet</h3>
        <p className="text-muted-foreground max-w-sm mb-6">
          Add your first staff member to start managing your team effectively
        </p>
        <Button onClick={onAddStaffClick}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Staff Member
        </Button>
      </div>
    </Card>
  );
};

export default EmptyStaffState;
