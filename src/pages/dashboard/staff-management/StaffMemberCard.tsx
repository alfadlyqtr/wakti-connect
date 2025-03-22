
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Calendar } from "lucide-react";
import { StaffMember } from "./types";

interface StaffMemberCardProps {
  member: StaffMember;
  onSelectStaff: (staffId: string) => void;
}

const StaffMemberCard: React.FC<StaffMemberCardProps> = ({ member, onSelectStaff }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Avatar className="h-12 w-12">
            <AvatarImage src={member.profile?.avatar_url || ""} alt={member.profile?.full_name || "Staff"} />
            <AvatarFallback>
              {member.profile?.full_name?.substring(0, 2) || "ST"}
            </AvatarFallback>
          </Avatar>
          <Badge variant={member.role === "admin" ? "secondary" : "outline"}>
            {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
          </Badge>
        </div>
        <CardTitle className="mt-2">{member.profile?.full_name || "Unnamed Staff"}</CardTitle>
        <CardDescription>Joined {new Date(member.created_at).toLocaleDateString()}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-1 text-sm">
          <div className="flex items-center">
            <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>3 services assigned</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>12 bookings this month</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex gap-2">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => onSelectStaff(member.id)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StaffMemberCard;
