
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PostgrestResponse } from '@supabase/supabase-js';

export interface StaffQueryResult {
  id: string;
  staff_id: string;
  business_id: string;
  name: string;
  email: string | null;
  position: string | null;
  role: string | null;
  status: string | null;
  is_service_provider: boolean | null;
  permissions: Record<string, boolean> | null;
  staff_number: string | null;
  profile_image_url: string | null;
  created_at: string;
}

export const useStaffQuery = () => {
  return useQuery<StaffQueryResult[], Error>({
    queryKey: ['staffMembers'],
    queryFn: async () => {
      // Get current session
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      // Fetch staff data
      const { data, error } = await supabase
        .from('business_staff')
        .select('*')
        .eq('business_id', userId)
        .eq('status', 'active');

      if (error) {
        throw new Error(error.message);
      }
      
      // Transform the data to ensure permissions is properly typed
      return (data || []).map(staff => ({
        ...staff,
        permissions: typeof staff.permissions === 'string' 
          ? JSON.parse(staff.permissions as string)
          : (staff.permissions as Record<string, boolean> | null)
      })) as StaffQueryResult[];
    },
    staleTime: 60000, // Consider data fresh for 1 minute
    refetchOnWindowFocus: true // Automatically refetch when window regains focus
  });
};
