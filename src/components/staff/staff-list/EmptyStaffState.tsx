
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, RefreshCw } from "lucide-react";

interface EmptyStaffStateProps {
  onAddStaffClick: () => void;
  onSyncStaffClick?: () => void;
  isSyncing?: boolean;
}

const EmptyStaffState: React.FC<EmptyStaffStateProps> = ({ 
  onAddStaffClick, 
  onSyncStaffClick,
  isSyncing = false 
}) => (
  <Card className="text-center p-6">
    <div className="flex flex-col items-center justify-center">
      <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <UserPlus className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-medium mb-2">No staff members yet</h3>
      <p className="text-muted-foreground max-w-sm mb-6">
        Add staff members to your business to help manage tasks, appointments, and services.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={onAddStaffClick}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Staff Member
        </Button>
        {onSyncStaffClick && (
          <Button variant="outline" onClick={onSyncStaffClick} disabled={isSyncing}>
            {isSyncing ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {isSyncing ? "Syncing..." : "Sync Staff Records"}
          </Button>
        )}
      </div>
    </div>
  </Card>
);

export default EmptyStaffState;
