
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Ban, CheckCircle2 } from "lucide-react";
import { StaffMember } from "@/pages/dashboard/staff-management/types";

interface StaffMemberCardProps {
  staff: StaffMember;
  onEdit: (staffId: string) => void;
  onDelete: (staff: StaffMember) => void;
  onToggleStatus: (staff: StaffMember) => void;
}

const StaffMemberCard: React.FC<StaffMemberCardProps> = ({
  staff,
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  const fullName = staff.profile?.full_name || staff.name;
  const avatarUrl = staff.profile?.avatar_url || null;
  const isActive = staff.status === 'active';
  
  return (
    <Card key={staff.id} className={isActive ? "" : "opacity-75"}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Avatar className="h-12 w-12">
            <AvatarImage src={avatarUrl || ""} />
            <AvatarFallback>
              {fullName ? fullName.substring(0, 2).toUpperCase() : "ST"}
            </AvatarFallback>
          </Avatar>
          <div className="flex gap-2">
            <Badge variant={
              staff.role === 'co-admin' 
                ? "secondary" 
                : staff.is_service_provider 
                  ? "outline" 
                  : "secondary"
            }>
              {staff.role === 'co-admin' 
                ? "Co-Admin" 
                : staff.is_service_provider 
                  ? "Service Provider" 
                  : "Staff"
              }
            </Badge>
            {!isActive && (
              <Badge variant="destructive">Suspended</Badge>
            )}
          </div>
        </div>
        <CardTitle className="mt-2 text-lg">{fullName}</CardTitle>
        <CardDescription>
          {staff.position || "Staff Member"}
          {staff.staff_number && (
            <div className="mt-1 text-xs font-mono">{staff.staff_number}</div>
          )}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="text-sm">
        <p className="text-muted-foreground">{staff.email}</p>
        
        <div className="mt-4 space-y-1">
          <p className="text-xs text-muted-foreground font-medium">Permissions:</p>
          <div className="flex flex-wrap gap-1">
            {Object.entries(staff.permissions || {})
              .filter(([_, value]) => value)
              .map(([key]) => (
                <Badge key={key} variant="outline" className="text-[9px]">
                  {key.replace('can_', '').replace(/_/g, ' ')}
                </Badge>
              ))
            }
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(staff.id)}
        >
          <Edit className="h-3 w-3 mr-1" />
          Edit
        </Button>
        <div className="flex gap-2">
          <Button
            variant={isActive ? "destructive" : "outline"}
            size="sm"
            onClick={() => onToggleStatus(staff)}
          >
            {isActive ? (
              <>
                <Ban className="h-3 w-3 mr-1" />
                Suspend
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Activate
              </>
            )}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(staff)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default StaffMemberCard;
