
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StaffInvitation, CreateInvitationData } from "../types";
import { toast } from "@/components/ui/use-toast";

/**
 * Hook for creating staff invitations
 */
export const useCreateInvitation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateInvitationData): Promise<StaffInvitation> => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }
      
      // Create a unique token for the invitation
      const token = crypto.randomUUID();
      
      // Set expiration date (48 hours from now)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 48);
      
      // Insert the invitation into the database
      const { data: invitation, error } = await supabase
        .from('staff_invitations')
        .insert({
          business_id: session.session.user.id,
          name: data.name,
          email: data.email,
          role: data.role,
          position: data.position || null,
          token: token,
          status: 'pending',
          expires_at: expiresAt.toISOString()
        })
        .select('*')
        .single();
        
      if (error) throw error;
      
      try {
        // Use Supabase Auth's invite user functionality
        const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(data.email, {
          data: {
            invitation_id: invitation.id,
            business_id: session.session.user.id,
            role: data.role,
            invitation_token: token
          },
          redirectTo: `${window.location.origin}/auth/staff-signup?token=${token}`
        });
        
        if (inviteError) {
          console.error("Error sending invitation email:", inviteError);
          throw inviteError;
        }
        
        toast({
          title: "Invitation Sent",
          description: `Invitation email sent to ${data.email}`
        });
      } catch (emailError) {
        console.error("Error with invitation email:", emailError);
        toast({
          title: "Invitation Created",
          description: "Invitation created, but there was an issue sending the email. The user can still register using the invitation link.",
          variant: "destructive"
        });
      }
      
      return invitation as StaffInvitation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffInvitations'] });
    }
  });
};
