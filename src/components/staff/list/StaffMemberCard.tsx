
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, UserCog, UserX } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StaffMember } from "@/types/staff";

export interface StaffMemberCardProps {
  staff?: StaffMember;
  member?: StaffMember; // For backward compatibility
  data?: StaffMember; // For backward compatibility
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

export const StaffMemberCard: React.FC<StaffMemberCardProps> = ({
  staff,
  member,
  data,
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  // Use the first non-undefined prop in order of preference
  const staffMember = staff || member || data;
  
  if (!staffMember) {
    console.error("No staff data provided to StaffMemberCard");
    return null;
  }

  const isActive = staffMember.status === 'active';
  const initials = staffMember.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  // Avatar border color class based on status
  const avatarBorderClass = isActive 
    ? "ring-2 ring-green-500" 
    : "ring-2 ring-red-500";

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex p-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className={`h-10 w-10 border ${avatarBorderClass}`}>
              {staffMember.profile_image_url ? (
                <AvatarImage src={staffMember.profile_image_url} alt={staffMember.name} />
              ) : (
                <AvatarFallback>{initials}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <h3 className="font-medium text-sm">{staffMember.name}</h3>
              <p className="text-xs text-muted-foreground">{staffMember.position || 'Staff Member'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={isActive ? "outline" : "secondary"} className="capitalize">
              {staffMember.status}
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  <UserCog className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onToggleStatus}>
                  {isActive ? (
                    <>
                      <UserX className="h-4 w-4 mr-2" />
                      Suspend
                    </>
                  ) : (
                    <>
                      <UserCog className="h-4 w-4 mr-2" />
                      Activate
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <UserX className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffMemberCard;
