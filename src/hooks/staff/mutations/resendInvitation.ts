
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
      
      try {
        // Call the Edge Function to send the invitation email
        const { error: emailError } = await supabase.functions.invoke('send-staff-invitation', {
          body: { invitationId: updatedInvitation.id }
        });
        
        if (emailError) {
          console.error("Error resending invitation email:", emailError);
          throw emailError;
        }
        
        toast({
          title: "Invitation Resent",
          description: `Invitation email resent to ${invitation.email}`
        });
      } catch (emailError) {
        console.error("Error with invitation email:", emailError);
        toast({
          title: "Invitation Extended",
          description: "Invitation extended, but there was an issue sending the email. You can share the invitation link manually.",
          variant: "destructive"
        });
      }
      
      return updatedInvitation as StaffInvitation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffInvitations'] });
    }
  });
};
