
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, MoreVertical, UserCheck, UserX } from "lucide-react";
import { StaffMember } from "@/types/staff";
import { useStaffWorkingStatus } from "@/hooks/staff/useStaffWorkSession";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface StaffMemberCardProps {
  staff: StaffMember;
  onEdit: () => void;
  onUpdateStatus?: (status: string) => void;
  onDelete?: () => void; // Added this prop to maintain compatibility
  onToggleStatus?: () => void; // Added this prop to maintain compatibility
}

export const StaffMemberCard: React.FC<StaffMemberCardProps> = ({
  staff,
  onEdit,
  onUpdateStatus,
  onDelete, // Handle the new prop
  onToggleStatus // Handle the new prop
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'deleted':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleBadge = (role?: string) => {
    if (role === 'co-admin') {
      return <Badge variant="secondary" className="ml-2">Co-Admin</Badge>;
    }
    return null;
  };

  // Get work session status
  const { isLoading, workSession } = useStaffWorkingStatus(staff.id);
  const isClockedIn = !!workSession;

  // Determine the avatar border color based on work session status
  // Green = clocked in, Red = not clocked in
  // If still loading, fall back to account status
  const avatarBorderClass = isLoading
    ? (staff.status === 'active' ? "ring-2 ring-green-500" : "ring-2 ring-red-500")
    : (isClockedIn ? "ring-2 ring-green-500" : "ring-2 ring-red-500");

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <Avatar className={`h-10 w-10 ${avatarBorderClass}`}>
                <AvatarImage src={staff.profile_image_url} />
                <AvatarFallback>{getInitials(staff.name)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center">
                  <h3 className="font-medium text-lg">{staff.name}</h3>
                  {getRoleBadge(staff.role)}
                  {staff.is_service_provider && (
                    <Badge variant="outline" className="ml-2">Service Provider</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{staff.position || 'Staff Member'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`text-xs rounded-full px-2 py-1 border ${getStatusColor(staff.status)}`}>
                {staff.status === 'active' ? 'Active' : 
                 staff.status === 'inactive' ? 'Inactive' : 
                 staff.status === 'deleted' ? 'Deleted' : 'Unknown'}
              </div>
              
              <Button variant="ghost" size="icon" onClick={onEdit} title="Edit">
                <Edit className="h-4 w-4" />
              </Button>
              
              {(onUpdateStatus || onToggleStatus) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {staff.status !== 'active' && onUpdateStatus && (
                      <DropdownMenuItem onClick={() => onUpdateStatus('active')}>
                        <UserCheck className="mr-2 h-4 w-4" />
                        Activate
                      </DropdownMenuItem>
                    )}
                    {staff.status !== 'inactive' && onUpdateStatus && (
                      <DropdownMenuItem onClick={() => onUpdateStatus('inactive')}>
                        <UserX className="mr-2 h-4 w-4" />
                        Deactivate
                      </DropdownMenuItem>
                    )}
                    {onToggleStatus && (
                      <DropdownMenuItem onClick={onToggleStatus}>
                        {staff.status === 'active' ? (
                          <>
                            <UserX className="mr-2 h-4 w-4" />
                            Suspend
                          </>
                        ) : (
                          <>
                            <UserCheck className="mr-2 h-4 w-4" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    {onDelete && (
                      <DropdownMenuItem 
                        onClick={onDelete}
                        className="text-destructive focus:text-destructive"
                      >
                        <UserX className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={onEdit}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 text-sm">
            {staff.email && (
              <div className="bg-gray-100 rounded-md px-2 py-1">
                {staff.email}
              </div>
            )}
            {staff.staff_number && (
              <div className="bg-gray-100 rounded-md px-2 py-1">
                ID: {staff.staff_number}
              </div>
            )}
            {/* Add work session badge */}
            {!isLoading && (
              <div className={`rounded-md px-2 py-1 ${isClockedIn ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {isClockedIn ? 'Clocked In' : 'Clocked Out'}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffMemberCard;
