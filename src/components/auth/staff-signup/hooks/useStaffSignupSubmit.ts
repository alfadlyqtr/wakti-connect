
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useStaffInvitations } from "@/hooks/staff/useStaffInvitations";
import { StaffInvitation } from "@/hooks/staff/types";
import { StaffSignupFormValues } from "../validation";
import { 
  createUserAccount, 
  createStaffRecord 
} from "../helpers/createAccount";

export const useStaffSignupSubmit = (invitation: StaffInvitation | null, token?: string) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { acceptInvitation } = useStaffInvitations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const onSubmit = async (values: StaffSignupFormValues) => {
    if (!invitation || !token) return;
    
    setIsSubmitting(true);
    
    try {
      // Create user account
      const user = await createUserAccount(invitation, values.password);
      
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
          userId: user.id
        });
        console.log("Invitation accepted and staff record created");
      } catch (acceptError) {
        console.error("Error in acceptInvitation mutation:", acceptError);
        // Fall back to direct database operations for creating staff record
        await createStaffRecord(invitation, user.id);
      }
      
      toast({
        title: "Account created successfully",
        description: `You can now log in to your staff account with ${invitation.business_name}`,
      });
      
      // Navigate to login
      navigate("/auth");
      
      return true;
    } catch (error) {
      console.error("Error creating staff account:", error);
      toast({
        title: "Error creating account",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return { isSubmitting, onSubmit };
};
