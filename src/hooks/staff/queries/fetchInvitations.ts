
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StaffInvitation } from "../types";

/**
 * Hook for fetching all staff invitations
 */
export const useFetchInvitations = () => {
  return useQuery({
    queryKey: ['staffInvitations'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }
      
      const { data, error } = await supabase
        .from('staff_invitations')
        .select('*')
        .eq('business_id', session.session.user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return data as StaffInvitation[];
    }
  });
};
