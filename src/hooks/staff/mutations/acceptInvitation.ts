
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StaffInvitation, AcceptInvitationData } from "../types";

/**
 * Hook for accepting staff invitations
 */
export const useAcceptInvitation = () => {
  return useMutation({
    mutationFn: async ({ token, userId }: AcceptInvitationData): Promise<StaffInvitation> => {
      // Get the invitation
      const { data: invitation, error: fetchError } = await supabase
        .from('staff_invitations')
        .select('*')
        .eq('token', token)
        .eq('status', 'pending')
        .single();
        
      if (fetchError) throw new Error('Invalid invitation');
      
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
        
      if (updateError) throw updateError;
      
      // Create staff record
      const { error: staffError } = await supabase
        .from('business_staff')
        .insert({
          business_id: invitation.business_id,
          staff_id: userId,
          role: invitation.role,
          position: invitation.position || 'staff'
        });
        
      if (staffError) throw staffError;
      
      // Update staff TypeScript type safety for the returned object
      return {
        ...updatedInvitation,
        status: 'accepted' as const
      } as StaffInvitation;
    }
  });
};
