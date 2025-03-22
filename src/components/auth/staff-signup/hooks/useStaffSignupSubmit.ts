
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useStaffInvitations } from "@/hooks/staff/useStaffInvitations";
import { StaffInvitation } from "@/hooks/staff/types";
import { StaffFormValues } from "../validation";

export interface StaffSignupFormValues extends StaffFormValues {}

export const useStaffSignupSubmit = (invitation: StaffInvitation | null, token?: string) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { acceptInvitation } = useStaffInvitations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const onSubmit = async (values: StaffSignupFormValues) => {
    if (!invitation || !token) return false;
    
    setIsSubmitting(true);
    
    try {
      // Get current authenticated user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Create user with password
        const { data: { user }, error: createUserError } = await supabase.auth.signUp({
          email: invitation.email,
          password: values.password,
          options: {
            data: {
              full_name: invitation.name
            }
          }
        });
        
        if (createUserError || !user) {
          throw createUserError || new Error("Failed to create user account");
        }
        
        // Update the invitation status
        const { error: updateError } = await supabase
          .from('staff_invitations')
          .update({
            status: 'accepted',
            updated_at: new Date().toISOString()
          })
          .eq('token', token);
          
        if (updateError) {
          console.error("Error updating invitation directly:", updateError);
        }
        
        // Create staff record
        const { error: staffError } = await supabase
          .from('business_staff')
          .insert({
            business_id: invitation.business_id,
            staff_id: user.id,
            name: invitation.name,
            email: invitation.email,
            position: invitation.position || 'Staff Member',
            role: invitation.role || 'staff',
            staff_number: `${invitation.business_name.substring(0, 3).toUpperCase()}_Staff001`,
            status: 'active',
            permissions: {
              can_view_tasks: true,
              can_manage_tasks: false,
              can_message_staff: true,
              can_manage_bookings: false,
              can_create_job_cards: false,
              can_track_hours: true,
              can_log_earnings: false,
              can_edit_profile: true,
              can_view_customer_bookings: false,
              can_view_analytics: false
            }
          });
          
        if (staffError) {
          throw staffError;
        }
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
