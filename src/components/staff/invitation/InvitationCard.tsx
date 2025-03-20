
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, RefreshCw, Trash2, Loader2, ExternalLink } from "lucide-react";
import { StaffInvitation } from "@/hooks/staff/types";
import { formatInvitationDate, isInvitationExpired } from "@/utils/authUtils";
import { toast } from "@/components/ui/use-toast";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface InvitationCardProps {
  invitation: StaffInvitation;
  resendInvitation: (id: string) => void;
  cancelInvitation: (id: string) => void;
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
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const copyInviteLink = (token: string, id: string) => {
    const inviteUrl = `${window.location.origin}/auth/staff-signup?token=${token}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    
    toast({
      title: "Link copied",
      description: "Invitation link copied to clipboard"
    });
  };
  
  const openInviteLink = (token: string) => {
    const inviteUrl = `${window.location.origin}/auth/staff-signup?token=${token}`;
    window.open(inviteUrl, '_blank');
  };

  const isExpired = isInvitationExpired(invitation.expires_at);
  const isPending = invitation.status === 'pending';
  
  return (
    <Card key={invitation.id} className={isExpired ? "opacity-70" : ""}>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{invitation.name}</span>
              <Badge variant={
                invitation.status === 'accepted' ? "success" :
                invitation.status === 'declined' ? "destructive" :
                isExpired ? "outline" : "secondary"
              }>
                {invitation.status === 'pending' && isExpired ? "Expired" : invitation.status}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              <div>{invitation.email}</div>
              <div>Role: {invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1)}</div>
              <div>Invited: {formatInvitationDate(invitation.created_at)}</div>
              {isPending && !isExpired && (
                <div>Expires: {formatInvitationDate(invitation.expires_at)}</div>
              )}
            </div>
          </div>
          
          {isPending && (
            <div className="flex flex-wrap items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="default"
                      onClick={() => copyInviteLink(invitation.token, invitation.id)}
                      className="w-full sm:w-auto"
                    >
                      {copiedId === invitation.id ? (
                        <>
                          <span className="text-green-100">✓</span>
                          <span className="ml-1">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Link
                        </>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Copy invitation link to clipboard
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => openInviteLink(invitation.token)}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Open invitation link in new tab
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => resendInvitation(invitation.id)}
                      disabled={isResending}
                    >
                      {isResending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4 mr-2" />
                      )}
                      Extend
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Extend invitation for another 48 hours
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => cancelInvitation(invitation.id)}
                      disabled={isCancelling}
                    >
                      {isCancelling ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-2" />
                      )}
                      Cancel
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Cancel this invitation
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InvitationCard;
