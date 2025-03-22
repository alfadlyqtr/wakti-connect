
import React from "react";
import { Badge } from "@/components/ui/badge";

interface StaffPermissionBadgesProps {
  permissions: Record<string, boolean | undefined>;
}

const StaffPermissionBadges: React.FC<StaffPermissionBadgesProps> = ({ permissions }) => {
  const enabledPermissions = Object.entries(permissions || {})
    .filter(([_, value]) => value);
  
  // Only show the first 5 permissions
  const displayedPermissions = enabledPermissions.slice(0, 5);
  const remainingCount = enabledPermissions.length - 5;

  return (
    <div className="flex flex-wrap gap-1">
      {displayedPermissions.map(([key]) => (
        <Badge key={key} variant="outline" className="text-[9px]">
          {key.replace('can_', '').replace(/_/g, ' ')}
        </Badge>
      ))}
      
      {remainingCount > 0 && (
        <Badge variant="outline" className="text-[9px]">
          +{remainingCount} more
        </Badge>
      )}
    </div>
  );
};

export default StaffPermissionBadges;
