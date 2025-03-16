
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

export type ProfileWithEmail = Tables<"profiles"> & {
  email?: string;
};

export const useProfileSettings = () => {
  return useQuery<ProfileWithEmail>({
    queryKey: ['settingsProfile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;
      
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      // Create a proper profile object with all required fields even if data is null
      const profileWithEmail: ProfileWithEmail = data || {
        id: session.user.id,
        account_type: 'free',
        is_searchable: true,
        avatar_url: '',
        business_name: '',
        created_at: new Date().toISOString(),
        display_name: '',
        full_name: '',
        occupation: '',
        theme_preference: 'light',
        updated_at: new Date().toISOString()
      };
      
      if (session.user) {
        profileWithEmail.email = session.user.email;
      }
        
      return profileWithEmail;
    }
  });
};
