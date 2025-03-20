
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StaffInvitation, UseStaffInvitationsQueries } from "./types";

/**
 * Hook for fetching staff invitations
 */
export const useStaffInvitationQueries = (): UseStaffInvitationsQueries => {
  // Fetch staff invitations
  const {
    data: invitations,
    isLoading,
    error
  } = useQuery({
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

  return {
    invitations,
    isLoading,
    error: error as Error | null
  };
};
