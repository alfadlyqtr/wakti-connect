
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
      const { data, error } = await supabase
        .from('business_staff')
        .select('*')
        .eq('business_id', supabase.auth.session()?.user?.id)
        .eq('status', 'active');

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    }
  });
};
