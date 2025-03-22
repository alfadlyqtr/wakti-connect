
import React from "react";
import { Badge } from "@/components/ui/badge";

interface StaffRoleBadgesProps {
  role: string;
  isServiceProvider: boolean;
  isActive: boolean;
}

const StaffRoleBadges: React.FC<StaffRoleBadgesProps> = ({ 
  role, 
  isServiceProvider, 
  isActive 
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {role === 'co-admin' && (
        <Badge variant="secondary">Co-Admin</Badge>
      )}
      {isServiceProvider && (
        <Badge variant="outline">Service Provider</Badge>
      )}
      {!isActive && (
        <Badge variant="destructive">Suspended</Badge>
      )}
    </div>
  );
};

export default StaffRoleBadges;
