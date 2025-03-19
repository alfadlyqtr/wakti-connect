
import React from "react";
import { Shield, ShieldCheck, ShieldX, ShieldAlert } from "lucide-react";
import { PermissionLevel } from "@/services/permissions/accessControlService";

interface StaffPermissionsProps {
  permissions: {
    service_permission: PermissionLevel;
    booking_permission: PermissionLevel;
    staff_permission: PermissionLevel;
    analytics_permission: PermissionLevel;
  };
}

const StaffPermissionsDisplay: React.FC<StaffPermissionsProps> = ({ permissions }) => {
  const getPermissionIcon = (level: PermissionLevel) => {
    switch (level) {
      case 'admin':
        return <ShieldCheck className="h-3.5 w-3.5 text-green-500" />;
      case 'write':
        return <Shield className="h-3.5 w-3.5 text-blue-500" />;
      case 'read':
        return <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />;
      case 'none':
      default:
        return <ShieldX className="h-3.5 w-3.5 text-muted-foreground" />;
    }
  };

  const getPermissionLabel = (level: PermissionLevel) => {
    switch (level) {
      case 'admin':
        return "Full Access";
      case 'write':
        return "Can Edit";
      case 'read':
        return "View Only";
      case 'none':
      default:
        return "No Access";
    }
  };

  return (
    <div className="space-y-2 text-sm">
      <h4 className="text-xs font-medium uppercase text-muted-foreground mb-1">Permissions</h4>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-1">
          {getPermissionIcon(permissions.service_permission)}
          <span>Services: {getPermissionLabel(permissions.service_permission)}</span>
        </div>
        
        <div className="flex items-center gap-1">
          {getPermissionIcon(permissions.booking_permission)}
          <span>Bookings: {getPermissionLabel(permissions.booking_permission)}</span>
        </div>
        
        <div className="flex items-center gap-1">
          {getPermissionIcon(permissions.staff_permission)}
          <span>Staff: {getPermissionLabel(permissions.staff_permission)}</span>
        </div>
        
        <div className="flex items-center gap-1">
          {getPermissionIcon(permissions.analytics_permission)}
          <span>Analytics: {getPermissionLabel(permissions.analytics_permission)}</span>
        </div>
      </div>
    </div>
  );
};

export default StaffPermissionsDisplay;
