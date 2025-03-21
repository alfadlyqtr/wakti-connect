
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StaffInvitation, AcceptInvitationData } from "../types";

/**
 * Hook for accepting staff invitations
 */
export const useAcceptInvitation = () => {
  return useMutation({
    mutationFn: async ({ token, userId }: AcceptInvitationData): Promise<StaffInvitation> => {
      console.log("Accepting invitation with token:", token, "for user:", userId);
      
      // Get the invitation
      const { data: invitation, error: fetchError } = await supabase
        .from('staff_invitations')
        .select('*')
        .eq('token', token)
        .eq('status', 'pending')
        .single();
        
      if (fetchError) {
        console.error("Error fetching invitation:", fetchError);
        throw new Error('Invalid invitation');
      }
      
      console.log("Found invitation:", invitation);
      
      // Update invitation status
      const { data: updatedInvitation, error: updateError } = await supabase
        .from('staff_invitations')
        .update({
          status: 'accepted',
          updated_at: new Date().toISOString()
        })
        .eq('id', invitation.id)
        .select('*')
        .single();
        
      if (updateError) {
        console.error("Error updating invitation status:", updateError);
        throw updateError;
      }
      
      console.log("Updated invitation status to accepted");
      
      // Create staff record
      const { data: staffData, error: staffError } = await supabase
        .from('business_staff')
        .insert({
          business_id: invitation.business_id,
          staff_id: userId,
          role: invitation.role,
          position: invitation.position || 'staff',
          name: invitation.name,
          email: invitation.email
        })
        .select()
        .single();
        
      if (staffError) {
        console.error("Error creating staff record:", staffError);
        throw staffError;
      }
      
      console.log("Created staff record:", staffData);
      
      // IMPORTANT: Update user's profile to set account_type to 'staff'
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          account_type: 'staff',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
        
      if (profileError) {
        console.error("Error updating user profile account_type:", profileError);
        throw profileError;
      }
      
      console.log("Updated user profile account_type to staff");
      
      // Create a contact relationship between the staff and business
      try {
        // Create from business to staff
        await supabase
          .from('user_contacts')
          .insert({
            user_id: invitation.business_id,
            contact_id: userId,
            status: 'accepted',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          
        // Create from staff to business  
        await supabase
          .from('user_contacts')
          .insert({
            user_id: userId,
            contact_id: invitation.business_id,
            status: 'accepted',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          
        console.log("Created contact relationship between staff and business");
      } catch (contactError) {
        // Log but don't fail the whole process if contact creation fails
        console.error("Error creating contact relationship:", contactError);
      }
      
      // Update staff TypeScript type safety for the returned object
      return {
        ...updatedInvitation,
        status: 'accepted' as const
      } as StaffInvitation;
    }
  });
};
