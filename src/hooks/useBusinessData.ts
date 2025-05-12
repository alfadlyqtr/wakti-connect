
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BusinessSocialLink, SocialPlatform } from '@/types/business.types';

export interface BusinessData {
  profile: any;
  socialLinks: BusinessSocialLink[];
  isLoading: boolean;
  error: Error | null;
}

export const useBusinessData = (identifier?: string) => {
  const [data, setData] = useState<BusinessData>({
    profile: null,
    socialLinks: [],
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const fetchBusinessData = async () => {
      if (!identifier) {
        setData({
          profile: null,
          socialLinks: [],
          isLoading: false,
          error: new Error('Business identifier is required')
        });
        return;
      }

      try {
        let profile;
        let profileError;
        
        // Check if the identifier is a UUID or a slug
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
        
        if (isUUID) {
          // Fetch by ID
          const { data: profileData, error: error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', identifier)
            .single();
            
          profile = profileData;
          profileError = error;
        } else {
          // Fetch by slug
          const { data: profileData, error: error } = await supabase
            .from('profiles')
            .select('*')
            .eq('slug', identifier)
            .single();
            
          profile = profileData;
          profileError = error;
        }

        if (profileError) {
          console.error('Error fetching business profile:', profileError);
          setData(prev => ({
            ...prev,
            error: profileError,
            isLoading: false
          }));
          return;
        }

        // Fetch social links for the business using the profile ID
        const { data: socialLinksData, error: socialLinksError } = await supabase
          .from('business_social_links')
          .select('*')
          .eq('business_id', profile.id);

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

        // Convert socialLinksData to BusinessSocialLink[] with type assertion for platform
        const typedSocialLinks: BusinessSocialLink[] = socialLinksData?.map(link => ({
          ...link,
          platform: link.platform as SocialPlatform
        })) || [];

        // Set everything in state
        setData({
          profile,
          socialLinks: typedSocialLinks,
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
  }, [identifier]);

  return data;
};
