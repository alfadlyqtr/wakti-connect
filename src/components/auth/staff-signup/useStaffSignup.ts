
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useStaffInvitations } from "@/hooks/staff/useStaffInvitations";
import { z } from "zod";

// Form validation schema
const staffSignupSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
})
.refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type StaffSignupFormValues = z.infer<typeof staffSignupSchema>;

export const useStaffSignup = (token?: string) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { verifyInvitation, acceptInvitation } = useStaffInvitations();
  
  const [invitation, setInvitation] = useState<any>(null);
  const [status, setStatus] = useState<"loading" | "valid" | "invalid">("loading");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Verify the invitation token
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus("invalid");
        return;
      }
      
      try {
        console.log("Verifying invitation token:", token);
        const invitation = await verifyInvitation.mutateAsync({ token });
        console.log("Invitation verified:", invitation);
        setInvitation(invitation);
        setStatus("valid");
      } catch (error) {
        console.error("Error verifying invitation:", error);
        setStatus("invalid");
      }
    };
    
    verifyToken();
  }, [token, verifyInvitation]);
  
  const onSubmit = async (values: StaffSignupFormValues) => {
    if (!invitation || !token) return;
    
    setIsSubmitting(true);
    
    try {
      console.log("Creating staff account for:", invitation);
      
      // Create user account with staff account_type
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: invitation.email,
        password: values.password,
        options: {
          data: {
            full_name: invitation.name,
            account_type: 'staff',
            display_name: invitation.name
          }
        }
      });
      
      if (authError) {
        console.error("Auth error:", authError);
        throw authError;
      }
      
      if (!authData.user) {
        throw new Error("Failed to create user account");
      }
      
      console.log("User account created:", authData.user.id);
      
      // First, try to update the invitation status directly in case the RLS is causing issues
      const { error: updateError } = await supabase
        .from('staff_invitations')
        .update({
          status: 'accepted',
          updated_at: new Date().toISOString()
        })
        .eq('token', token);
        
      if (updateError) {
        console.error("Error updating invitation directly:", updateError);
        // Continue despite this error, as we'll try with the mutation
      } else {
        console.log("Invitation status updated to accepted directly");
      }
      
      // Then use the acceptInvitation mutation
      try {
        await acceptInvitation.mutateAsync({
          token,
          userId: authData.user.id
        });
        console.log("Invitation accepted and staff record created");
      } catch (acceptError) {
        console.error("Error in acceptInvitation mutation:", acceptError);
        // Fall back to direct database operations for creating staff record
        await createStaffRecord(invitation, authData.user.id);
      }
      
      toast({
        title: "Account created successfully",
        description: `You can now log in to your staff account with ${invitation.business_name}`,
      });
      
      // Navigate to login
      navigate("/auth");
    } catch (error) {
      console.error("Error creating staff account:", error);
      toast({
        title: "Error creating account",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Fallback function to create staff record directly
  const createStaffRecord = async (invitation: any, userId: string) => {
    try {
      console.log("Creating staff record directly for:", userId);
      
      // Create staff record
      const { data: staffData, error: staffError } = await supabase
        .from('business_staff')
        .insert({
          business_id: invitation.business_id,
          staff_id: userId,
          role: invitation.role || 'staff',
          position: invitation.position || 'staff',
          name: invitation.name,
          email: invitation.email,
          status: 'active'
        })
        .select()
        .single();
        
      if (staffError) {
        console.error("Error creating staff record directly:", staffError);
        throw staffError;
      }
      
      console.log("Created staff record directly:", staffData);
      
      // Send notification to business owner
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: invitation.business_id,
          type: 'staff_joined',
          title: 'New Staff Member Joined',
          content: `${invitation.name} has completed their account setup and joined your team`,
          related_entity_id: userId,
          related_entity_type: 'staff_account'
        });
        
      if (notificationError) {
        console.error("Error sending notification:", notificationError);
      } else {
        console.log("Notification sent to business owner");
      }
      
      // Create bidirectional contact relationships
      if (staffData) {
        const { error: contactError1 } = await supabase
          .from('user_contacts')
          .insert({
            user_id: invitation.business_id,
            contact_id: userId,
            status: 'accepted',
            staff_relation_id: staffData.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          
        const { error: contactError2 } = await supabase
          .from('user_contacts')
          .insert({
            user_id: userId,
            contact_id: invitation.business_id,
            status: 'accepted',
            staff_relation_id: staffData.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          
        if (contactError1 || contactError2) {
          console.error("Error creating contact relationships:", contactError1 || contactError2);
        } else {
          console.log("Created bidirectional contact relationships");
        }
      }
      
      // Update user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          account_type: 'staff',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
        
      if (profileError) {
        console.error("Error updating user profile:", profileError);
      } else {
        console.log("Updated user profile account_type to staff");
      }
      
    } catch (error) {
      console.error("Error in createStaffRecord fallback:", error);
    }
  };

  return {
    invitation,
    status,
    isSubmitting,
    onSubmit
  };
};
