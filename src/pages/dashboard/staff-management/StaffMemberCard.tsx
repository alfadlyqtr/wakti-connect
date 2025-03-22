
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { StaffMember } from "./types";
import { 
  StaffAvatar,
  StaffRoleBadges,
  StaffPermissionBadges,
  StaffContactInfo,
  StaffCardFooter
} from "./components/staff-card";

interface StaffMemberCardProps {
  member: StaffMember;
  onSelectStaff: (staffId: string) => void;
}

const StaffMemberCard: React.FC<StaffMemberCardProps> = ({ member, onSelectStaff }) => {
  // Get displayed name from profile if available, fallback to staff record
  const fullName = member.profile?.full_name || member.name;
  const isActive = member.status === 'active';

  const handleViewDetails = () => {
    console.log("Viewing staff details for ID:", member.id);
    onSelectStaff(member.id);
  };
    
  return (
    <Card className={isActive ? "" : "opacity-75 border-muted bg-muted/20"}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <StaffAvatar 
            fullName={fullName} 
            profile={member.profile} 
          />
          <StaffRoleBadges 
            role={member.role}
            isServiceProvider={member.is_service_provider}
            isActive={isActive}
          />
        </div>
        <CardTitle className="mt-2">{fullName}</CardTitle>
        <CardDescription className="flex flex-col">
          <span>{member.position || "Staff Member"}</span>
          {member.staff_number && (
            <span className="text-xs font-mono mt-1">{member.staff_number}</span>
          )}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <StaffContactInfo email={member.email} />
        
        <div className="mt-4">
          <p className="text-xs text-muted-foreground mb-1">Permissions:</p>
          <StaffPermissionBadges permissions={member.permissions} />
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <StaffCardFooter onViewDetails={handleViewDetails} />
      </CardFooter>
    </Card>
  );
};

export default StaffMemberCard;
