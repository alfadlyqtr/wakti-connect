
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
        // Use Supabase Auth's invite user functionality for resending
        const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(invitation.email, {
          data: {
            invitation_id: invitation.id,
            business_id: invitation.business_id,
            role: invitation.role,
            invitation_token: invitation.token
          },
          redirectTo: `${window.location.origin}/auth/staff-signup?token=${invitation.token}`
        });
        
        if (inviteError) {
          console.error("Error resending invitation email:", inviteError);
          throw inviteError;
        }
        
        toast({
          title: "Invitation Resent",
          description: `Invitation email resent to ${invitation.email}`
        });
      } catch (emailError) {
        console.error("Error with invitation email:", emailError);
        toast({
          title: "Invitation Updated",
          description: "Invitation updated, but there was an issue resending the email. The user can still register using the invitation link.",
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
