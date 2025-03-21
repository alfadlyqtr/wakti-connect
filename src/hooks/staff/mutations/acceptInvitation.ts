
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StaffInvitation, AcceptInvitationData } from "../types";
import { toast } from "@/components/ui/use-toast";

/**
 * Hook for accepting staff invitations
 */
export const useAcceptInvitation = () => {
  const queryClient = useQueryClient();
  
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
      
      // Create a bidirectional contact relationship between the staff and business
      try {
        // First, check if the relationship already exists
        const { data: existingContactData } = await supabase
          .from('user_contacts')
          .select('id')
          .or(`and(user_id.eq.${invitation.business_id},contact_id.eq.${userId}),and(user_id.eq.${userId},contact_id.eq.${invitation.business_id})`)
          .maybeSingle();
          
        if (!existingContactData) {
          // Create from business to staff with 'accepted' status
          await supabase
            .from('user_contacts')
            .insert({
              user_id: invitation.business_id,
              contact_id: userId,
              status: 'accepted',
              staff_relation_id: staffData.id, // Link to staff relationship
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
            
          // Create from staff to business with 'accepted' status  
          await supabase
            .from('user_contacts')
            .insert({
              user_id: userId,
              contact_id: invitation.business_id,
              status: 'accepted',
              staff_relation_id: staffData.id, // Link to staff relationship
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
            
          console.log("Created bidirectional contact relationship between staff and business");
        } else {
          console.log("Contact relationship already exists, skipping creation");
        }
      } catch (contactError) {
        // Log but don't fail the whole process if contact creation fails
        console.error("Error creating contact relationship:", contactError);
      }
      
      // Get business info for the toast notification
      try {
        const { data: businessData } = await supabase
          .from('profiles')
          .select('business_name')
          .eq('id', invitation.business_id)
          .single();
          
        if (businessData?.business_name) {
          // Update cache to reflect the staff relationship
          queryClient.invalidateQueries({ queryKey: ['dashboardUserProfile'] });
          
          // Show welcome toast
          toast({
            title: `Welcome to ${businessData.business_name}!`,
            description: "You've successfully joined as a staff member.",
            duration: 5000,
          });
        }
      } catch (error) {
        console.error("Error fetching business data for notification:", error);
      }
      
      // Update TypeScript type safety for the returned object
      return {
        ...updatedInvitation,
        status: 'accepted' as const
      } as StaffInvitation;
    },
    onSuccess: () => {
      // Invalidate relevant queries when the invitation is accepted
      queryClient.invalidateQueries({ queryKey: ['staffBusinessInfo'] });
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    }
  });
};
