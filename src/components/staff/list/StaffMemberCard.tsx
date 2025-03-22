
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye } from "lucide-react";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  position: string;
  created_at: string;
  staff_id: string;
  status?: string;
  profile?: {
    full_name?: string;
    avatar_url?: string;
  };
}

interface StaffMemberCardProps {
  member: StaffMember;
  onViewDetails: (memberId: string) => void;
}

const StaffMemberCard: React.FC<StaffMemberCardProps> = ({ member, onViewDetails }) => {
  // Get the displayed name - from profile if available, fallback to staff record
  const displayName = member.profile?.full_name || member.name || "Unnamed Staff";
  
  // Generate avatar initials
  const initials = displayName
    .split(" ")
    .map(part => part.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2);
    
  // Check if staff is active
  const isActive = member.status !== "deleted" && member.status !== "suspended";
  
  return (
    <Card key={member.id} className={!isActive ? "opacity-75 border-muted" : ""}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Avatar className="h-12 w-12">
            <AvatarImage src={member.profile?.avatar_url || ""} alt={displayName} />
            <AvatarFallback>
              {initials || "ST"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-wrap gap-1">
            <Badge variant={member.role === "co-admin" ? "secondary" : "outline"}>
              {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
            </Badge>
            {!isActive && (
              <Badge variant="destructive">
                {member.status?.charAt(0).toUpperCase() + member.status?.slice(1) || "Inactive"}
              </Badge>
            )}
          </div>
        </div>
        <CardTitle className="mt-2">{displayName}</CardTitle>
        <CardDescription>{member.position || "Staff Member"}</CardDescription>
        {member.email && (
          <CardDescription className="text-xs truncate">{member.email}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-1 text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>Joined {new Date(member.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex gap-2">
        <Button 
          variant="outline" 
          className="flex-1 flex items-center justify-center"
          onClick={() => onViewDetails(member.id)}
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StaffMemberCard;
