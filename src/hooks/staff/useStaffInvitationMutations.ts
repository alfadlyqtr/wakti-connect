
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { generateRandomToken } from "@/utils/authUtils";
import { 
  CreateInvitationData, 
  StaffInvitation, 
  VerifyInvitationData, 
  AcceptInvitationData,
  UseStaffInvitationsMutations
} from "./types";

/**
 * Hook for staff invitation mutation operations
 */
export const useStaffInvitationMutations = (): UseStaffInvitationsMutations => {
  const queryClient = useQueryClient();

  // Create a new invitation
  const createInvitation = useMutation({
    mutationFn: async (invitationData: CreateInvitationData) => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }
      
      // Generate a random token
      const token = generateRandomToken();
      
      // Set expiry to 7 days from now
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);
      
      const { data, error } = await supabase
        .from('staff_invitations')
        .insert({
          business_id: session.session.user.id,
          name: invitationData.name,
          email: invitationData.email,
          role: invitationData.role,
          position: invitationData.position || null,
          token: token,
          status: 'pending',
          expires_at: expiryDate.toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // TODO: Send email with invitation link
      // For now, we'll just show a toast with the invitation link
      toast({
        title: "Invitation sent",
        description: `Invitation sent to ${invitationData.email}`
      });
      
      return data as StaffInvitation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffInvitations'] });
    }
  });

  // Verify an invitation token
  const verifyInvitation = useMutation({
    mutationFn: async ({ token }: VerifyInvitationData) => {
      if (!token) {
        throw new Error('Invalid token');
      }
      
      const { data, error } = await supabase
        .from('staff_invitations')
        .select('*')
        .eq('token', token)
        .eq('status', 'pending')
        .single();
      
      if (error) throw new Error('Invalid or expired invitation');
      
      // Check if the invitation has expired
      if (new Date(data.expires_at) < new Date()) {
        throw new Error('Invitation has expired');
      }
      
      return data as StaffInvitation;
    }
  });

  // Accept an invitation
  const acceptInvitation = useMutation({
    mutationFn: async ({ token, userId }: AcceptInvitationData) => {
      if (!token || !userId) {
        throw new Error('Invalid token or user ID');
      }
      
      // Verify the invitation token first
      const { data: invitation, error: verifyError } = await supabase
        .from('staff_invitations')
        .select('*')
        .eq('token', token)
        .eq('status', 'pending')
        .single();
      
      if (verifyError) throw new Error('Invalid or expired invitation');
      
      // Check if the invitation has expired
      if (new Date(invitation.expires_at) < new Date()) {
        throw new Error('Invitation has expired');
      }
      
      // Update the invitation status to accepted
      const { error: updateError } = await supabase
        .from('staff_invitations')
        .update({ 
          status: 'accepted',
          updated_at: new Date().toISOString()
        })
        .eq('token', token);
      
      if (updateError) throw updateError;
      
      // Create the business_staff record
      const { error: staffError } = await supabase
        .from('business_staff')
        .insert({
          business_id: invitation.business_id,
          staff_id: userId,
          role: invitation.role,
          position: invitation.position
        });
      
      if (staffError) throw staffError;
      
      return invitation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffInvitations'] });
      queryClient.invalidateQueries({ queryKey: ['businessStaff'] });
    }
  });

  // Resend an invitation
  const resendInvitation = useMutation({
    mutationFn: async (invitationId: string) => {
      // Get current invitations from query cache
      const invitations = queryClient.getQueryData<StaffInvitation[]>(['staffInvitations']);
      
      // Find the invitation in the current data
      const invitation = invitations?.find(inv => inv.id === invitationId);
      
      if (!invitation) {
        throw new Error('Invitation not found');
      }
      
      // Update the expiry date to 7 days from now
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);
      
      const { data, error } = await supabase
        .from('staff_invitations')
        .update({
          expires_at: expiryDate.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', invitationId)
        .select()
        .single();
      
      if (error) throw error;
      
      // TODO: Send email with invitation link
      // For now, we'll just show a toast
      toast({
        title: "Invitation resent",
        description: `Invitation resent to ${invitation.email}`
      });
      
      return data as StaffInvitation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffInvitations'] });
    }
  });

  // Cancel an invitation
  const cancelInvitation = useMutation({
    mutationFn: async (invitationId: string) => {
      const { error } = await supabase
        .from('staff_invitations')
        .delete()
        .eq('id', invitationId);
      
      if (error) throw error;
      
      toast({
        title: "Invitation cancelled",
        description: "The invitation has been cancelled."
      });
      
      return invitationId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffInvitations'] });
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
