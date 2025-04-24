
import React from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, RefreshCw } from "lucide-react";

interface StaffListHeaderProps {
  onAddStaff: () => void;
  onSync: () => void;
  isSyncing: boolean;
}

const StaffListHeader: React.FC<StaffListHeaderProps> = ({
  onAddStaff,
  onSync,
  isSyncing
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold">Staff Members</h2>
        <p className="text-sm text-muted-foreground">
          Manage your team and their permissions
        </p>
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onSync}
          disabled={isSyncing}
          title="Sync staff records"
        >
          <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
        </Button>
        
        <Button onClick={onAddStaff}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Staff
        </Button>
      </div>
    </div>
  );
};

export default StaffListHeader;
