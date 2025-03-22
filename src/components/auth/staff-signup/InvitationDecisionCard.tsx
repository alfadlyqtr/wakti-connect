
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { StaffInvitation } from "@/hooks/staff/types";
import InvitationDetails from "./InvitationDetails";
import InvitationResponseActions from "./InvitationResponseActions";

interface InvitationDecisionCardProps {
  invitation: StaffInvitation;
  isResponding: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

const InvitationDecisionCard: React.FC<InvitationDecisionCardProps> = ({
  invitation,
  isResponding,
  onAccept,
  onDecline
}) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center">
          <Building2 className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>Join {invitation.business_name}</CardTitle>
        <CardDescription>
          You've been invited to join {invitation.business_name} as a staff member
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <InvitationDetails invitation={invitation} />
      </CardContent>
      
      <CardFooter>
        <InvitationResponseActions 
          onAccept={onAccept}
          onDecline={onDecline}
          isResponding={isResponding}
        />
      </CardFooter>
    </Card>
  );
};

export default InvitationDecisionCard;
