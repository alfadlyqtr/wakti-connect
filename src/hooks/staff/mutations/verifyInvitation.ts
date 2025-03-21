
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StaffInvitation, VerifyInvitationData } from "../types";

/**
 * Hook for verifying staff invitations
 */
export const useVerifyInvitation = () => {
  return useMutation({
    mutationFn: async ({ token }: VerifyInvitationData): Promise<StaffInvitation> => {
      // Check if token exists and is valid
      const { data, error } = await supabase
        .from('staff_invitations')
        .select(`
          *,
          profiles(business_name)
        `)
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
      
      // Extract business_name from the profiles relation
      const businessName = data.profiles?.business_name || 'Business';
      
      return {
        ...data,
        business_name: businessName
      } as StaffInvitation;
    }
  });
};
