
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Clock, X, RotateCw, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { StaffInvitation } from "@/hooks/staff/types";

interface InvitationCardProps {
  invitation: StaffInvitation;
  resendInvitation: () => void;
  cancelInvitation: () => void;
  isResending: boolean;
  isCancelling: boolean;
}

const InvitationCard = ({
  invitation,
  resendInvitation,
  cancelInvitation,
  isResending,
  isCancelling
}: InvitationCardProps) => {
  // Format expiry date/time
  const expiryDate = new Date(invitation.expires_at);
  const expiresIn = formatDistanceToNow(expiryDate, { addSuffix: true });
  const isExpired = expiryDate < new Date();
  
  // Format creation date
  const createdAt = formatDistanceToNow(new Date(invitation.created_at), { addSuffix: true });
  
  // Status badge styles
  const getStatusStyles = () => {
    switch (invitation.status) {
      case 'accepted':
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case 'declined':
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case 'pending':
      default:
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
    }
  };
  
  // Status icon
  const getStatusIcon = () => {
    switch (invitation.status) {
      case 'accepted':
        return <Check className="h-3 w-3" />;
      case 'declined':
        return <X className="h-3 w-3" />;
      case 'pending':
      default:
        return <Clock className="h-3 w-3" />;
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{invitation.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{invitation.name}</CardTitle>
              <CardDescription className="text-xs">{invitation.email}</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className={`text-xs flex items-center gap-1 ${getStatusStyles()}`}>
            {getStatusIcon()}
            {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2 text-sm space-y-2">
        <div className="flex justify-between text-muted-foreground">
          <span>Invited {createdAt}</span>
          {invitation.status === 'pending' && (
            <span className={isExpired ? "text-destructive" : ""}>
              Expires {expiresIn}
            </span>
          )}
        </div>
        <div>
          <Badge variant="secondary" className="mr-2">
            {invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1)}
          </Badge>
          {invitation.position && (
            <Badge variant="outline">
              {invitation.position}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        {invitation.status === 'pending' ? (
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button 
              variant="outline" 
              size="sm"
              onClick={resendInvitation}
              disabled={isResending || isCancelling}
              className="flex items-center gap-1"
            >
              {isResending ? (
                <RotateCw className="h-3 w-3 animate-spin" />
              ) : (
                <Send className="h-3 w-3" />
              )}
              Resend
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={cancelInvitation}
              disabled={isResending || isCancelling}
              className="text-destructive hover:bg-destructive/10 flex items-center gap-1"
            >
              {isCancelling ? (
                <RotateCw className="h-3 w-3 animate-spin" />
              ) : (
                <X className="h-3 w-3" />
              )}
              Cancel
            </Button>
          </div>
        ) : (
          <p className="w-full text-center text-sm text-muted-foreground">
            {invitation.status === 'accepted' ? 'Staff member has accepted the invitation' : 'Invitation has been declined'}
          </p>
        )}
      </CardFooter>
    </Card>
  );
};

export default InvitationCard;
