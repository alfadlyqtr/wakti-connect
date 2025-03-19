
import React from "react";
import { Check, X } from "lucide-react";

interface StaffPermissionsProps {
  permissions: {
    can_track_hours: boolean;
    can_message_staff: boolean;
    can_create_job_cards: boolean;
    can_view_own_analytics: boolean;
  };
}

const StaffPermissionsDisplay: React.FC<StaffPermissionsProps> = ({ permissions }) => {
  return (
    <div className="space-y-2 text-sm">
      <h4 className="text-xs font-medium uppercase text-muted-foreground mb-1">Permissions</h4>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-1">
          {permissions.can_track_hours ? (
            <Check className="h-3 w-3 text-green-500" />
          ) : (
            <X className="h-3 w-3 text-destructive" />
          )}
          <span>Work Hours Tracking</span>
        </div>
        
        <div className="flex items-center gap-1">
          {permissions.can_message_staff ? (
            <Check className="h-3 w-3 text-green-500" />
          ) : (
            <X className="h-3 w-3 text-destructive" />
          )}
          <span>Staff Messaging</span>
        </div>
        
        <div className="flex items-center gap-1">
          {permissions.can_create_job_cards ? (
            <Check className="h-3 w-3 text-green-500" />
          ) : (
            <X className="h-3 w-3 text-destructive" />
          )}
          <span>Job Cards</span>
        </div>
        
        <div className="flex items-center gap-1">
          {permissions.can_view_own_analytics ? (
            <Check className="h-3 w-3 text-green-500" />
          ) : (
            <X className="h-3 w-3 text-destructive" />
          )}
          <span>View Analytics</span>
        </div>
      </div>
    </div>
  );
};

export default StaffPermissionsDisplay;
