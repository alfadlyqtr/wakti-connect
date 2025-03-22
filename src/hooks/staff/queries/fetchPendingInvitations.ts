
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StaffInvitation } from "../types";

/**
 * Hook for fetching only pending staff invitations
 */
export const useFetchPendingInvitations = () => {
  return useQuery({
    queryKey: ['pendingStaffInvitations'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }
      
      const { data, error } = await supabase
        .from('staff_invitations')
        .select('*')
        .eq('business_id', session.session.user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return data as StaffInvitation[];
    }
  });
};
