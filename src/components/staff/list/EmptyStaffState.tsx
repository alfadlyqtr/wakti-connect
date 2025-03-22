
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface EmptyStaffStateProps {
  onAddStaffClick: () => void;
}

const EmptyStaffState: React.FC<EmptyStaffStateProps> = ({ onAddStaffClick }) => {
  return (
    <Card className="col-span-full p-8">
      <div className="text-center">
        <UserPlus className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Staff Members Yet</h3>
        <p className="text-muted-foreground mb-4">Add staff members to your business.</p>
        <Button onClick={onAddStaffClick}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Staff Member
        </Button>
      </div>
    </Card>
  );
};

export default EmptyStaffState;
