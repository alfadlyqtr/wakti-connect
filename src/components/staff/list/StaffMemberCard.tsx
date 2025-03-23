
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, UserCog, UserX } from "lucide-react";
import { StaffMember } from "@/types/staff";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface StaffMemberCardProps {
  member: StaffMember;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

const StaffMemberCard: React.FC<StaffMemberCardProps> = ({
  member,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const isActive = member.status === "active";
  const roleLabel = member.role === "co-admin" ? "Co-Admin" : "Staff";
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="" alt={member.name} />
                <AvatarFallback>
                  {member.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.position || "Staff Member"}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  <UserCog className="h-4 w-4 mr-2" />
                  Edit Staff
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onToggleStatus}>
                  <UserX className="h-4 w-4 mr-2" />
                  {isActive ? "Deactivate" : "Activate"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onDelete}
                  className="text-destructive focus:text-destructive"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={member.role === "co-admin" ? "default" : "outline"}>
                {roleLabel}
              </Badge>
              {member.is_service_provider && (
                <Badge variant="secondary">Service Provider</Badge>
              )}
            </div>
            <Badge variant={isActive ? "success" : "secondary"}>
              {isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          
          {member.staff_number && (
            <p className="text-xs text-muted-foreground mt-2">
              ID: {member.staff_number}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffMemberCard;
