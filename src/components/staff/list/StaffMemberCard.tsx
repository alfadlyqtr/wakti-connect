
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  position: string;
  created_at: string;
  staff_id: string;
}

interface StaffMemberCardProps {
  member: StaffMember;
  onViewDetails: (memberId: string) => void;
}

const StaffMemberCard: React.FC<StaffMemberCardProps> = ({ member, onViewDetails }) => {
  return (
    <Card key={member.id} className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Avatar className="h-12 w-12">
            <AvatarFallback>
              {member.name ? member.name.substring(0, 2).toUpperCase() : "ST"}
            </AvatarFallback>
          </Avatar>
          <Badge variant={member.role === "admin" ? "secondary" : "outline"}>
            {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
          </Badge>
        </div>
        <CardTitle className="mt-2">{member.name || "Unnamed Staff"}</CardTitle>
        <CardDescription>{member.position || "Staff Member"}</CardDescription>
        {member.email && (
          <CardDescription className="text-xs">{member.email}</CardDescription>
        )}
        {member.staff_id !== member.id && (
          <div className="mt-1">
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
              Active Account
            </Badge>
          </div>
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
          className="flex-1"
          onClick={() => onViewDetails(member.id)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StaffMemberCard;
