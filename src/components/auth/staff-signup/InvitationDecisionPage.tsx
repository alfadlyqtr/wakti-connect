
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { useTheme } from "next-themes";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import StaffInvitationVerification from "./StaffInvitationVerification";
import { useStaffInvitations } from "@/hooks/staff/useStaffInvitations";
import InvitationDetails from "./InvitationDetails";
import InvitationResponseActions from "./InvitationResponseActions";

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
        console.log("Invitation verified:", invitation);
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
      console.log("Accepting invitation for:", invitation);
      
      // Update invitation status to accepted - try multiple methods to ensure success
      try {
        // Method 1: Use the Supabase client directly
        const { error: updateError } = await supabase
          .from('staff_invitations')
          .update({ 
            status: 'accepted',
            updated_at: new Date().toISOString()
          })
          .eq('id', invitation.id);
        
        if (updateError) {
          console.error("Error updating invitation status (method 1):", updateError);
          throw updateError;
        }
        
        console.log("Invitation status updated to accepted (method 1)");
      } catch (error1) {
        console.error("Method 1 failed, trying method 2:", error1);
        
        try {
          // Method 2: Try with the token
          const { error: updateError2 } = await supabase
            .from('staff_invitations')
            .update({ 
              status: 'accepted',
              updated_at: new Date().toISOString()
            })
            .eq('token', token);
          
          if (updateError2) {
            console.error("Error updating invitation status (method 2):", updateError2);
            throw updateError2;
          }
          
          console.log("Invitation status updated to accepted (method 2)");
        } catch (error2) {
          console.error("Method 2 failed:", error2);
          // Continue despite errors, we'll still redirect the user
        }
      }
      
      // Send notification to business admin that invitation was accepted - try/catch to prevent blocking flow
      try {
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
        } else {
          console.log("Notification sent to business admin");
        }
      } catch (notifError) {
        console.error("Error in notification process:", notifError);
        // Continue despite notification error
      }
      
      // Redirect to signup page with token, even if previous operations had errors
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
        
        <CardContent>
          <InvitationDetails invitation={invitation} />
        </CardContent>
        
        <CardFooter>
          <InvitationResponseActions 
            onAccept={handleAccept}
            onDecline={handleDecline}
            isResponding={isResponding}
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default InvitationDecisionPage;
