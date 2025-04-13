
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type Profile = {
  id: string;
  full_name?: string;
  avatar_url?: string;
  account_type?: 'individual' | 'business' | 'staff';
  email?: string;
  phone?: string;
  country?: string;
  timezone?: string;
  created_at?: string;
  updated_at?: string;
};

export function useProfile(userId: string | undefined) {
  const {
    data: profile,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
      
      return data as Profile;
    },
    enabled: !!userId,
  });

  return {
    profile,
    isLoading,
    error,
    refetch,
  };
}
