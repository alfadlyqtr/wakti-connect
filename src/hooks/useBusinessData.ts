
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BusinessSocialLink } from '@/types/business.types';

export interface BusinessData {
  profile: any;
  socialLinks: BusinessSocialLink[];
  isLoading: boolean;
  error: Error | null;
}

export const useBusinessData = (businessId?: string) => {
  const [data, setData] = useState<BusinessData>({
    profile: null,
    socialLinks: [],
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const fetchBusinessData = async () => {
      if (!businessId) {
        setData({
          profile: null,
          socialLinks: [],
          isLoading: false,
          error: new Error('Business ID is required')
        });
        return;
      }

      try {
        // Fetch the business profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', businessId)
          .single();

        if (profileError) {
          console.error('Error fetching business profile:', profileError);
          setData(prev => ({
            ...prev,
            error: profileError,
            isLoading: false
          }));
          return;
        }

        // Fetch social links for the business
        const { data: socialLinks, error: socialLinksError } = await supabase
          .from('business_social_links')
          .select('*')
          .eq('business_id', businessId);

        if (socialLinksError) {
          console.error('Error fetching business social links:', socialLinksError);
          setData({
            profile,
            socialLinks: [],
            isLoading: false,
            error: socialLinksError
          });
          return;
        }

        // Set everything in state
        setData({
          profile,
          socialLinks: socialLinks || [],
          isLoading: false,
          error: null
        });

      } catch (err) {
        console.error('Unexpected error fetching business data:', err);
        setData(prev => ({
          ...prev,
          error: err instanceof Error ? err : new Error('Unknown error occurred'),
          isLoading: false
        }));
      }
    };

    fetchBusinessData();
  }, [businessId]);

  return data;
};
