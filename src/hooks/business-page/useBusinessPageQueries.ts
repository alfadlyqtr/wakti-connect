
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessPage, BusinessPageSection, BusinessSocialLink } from '@/types/business.types';
import { useAuth } from '@/hooks/auth';

/**
 * Query to fetch a public business page by slug
 */
export const useBusinessPageQuery = (slug?: string) => {
  return useQuery({
    queryKey: ['business-page', slug],
    queryFn: async () => {
      if (!slug) return null;
      
      const { data, error } = await supabase
        .from('business_pages')
        .select('*')
        .eq('page_slug', slug)
        .eq('is_published', true)
        .single();
        
      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }
      
      return data as BusinessPage;
    },
    enabled: !!slug
  });
};

/**
 * Query to fetch the business page owned by the current authenticated user
 */
export const useOwnerBusinessPageQuery = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['business-page-owner'],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('business_pages')
        .select('*')
        .eq('business_id', user.id)
        .maybeSingle();
        
      if (error) throw error;
      
      return data as BusinessPage | null;
    },
    enabled: !!user
  });
};

/**
 * Query to fetch sections for a business page
 */
export const usePageSectionsQuery = (pageId?: string) => {
  return useQuery({
    queryKey: ['page-sections', pageId],
    queryFn: async () => {
      if (!pageId) return [];
      
      const { data, error } = await supabase
        .from('business_page_sections')
        .select('*')
        .eq('page_id', pageId)
        .order('section_order', { ascending: true });
        
      if (error) throw error;
      
      return data as BusinessPageSection[];
    },
    enabled: !!pageId
  });
};

/**
 * Query to fetch social links for a business
 */
export const useSocialLinksQuery = (businessId?: string) => {
  return useQuery({
    queryKey: ['social-links', businessId],
    queryFn: async () => {
      if (!businessId) return [];
      
      const { data, error } = await supabase
        .from('business_social_links')
        .select('*')
        .eq('business_id', businessId);
        
      if (error) throw error;
      
      return data as BusinessSocialLink[];
    },
    enabled: !!businessId
  });
};
