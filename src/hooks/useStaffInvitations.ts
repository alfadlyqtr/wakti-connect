
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { generateRandomToken } from "@/utils/authUtils";

export interface StaffInvitation {
  id: string;
  business_id: string;
  email: string;
  name: string;
  role: string;
  position?: string;
  token: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  created_at: string;
  updated_at: string;
  expires_at: string;
}

export const useStaffInvitations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all invitations for the business
  const { data: invitations, isLoading, error } = useQuery({
    queryKey: ['staffInvitations'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('staff_invitations')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        return data as StaffInvitation[];
      } catch (error) {
        console.error("Error fetching staff invitations:", error);
        toast({
          title: "Error fetching invitations",
          description: error instanceof Error ? error.message : "Unknown error",
          variant: "destructive"
        });
        return [];
      }
    }
  });

  // Create a new staff invitation
  const createInvitation = useMutation({
    mutationFn: async ({ email, name, role, position }: {
      email: string;
      name: string;
      role: string;
      position?: string;
    }) => {
      try {
        // Get current user (business) ID
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");
        
        // Generate a unique token for the invitation
        const token = generateRandomToken();
        
        const { data, error } = await supabase
          .from('staff_invitations')
          .insert({
            business_id: user.id,
            email,
            name,
            role,
            position,
            token,
            status: 'pending'
          })
          .select()
          .single();
          
        if (error) throw error;
        
        toast({
          title: "Invitation sent",
          description: `An invitation has been sent to ${email}`
        });
        
        return data as StaffInvitation;
      } catch (error) {
        console.error("Error creating staff invitation:", error);
        toast({
          title: "Error sending invitation",
          description: error instanceof Error ? error.message : "Unknown error",
          variant: "destructive"
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffInvitations'] });
    }
  });

  // Resend an invitation
  const resendInvitation = useMutation({
    mutationFn: async (invitationId: string) => {
      try {
        // Generate a new token
        const token = generateRandomToken();
        
        const { data, error } = await supabase
          .from('staff_invitations')
          .update({
            token,
            status: 'pending',
            updated_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
          })
          .eq('id', invitationId)
          .select()
          .single();
          
        if (error) throw error;
        
        toast({
          title: "Invitation resent",
          description: `The invitation has been resent to ${data.email}`
        });
        
        return data as StaffInvitation;
      } catch (error) {
        console.error("Error resending invitation:", error);
        toast({
          title: "Error resending invitation",
          description: error instanceof Error ? error.message : "Unknown error",
          variant: "destructive"
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffInvitations'] });
    }
  });

  // Cancel an invitation
  const cancelInvitation = useMutation({
    mutationFn: async (invitationId: string) => {
      try {
        const { error } = await supabase
          .from('staff_invitations')
          .delete()
          .eq('id', invitationId);
          
        if (error) throw error;
        
        toast({
          title: "Invitation cancelled",
          description: "The invitation has been cancelled successfully"
        });
        
        return invitationId;
      } catch (error) {
        console.error("Error cancelling invitation:", error);
        toast({
          title: "Error cancelling invitation",
          description: error instanceof Error ? error.message : "Unknown error",
          variant: "destructive"
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffInvitations'] });
    }
  });

  // Verify an invitation token
  const verifyInvitation = useMutation({
    mutationFn: async ({ token }: { token: string }) => {
      try {
        const { data, error } = await supabase
          .from('staff_invitations')
          .select('*')
          .eq('token', token)
          .eq('status', 'pending')
          .gt('expires_at', new Date().toISOString())
          .single();
          
        if (error) throw error;
        
        if (!data) {
          throw new Error("Invitation not found or expired");
        }
        
        return data as StaffInvitation;
      } catch (error) {
        console.error("Error verifying invitation:", error);
        throw error;
      }
    }
  });

  // Accept an invitation
  const acceptInvitation = useMutation({
    mutationFn: async ({ token, userId }: { token: string, userId: string }) => {
      const { data: invitation, error: inviteError } = await supabase
        .from('staff_invitations')
        .select('*')
        .eq('token', token)
        .single();
        
      if (inviteError) throw inviteError;
      
      // Create staff record
      const { data: staffData, error: staffError } = await supabase
        .from('business_staff')
        .insert({
          business_id: invitation.business_id,
          staff_id: userId,
          name: invitation.name,
          email: invitation.email,
          role: invitation.role,
          position: invitation.position
        })
        .select()
        .single();
        
      if (staffError) throw staffError;
      
      // Update invitation status
      const { error: updateError } = await supabase
        .from('staff_invitations')
        .update({ status: 'accepted' })
        .eq('id', invitation.id);
        
      if (updateError) throw updateError;
      
      return staffData;
    }
  });

  return {
    invitations,
    isLoading,
    error,
    createInvitation,
    resendInvitation,
    cancelInvitation,
    verifyInvitation,
    acceptInvitation
  };
};
