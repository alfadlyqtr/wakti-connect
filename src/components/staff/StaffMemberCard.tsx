
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
import { StaffPermissions } from "@/services/permissions/accessControlService";

export interface StaffMember {
  id: string;
  name: string;
  email: string | null;
  role: string;
  position: string;
  created_at: string;
  staff_number: string;
  is_service_provider: boolean;
  status: 'active' | 'suspended' | 'deleted';
  profile_image_url: string | null;
  permissions: StaffPermissions;
}

interface StaffMemberCardProps {
  member: StaffMember;
  onEdit: (staff: StaffMember) => void;
  onSuspend: (staff: StaffMember) => void;
  onDelete: (staff: StaffMember) => void;
  onReactivate: (staff: StaffMember) => void;
}

const StaffMemberCard: React.FC<StaffMemberCardProps> = ({
  member,
  onEdit,
  onSuspend,
  onDelete,
  onReactivate
}) => {
  const getStatusBadge = (status: 'active' | 'suspended' | 'deleted') => {
    switch (status) {
      case 'active':
        return <Badge variant="success" className="bg-green-500">Active</Badge>;
      case 'suspended':
        return <Badge variant="outline" className="bg-amber-500 text-white">Suspended</Badge>;
      case 'deleted':
        return <Badge variant="destructive">Deleted</Badge>;
    }
  };

  return (
    <Card className={`overflow-hidden ${member.status !== 'active' ? 'opacity-75' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Avatar className="h-14 w-14">
            <AvatarImage src={member.profile_image_url || ""} alt={member.name} />
            <AvatarFallback>
              {member.name ? member.name.substring(0, 2).toUpperCase() : "ST"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-end gap-1">
            <Badge variant={member.role === "co-admin" ? "secondary" : "outline"}>
              {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
            </Badge>
            {getStatusBadge(member.status)}
            {member.is_service_provider && (
              <Badge variant="outline" className="border-wakti-blue text-wakti-blue">
                Service Provider
              </Badge>
            )}
          </div>
        </div>
        <CardTitle className="mt-2">{member.name || "Unnamed Staff"}</CardTitle>
        <CardDescription>{member.position || "Staff Member"}</CardDescription>
        <CardDescription className="text-xs mb-1">
          {member.staff_number}
        </CardDescription>
        {member.email && (
          <CardDescription className="text-xs break-all">
            {member.email}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="pb-2">
        <StaffPermissionsDisplay permissions={member.permissions} />
      </CardContent>
      <CardFooter className="pt-2 flex gap-2">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => onEdit(member)}
          disabled={member.status === 'deleted'}
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
            
            {member.status === 'active' && (
              <DropdownMenuItem 
                className="text-amber-500 focus:text-amber-500"
                onClick={() => onSuspend(member)}
              >
                <Ban className="h-4 w-4 mr-2" />
                Suspend Account
              </DropdownMenuItem>
            )}
            
            {member.status === 'suspended' && (
              <DropdownMenuItem 
                className="text-green-500 focus:text-green-500"
                onClick={() => onReactivate(member)}
              >
                <PowerOff className="h-4 w-4 mr-2" />
                Reactivate Account
              </DropdownMenuItem>
            )}
            
            {member.status !== 'deleted' && (
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
