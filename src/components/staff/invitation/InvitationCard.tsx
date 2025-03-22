
import React from "react";
import { format, isAfter } from "date-fns";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  MailCheck, 
  Trash2, 
  User, 
  CheckCircle2, 
  XCircle,
  ExternalLink,
  Copy
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StaffInvitation } from "@/hooks/staff/types";
import { toast } from "@/components/ui/use-toast";

interface InvitationCardProps {
  invitation: StaffInvitation;
  onResend: (id: string) => void;
  onCancel: (id: string) => void;
  isProcessing?: boolean;
  isResending?: boolean;
  isCancelling?: boolean;
}

const InvitationCard: React.FC<InvitationCardProps> = ({
  invitation,
  onResend,
  onCancel,
  isProcessing,
  isResending,
  isCancelling
}) => {
  const isExpired = isAfter(new Date(), new Date(invitation.expires_at));
  
  // Generate the invitation link
  const invitationLink = `${window.location.origin}/auth/staff-invitation?token=${invitation.token}`;
  
  // Function to handle copying link to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(invitationLink);
    toast({
      title: "Link copied",
      description: "The invitation link has been copied to clipboard"
    });
  };
  
  // Function to open the invitation link in a new tab
  const handleOpenLink = () => {
    window.open(invitationLink, '_blank');
  };

  return (
    <Card className="overflow-hidden shadow-sm">
      <CardHeader className="py-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10 border">
              <AvatarFallback className="bg-primary/10 text-primary">
                {invitation.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">{invitation.name}</CardTitle>
              <CardDescription className="text-xs flex items-center gap-1">
                <User className="h-3 w-3" />
                {invitation.position || invitation.role}
              </CardDescription>
            </div>
          </div>
          
          {invitation.status === 'pending' ? (
            <Badge 
              variant={isExpired ? "destructive" : "outline"} 
              className="capitalize font-normal text-xs"
            >
              {isExpired ? "Expired" : "Pending"}
            </Badge>
          ) : (
            <Badge 
              variant={invitation.status === 'accepted' ? "success" : "destructive"} 
              className="capitalize font-normal text-xs flex items-center gap-1"
            >
              {invitation.status === 'accepted' ? 
                <>
                  <CheckCircle2 className="h-3 w-3" />
                  Accepted
                </> : 
                <>
                  <XCircle className="h-3 w-3" />
                  Declined
                </>
              }
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="py-2">
        <div className="text-sm text-muted-foreground flex items-start gap-1 mb-1">
          <span className="shrink-0">Email:</span>
          <span className="font-medium text-foreground">{invitation.email}</span>
        </div>
        <div className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          <span>
            {invitation.status === 'pending' ? 
              `Sent ${format(new Date(invitation.created_at), "MMM d, yyyy")} · Expires ${format(new Date(invitation.expires_at), "MMM d, yyyy")}` :
              `Updated ${format(new Date(invitation.updated_at), "MMM d, yyyy")}`
            }
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 pb-3 flex flex-wrap gap-2">
        {invitation.status === 'pending' ? (
          <>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 h-8 text-xs gap-1"
              onClick={() => onResend(invitation.id)}
              disabled={isProcessing || isResending}
            >
              <MailCheck className="h-3.5 w-3.5" />
              Resend
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              className="flex-1 h-8 text-xs gap-1 text-destructive border-destructive hover:bg-destructive/10"
              onClick={() => onCancel(invitation.id)}
              disabled={isProcessing || isCancelling}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Cancel
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              className="flex-1 h-8 text-xs gap-1"
              onClick={handleOpenLink}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Open
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              className="flex-1 h-8 text-xs gap-1"
              onClick={handleCopyLink}
            >
              <Copy className="h-3.5 w-3.5" />
              Copy Link
            </Button>
          </>
        ) : (
          <div className="w-full text-xs text-center text-muted-foreground">
            This invitation has been {invitation.status}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default InvitationCard;
