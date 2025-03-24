
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Mail, Phone } from "lucide-react";
import { StaffMember } from "./types";
import { format } from "date-fns";

interface StaffMemberCardProps {
  member: StaffMember;
  onSelectStaff: (staffId: string) => void;
}

const StaffMemberCard: React.FC<StaffMemberCardProps> = ({ member, onSelectStaff }) => {
  // Get initials for avatar fallback
  const fullName = member.profile?.full_name || member.name;
  const initials = fullName
    ? fullName.split(" ").map(part => part.charAt(0)).join("").toUpperCase().substring(0, 2)
    : "ST";
    
  const isActive = member.status === 'active';
  
  // Avatar border color class based on status
  const avatarBorderClass = isActive 
    ? "ring-2 ring-green-500" 
    : "ring-2 ring-red-500";
    
  return (
    <Card className={isActive ? "" : "opacity-75 border-muted bg-muted/20"}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Avatar className={`h-12 w-12 ${avatarBorderClass}`}>
            <AvatarImage src={member.profile_image_url || ""} alt={fullName} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-wrap gap-2">
            {member.role === 'co-admin' && (
              <Badge variant="secondary">Co-Admin</Badge>
            )}
            {member.is_service_provider && (
              <Badge variant="outline">Service Provider</Badge>
            )}
            {!isActive && (
              <Badge variant="destructive">Suspended</Badge>
            )}
          </div>
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
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-3.5 w-3.5" />
          <span className="truncate">{member.email}</span>
        </div>
        
        <div className="mt-4">
          <p className="text-xs text-muted-foreground mb-1">Permissions:</p>
          <div className="flex flex-wrap gap-1">
            {Object.entries(member.permissions || {})
              .filter(([_, value]) => value)
              .slice(0, 5)
              .map(([key]) => (
                <Badge key={key} variant="outline" className="text-[9px]">
                  {key.replace('can_', '').replace(/_/g, ' ')}
                </Badge>
              ))
            }
            {Object.entries(member.permissions || {}).filter(([_, v]) => v).length > 5 && (
              <Badge variant="outline" className="text-[9px]">
                +{Object.entries(member.permissions || {}).filter(([_, v]) => v).length - 5} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => onSelectStaff(member.id)}
        >
          <Eye className="h-3.5 w-3.5 mr-1" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StaffMemberCard;
