
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { AlertCircle, Check, X, Building2 } from "lucide-react";
import { useTheme } from "next-themes";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import StaffInvitationVerification from "./StaffInvitationVerification";
import { useStaffInvitations } from "@/hooks/staff/useStaffInvitations";

const InvitationDecisionPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const { verifyInvitation } = useStaffInvitations();
  
  const token = searchParams.get("token") || "";
  const businessSlug = searchParams.get("business") || "";
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isResponding, setIsResponding] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [invitation, setInvitation] = useState<any>(null);
  
  React.useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError("No invitation token provided");
        setIsLoading(false);
        return;
      }
      
      try {
        const invitation = await verifyInvitation.mutateAsync({ token });
        setInvitation(invitation);
        setIsLoading(false);
      } catch (error) {
        console.error("Error verifying invitation:", error);
        setError(error instanceof Error ? error.message : "Invalid invitation");
        setIsLoading(false);
      }
    };
    
    verifyToken();
  }, [token, verifyInvitation]);
  
  const handleAccept = async () => {
    if (isResponding) return; // Prevent multiple submissions
    
    setIsResponding(true);
    
    try {
      // Send notification to business admin that invitation was accepted
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: invitation.business_id,
          type: 'staff_invite_accepted',
          title: 'Staff Invitation Accepted',
          content: `${invitation.name} has accepted your staff invitation`,
          related_entity_id: invitation.id,
          related_entity_type: 'staff_invitation'
        });
      
      if (notificationError) {
        console.error("Error sending notification:", notificationError);
        // Don't block the flow if notification fails
      }
      
      // Update invitation status to accepted
      const { error: updateError } = await supabase
        .from('staff_invitations')
        .update({ 
          status: 'accepted',
          updated_at: new Date().toISOString()
        })
        .eq('id', invitation.id);
      
      if (updateError) {
        console.error("Error updating invitation status:", updateError);
        throw updateError;
      }
      
      // Redirect to signup page with token
      navigate(`/auth/staff-signup?token=${token}&business=${businessSlug}&accepted=true`);
      
    } catch (error) {
      console.error("Error accepting invitation:", error);
      toast({
        title: "Error",
        description: "Failed to process your acceptance. Please try again.",
        variant: "destructive"
      });
      setIsResponding(false);
    }
  };
  
  const handleDecline = async () => {
    if (isResponding) return; // Prevent multiple submissions
    
    setIsResponding(true);
    
    try {
      // Update invitation status to declined
      const { error: updateError } = await supabase
        .from('staff_invitations')
        .update({ 
          status: 'declined',
          updated_at: new Date().toISOString()
        })
        .eq('id', invitation.id);
      
      if (updateError) throw updateError;
      
      // Send notification to business admin that invitation was declined
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: invitation.business_id,
          type: 'staff_invite_declined',
          title: 'Staff Invitation Declined',
          content: `${invitation.name} has declined your staff invitation`,
          related_entity_id: invitation.id,
          related_entity_type: 'staff_invitation'
        });
      
      if (notificationError) {
        console.error("Error sending notification:", notificationError);
        // Don't block the flow if notification fails
      }
      
      toast({
        title: "Invitation Declined",
        description: "You have declined the invitation."
      });
      
      // Redirect to landing page
      navigate("/");
      
    } catch (error) {
      console.error("Error declining invitation:", error);
      toast({
        title: "Error",
        description: "Failed to decline the invitation. Please try again.",
        variant: "destructive"
      });
      setIsResponding(false);
    }
  };

  // Loading, error or verification states
  if (isLoading || error || !invitation) {
    return (
      <StaffInvitationVerification 
        isLoading={isLoading} 
        error={error} 
        invitation={invitation}
        businessName={businessSlug.replace(/-/g, ' ')}
      />
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute top-6 left-6">
        <img 
          src={theme === "dark" ? "/logo-white.png" : "/logo.png"} 
          alt="WAKTI Logo" 
          className="h-8" 
        />
      </div>
      
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
        
        <CardContent className="space-y-4">
          <div className="border rounded-md p-4 bg-muted/50">
            <h3 className="font-medium mb-2">Invitation Details</h3>
            <p className="text-sm">
              <span className="text-muted-foreground">Name:</span> {invitation.name}
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Email:</span> {invitation.email}
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Role:</span> {invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1)}
            </p>
            {invitation.position && (
              <p className="text-sm">
                <span className="text-muted-foreground">Position:</span> {invitation.position}
              </p>
            )}
          </div>
          
          <div className="rounded-md border p-4 bg-amber-50 dark:bg-amber-950/30">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500" />
              <div>
                <h3 className="font-medium text-amber-800 dark:text-amber-400">How would you like to proceed?</h3>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  Accepting will create your staff account. Declining will reject the invitation.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex gap-3 flex-col sm:flex-row">
          <Button 
            variant="default" 
            className="w-full sm:w-1/2 gap-2" 
            onClick={handleAccept}
            disabled={isResponding}
          >
            <Check className="h-4 w-4" />
            Accept & Continue
          </Button>
          <Button 
            variant="outline" 
            className="w-full sm:w-1/2 gap-2 text-destructive border-destructive hover:bg-destructive/10" 
            onClick={handleDecline}
            disabled={isResponding}
          >
            <X className="h-4 w-4" />
            Decline
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default InvitationDecisionPage;
