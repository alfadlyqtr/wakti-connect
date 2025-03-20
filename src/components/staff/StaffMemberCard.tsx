
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  UserCog,
  Ban,
  PowerOff,
  X
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import StaffPermissionsDisplay from "./StaffPermissionsDisplay";
import { StaffPermissions } from "@/services/permissions/types";
import { normalizePermissions } from "@/services/permissions/staffPermissions";
import { StaffMember as BusinessStaffMember } from "@/types/business.types";

// Use a renamed import to avoid confusion with the existing StaffMember type
export interface StaffMemberCardProps {
  member: BusinessStaffMember;
  onEdit: (staff: BusinessStaffMember) => void;
  onSuspend: (staff: BusinessStaffMember) => void;
  onDelete: (staff: BusinessStaffMember) => void;
  onReactivate: (staff: BusinessStaffMember) => void;
}

const getPermissionDisplay = (permissions: any) => {
  // Normalize permissions to ensure all required fields exist
  const normalizedPermissions = normalizePermissions(permissions);
  
  // Now we can safely return the permissions object
  return {
    service_permission: normalizedPermissions.service_permission || normalizedPermissions.services || "none",
    booking_permission: normalizedPermissions.booking_permission || normalizedPermissions.bookings || "none",
    staff_permission: normalizedPermissions.staff_permission || normalizedPermissions.staff || "none", 
    analytics_permission: normalizedPermissions.analytics_permission || normalizedPermissions.analytics || "none"
  };
};

const StaffMemberCard: React.FC<StaffMemberCardProps> = ({
  member,
  onEdit,
  onSuspend,
  onDelete,
  onReactivate
}) => {
  const getStatusBadge = (status: 'active' | 'suspended' | 'deleted' | 'pending' | 'inactive') => {
    switch (status) {
      case 'active':
        return <Badge variant="success" className="bg-green-500">Active</Badge>;
      case 'suspended':
        return <Badge variant="outline" className="bg-amber-500 text-white">Suspended</Badge>;
      case 'deleted':
        return <Badge variant="destructive">Deleted</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-blue-500 text-white">Pending</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-gray-500 text-white">Inactive</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const displayName = member.full_name || member.display_name || "Unnamed Staff";
  const role = member.role || "staff";
  const position = member.position || "Staff Member";
  const isServiceProvider = member.is_service_provider || false;
  const staffNumber = member.staff_number || member.id.substring(0, 8);
  const status = member.status || 'active';

  return (
    <Card className={`overflow-hidden ${status !== 'active' ? 'opacity-75' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Avatar className="h-14 w-14">
            <AvatarImage src={member.profile_image_url || ""} alt={displayName} />
            <AvatarFallback>
              {displayName ? displayName.substring(0, 2).toUpperCase() : "ST"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-end gap-1">
            <Badge variant={role === "co-admin" ? "secondary" : "outline"}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </Badge>
            {getStatusBadge(status)}
            {isServiceProvider && (
              <Badge variant="outline" className="border-wakti-blue text-wakti-blue">
                Service Provider
              </Badge>
            )}
          </div>
        </div>
        <CardTitle className="mt-2">{displayName}</CardTitle>
        <CardDescription>{position}</CardDescription>
        <CardDescription className="text-xs mb-1">
          {staffNumber}
        </CardDescription>
        {member.email && (
          <CardDescription className="text-xs break-all">
            {member.email}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="pb-2">
        <StaffPermissionsDisplay permissions={getPermissionDisplay(member.permissions)} />
      </CardContent>
      <CardFooter className="pt-2 flex gap-2">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => onEdit(member)}
          disabled={status === 'deleted'}
        >
          <UserCog className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon">
              <span className="sr-only">Open menu</span>
              <div className="h-4 w-4 flex items-center justify-center">
                <span className="h-0.5 w-0.5 rounded-full bg-current" />
                <span className="h-0.5 w-0.5 rounded-full bg-current mx-0.5" />
                <span className="h-0.5 w-0.5 rounded-full bg-current" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Manage Staff</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {status === 'active' && (
              <DropdownMenuItem 
                className="text-amber-500 focus:text-amber-500"
                onClick={() => onSuspend(member)}
              >
                <Ban className="h-4 w-4 mr-2" />
                Suspend Account
              </DropdownMenuItem>
            )}
            
            {status === 'suspended' && (
              <DropdownMenuItem 
                className="text-green-500 focus:text-green-500"
                onClick={() => onReactivate(member)}
              >
                <PowerOff className="h-4 w-4 mr-2" />
                Reactivate Account
              </DropdownMenuItem>
            )}
            
            {status !== 'deleted' && (
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(member)}
              >
                <X className="h-4 w-4 mr-2" />
                Delete Staff Member
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};

export default StaffMemberCard;
