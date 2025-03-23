
import React from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, RefreshCcw } from "lucide-react";

interface StaffHeaderProps {
  onAddStaff: () => void;
  onRefresh: () => void;
  canAddMoreStaff: boolean;
}

const StaffHeader: React.FC<StaffHeaderProps> = ({ 
  onAddStaff, 
  onRefresh,
  canAddMoreStaff
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold mb-1">Staff Management</h1>
        <p className="text-muted-foreground">
          Manage your team members and their permissions
        </p>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onRefresh}
          title="Refresh"
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
        
        <Button 
          onClick={onAddStaff} 
          disabled={!canAddMoreStaff}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add Staff Member
        </Button>
      </div>
    </div>
  );
};

export default StaffHeader;
