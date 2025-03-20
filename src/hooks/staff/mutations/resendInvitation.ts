
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StaffInvitation } from "../types";
import { toast } from "@/components/ui/use-toast";

/**
 * Hook for resending staff invitations
 */
export const useResendInvitation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (invitationId: string): Promise<StaffInvitation> => {
      // Get the invitation
      const { data: invitation, error: fetchError } = await supabase
        .from('staff_invitations')
        .select('*')
        .eq('id', invitationId)
        .single();
        
      if (fetchError) throw fetchError;
      
      // Update expiration date
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 48);
      
      // Update invitation
      const { data: updatedInvitation, error: updateError } = await supabase
        .from('staff_invitations')
        .update({
          expires_at: expiresAt.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', invitationId)
        .select('*')
        .single();
        
      if (updateError) throw updateError;
      
      // Note: We're removing the admin invite functionality that was causing the error
      // Instead, we'll update the invitation and show a message to the user
      
      toast({
        title: "Invitation Updated",
        description: `Invitation extended for ${invitation.email}. They can still register using the invitation link.`
      });
      
      return updatedInvitation as StaffInvitation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffInvitations'] });
    }
  });
};
