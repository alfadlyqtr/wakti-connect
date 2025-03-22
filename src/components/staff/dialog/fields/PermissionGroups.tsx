
import React from "react";

export interface PermissionGroupsProps {
  // Define only the props needed for the interface
  // No need to include form
}

const PermissionGroups: React.FC<PermissionGroupsProps> = () => {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        Staff permissions management has been removed from this version.
      </p>
    </div>
  );
};

export default PermissionGroups;
