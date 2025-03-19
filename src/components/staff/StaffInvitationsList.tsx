
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Mail, 
  RefreshCw, 
  Clock, 
  CheckCircle, 
  AlarmClock, 
  UserX,
  Trash
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { StaffInvitation, resendStaffInvitation, deleteStaffInvitation } from "@/services/staff/staffInvitationService";
import { format, isAfter } from "date-fns";
import { toast } from "@/components/ui/use-toast";

interface StaffInvitationsListProps {
  invitations: StaffInvitation[];
  isLoading: boolean;
  onRefreshInvitations: () => void;
}

const StaffInvitationsList: React.FC<StaffInvitationsListProps> = ({
  invitations,
  isLoading,
  onRefreshInvitations
}) => {
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleResend = async (invitation: StaffInvitation) => {
    setResendingId(invitation.id);
    try {
      const success = await resendStaffInvitation(invitation.id);
      if (success) {
        toast({
          title: "Invitation resent",
          description: `Invitation has been resent to ${invitation.email}.`,
        });
        onRefreshInvitations();
      } else {
        toast({
          title: "Error",
          description: "Failed to resend invitation.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend invitation.",
        variant: "destructive",
      });
    } finally {
      setResendingId(null);
    }
  };

  const handleDelete = async (invitationId: string) => {
    setDeletingId(invitationId);
    try {
      const success = await deleteStaffInvitation(invitationId);
      if (success) {
        toast({
          title: "Invitation deleted",
          description: "The invitation has been removed.",
        });
        onRefreshInvitations();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete invitation.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete invitation.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const isExpired = (expiresAt: string) => {
    return !isAfter(new Date(expiresAt), new Date());
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!invitations || invitations.length === 0) {
    return (
      <Card className="mb-6 text-center py-6">
        <CardContent>
          <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No pending invitations</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {invitations.map((invitation) => (
        <Card key={invitation.id} className="overflow-hidden">
          <div className="border-l-4 border-wakti-blue p-4">
            <div className="flex flex-wrap justify-between items-start gap-2">
              <div>
                <h3 className="font-medium">{invitation.name}</h3>
                <p className="text-sm text-muted-foreground">{invitation.email}</p>
                {invitation.position && (
                  <p className="text-sm text-muted-foreground">Position: {invitation.position}</p>
                )}
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <Badge variant={invitation.role === "co-admin" ? "secondary" : "outline"}>
                  {invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1)}
                </Badge>
                
                <Badge variant={
                  invitation.status === "accepted" ? "success" : 
                  invitation.status === "expired" || isExpired(invitation.expires_at) ? "destructive" : 
                  "default"
                }>
                  {invitation.status === "accepted" ? "Accepted" : 
                   invitation.status === "expired" || isExpired(invitation.expires_at) ? "Expired" : 
                   "Pending"}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center text-xs text-muted-foreground mt-2">
              <Clock className="h-3 w-3 mr-1" />
              <span>Sent: {format(new Date(invitation.created_at), "PPp")}</span>
              
              <span className="mx-2">•</span>
              
              <AlarmClock className="h-3 w-3 mr-1" />
              <span>Expires: {format(new Date(invitation.expires_at), "PPp")}</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleResend(invitation)}
                      disabled={resendingId === invitation.id || invitation.status === "accepted"}
                    >
                      {resendingId === invitation.id ? (
                        <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4 mr-1" />
                      )}
                      Resend
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {invitation.status === "accepted" 
                      ? "This invitation has already been accepted" 
                      : "Resend invitation email"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    disabled={deletingId === invitation.id}
                  >
                    {deletingId === invitation.id ? (
                      <span className="h-4 w-4 mr-1 border-2 border-t-transparent border-current rounded-full animate-spin"></span>
                    ) : (
                      <Trash className="h-4 w-4 mr-1" />
                    )}
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Invitation</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this invitation to {invitation.email}? 
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => handleDelete(invitation.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StaffInvitationsList;
