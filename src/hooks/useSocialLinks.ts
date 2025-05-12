
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SocialPlatform } from "@/types/business.types";
import { toast } from "@/components/ui/use-toast";

export interface BusinessSocialLink {
  id: string;
  business_id: string;
  platform: SocialPlatform;
  url: string;
}

interface UpdateSocialLinkParams {
  businessId: string;
  platform: string;
  url: string;
}

export const useSocialLinks = (businessId: string) => {
  const [socialLinks, setSocialLinks] = useState<BusinessSocialLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSocialLinks = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('business_social_links')
        .select('*')
        .eq('business_id', businessId);
      
      if (error) throw error;
      
      setSocialLinks(data || []);
    } catch (err) {
      console.error('Error fetching social links:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch social links'));
    } finally {
      setIsLoading(false);
    }
  };

  // Load links when component mounts
  useEffect(() => {
    if (businessId) {
      fetchSocialLinks();
    }
  }, [businessId]);

  // Function to update a social link
  const updateSocialLink = async ({ businessId, platform, url }: UpdateSocialLinkParams) => {
    try {
      // Check if link already exists
      const existingLink = socialLinks.find(link => link.platform === platform);
      
      if (existingLink) {
        // If URL is empty, delete the link
        if (!url.trim()) {
          const { error } = await supabase
            .from('business_social_links')
            .delete()
            .eq('id', existingLink.id);
          
          if (error) throw error;
        } else {
          // Update existing link
          const { error } = await supabase
            .from('business_social_links')
            .update({ url })
            .eq('id', existingLink.id);
          
          if (error) throw error;
        }
      } else if (url.trim()) {
        // Create new link if it doesn't exist and URL is not empty
        const { error } = await supabase
          .from('business_social_links')
          .insert({
            business_id: businessId,
            platform,
            url,
          });
        
        if (error) throw error;
      }
      
      // Refresh social links after update
      await fetchSocialLinks();
      
      return true;
    } catch (err) {
      console.error('Error updating social link:', err);
      throw err;
    }
  };

  return {
    socialLinks,
    isLoading,
    error,
    updateSocialLink,
    refreshLinks: fetchSocialLinks,
  };
};
