
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, RefreshCw, Trash2, Loader2, Mail } from "lucide-react";
import { useStaffInvitations } from "@/hooks/useStaffInvitations";
import { formatInvitationDate, isInvitationExpired } from "@/utils/authUtils";
import { useToast } from "@/hooks/use-toast";

const InvitationsTab = () => {
  const { invitations, isLoading, resendInvitation, cancelInvitation } = useStaffInvitations();
  const { toast } = useToast();
  
  const copyInviteLink = (token: string) => {
    const inviteUrl = `${window.location.origin}/auth/staff-signup?token=${token}`;
    navigator.clipboard.writeText(inviteUrl);
    toast({
      title: "Link copied",
      description: "Invitation link copied to clipboard"
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {invitations && invitations.length > 0 ? (
        <div className="grid gap-4">
          {invitations.map(invitation => {
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
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => copyInviteLink(invitation.token)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Link
                        </Button>
                        
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => resendInvitation.mutate(invitation.id)}
                          disabled={resendInvitation.isPending}
                        >
                          {resendInvitation.isPending ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4 mr-2" />
                          )}
                          Resend
                        </Button>
                        
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => cancelInvitation.mutate(invitation.id)}
                          disabled={cancelInvitation.isPending}
                        >
                          {cancelInvitation.isPending ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 mr-2" />
                          )}
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <Mail className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Invitations</h3>
            <p className="text-muted-foreground mb-4">
              You haven't sent any staff invitations yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InvitationsTab;
