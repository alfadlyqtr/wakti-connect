
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StaffInvitation, CreateInvitationData } from "../types";
import { toast } from "@/components/ui/use-toast";

/**
 * Hook for creating staff invitations with link-only approach
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
      
      toast({
        title: "Invitation Created",
        description: "Copy and share the invitation link with your staff member",
        variant: "success"
      });
      
      return invitation as StaffInvitation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffInvitations'] });
    }
  });
};
