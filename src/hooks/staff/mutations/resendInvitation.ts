
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StaffInvitation } from "../types";
import { toast } from "@/components/ui/use-toast";

/**
 * Hook for extending staff invitations (previously "resending")
 * Now just extends the expiration date without sending emails
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
      
      toast({
        title: "Invitation Extended",
        description: `Invitation for ${invitation.email} is now valid for another 48 hours`
      });
      
      return updatedInvitation as StaffInvitation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffInvitations'] });
    }
  });
};
