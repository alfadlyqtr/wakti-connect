
import React from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Pencil, Trash2, UserCog, UserMinus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import StaffMemberCard from "./list/StaffMemberCard";
import { StaffMember } from "@/types/staff";

interface StaffMembersListProps {
  staffMembers: StaffMember[];
  isLoading: boolean;
  error: Error | null;
  onEdit: (staffId: string) => void;
  onUpdateStatus?: (staffId: string, newStatus: string) => void;
}

export const StaffMembersList: React.FC<StaffMembersListProps> = ({
  staffMembers,
  isLoading,
  error,
  onEdit,
  onUpdateStatus
}) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex justify-center">
          <div className="h-8 w-8 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-destructive">
          <p className="text-sm">Error loading staff members: {error.message}</p>
          <Button variant="outline" size="sm" className="mt-4">Retry</Button>
        </div>
      </Card>
    );
  }

  // Desktop view (table)
  const renderDesktopView = () => (
    <div className="hidden md:block">
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staffMembers.map((staff) => (
              <TableRow key={staff.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      {staff.profile_image_url ? (
                        <AvatarImage src={staff.profile_image_url} alt={staff.name} />
                      ) : (
                        <AvatarFallback>
                          {staff.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .substring(0, 2)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    {staff.name}
                  </div>
                </TableCell>
                <TableCell>{staff.position || "-"}</TableCell>
                <TableCell>
                  <Badge variant={staff.role === "co-admin" ? "default" : "outline"} className="capitalize">
                    {staff.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={staff.status === "active" ? "success" : "secondary"} 
                    className="capitalize"
                  >
                    {staff.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {staff.created_at ? formatDistanceToNow(new Date(staff.created_at), { addSuffix: true }) : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(staff.id)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      {onUpdateStatus && (
                        <DropdownMenuItem 
                          onClick={() => onUpdateStatus(
                            staff.id, 
                            staff.status === "active" ? "suspended" : "active"
                          )}
                        >
                          {staff.status === "active" ? (
                            <>
                              <UserMinus className="mr-2 h-4 w-4" />
                              Suspend
                            </>
                          ) : (
                            <>
                              <UserCog className="mr-2 h-4 w-4" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => onUpdateStatus && onUpdateStatus(staff.id, "deleted")}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );

  // Mobile view (cards)
  const renderMobileView = () => (
    <div className="grid grid-cols-1 gap-4 md:hidden">
      {staffMembers.map((staff) => (
        <StaffMemberCard
          key={staff.id}
          staff={staff}
          onEdit={() => onEdit(staff.id)}
          onDelete={() => onUpdateStatus && onUpdateStatus(staff.id, "deleted")}
          onToggleStatus={() => 
            onUpdateStatus && onUpdateStatus(
              staff.id, 
              staff.status === "active" ? "suspended" : "active"
            )
          }
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      {renderDesktopView()}
      {renderMobileView()}
    </div>
  );
};
