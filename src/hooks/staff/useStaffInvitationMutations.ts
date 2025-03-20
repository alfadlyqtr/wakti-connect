import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StaffInvitation, CreateInvitationData, VerifyInvitationData, AcceptInvitationData, UseStaffInvitationsMutations } from "./types";
import { toast } from "@/components/ui/use-toast";

/**
 * Hook for staff invitation mutations (create, resend, cancel, verify, accept)
 */
export const useStaffInvitationMutations = (): UseStaffInvitationsMutations => {
  const queryClient = useQueryClient();

  // Create staff invitation
  const createInvitation = useMutation({
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

  // Resend staff invitation
  const resendInvitation = useMutation({
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

  // Cancel staff invitation
  const cancelInvitation = useMutation({
    mutationFn: async (invitationId: string): Promise<string> => {
      const { error } = await supabase
        .from('staff_invitations')
        .delete()
        .eq('id', invitationId);
        
      if (error) throw error;
      
      toast({
        title: "Invitation Cancelled",
        description: "The staff invitation has been cancelled"
      });
      
      return invitationId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffInvitations'] });
    }
  });

  // Verify staff invitation
  const verifyInvitation = useMutation({
    mutationFn: async ({ token }: VerifyInvitationData): Promise<StaffInvitation> => {
      // Check if token exists and is valid
      const { data, error } = await supabase
        .from('staff_invitations')
        .select('*')
        .eq('token', token)
        .eq('status', 'pending')
        .single();
        
      if (error) throw new Error('Invalid or expired invitation link');
      
      // Check if invitation has expired
      const expiresAt = new Date(data.expires_at);
      const now = new Date();
      
      if (now > expiresAt) {
        throw new Error('This invitation has expired');
      }
      
      return data as StaffInvitation;
    }
  });

  // Accept staff invitation
  const acceptInvitation = useMutation({
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

  return {
    createInvitation,
    resendInvitation,
    cancelInvitation,
    verifyInvitation,
    acceptInvitation
  };
};
