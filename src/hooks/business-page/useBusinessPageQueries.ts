
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BusinessPage, BusinessPageSection, BusinessSocialLink } from "@/types/business.types";

// Query hook for fetching a business page by slug
export const useBusinessPageQuery = (slug?: string) => {
  return useQuery({
    queryKey: ['businessPage', slug],
    queryFn: async () => {
      if (!slug) return null;
      
      const { data, error } = await supabase
        .from('business_pages')
        .select('*')
        .eq('page_slug', slug)
        .single();
        
      if (error) {
        console.error("Error fetching business page:", error);
        return null;
      }
      
      return data as BusinessPage;
    },
    enabled: !!slug,
  });
};

// Query hook for fetching the owner's business page
export const useOwnerBusinessPageQuery = () => {
  return useQuery({
    queryKey: ['ownerBusinessPage'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        return null;
      }
      
      const { data, error } = await supabase
        .from('business_pages')
        .select('*')
        .eq('business_id', session.user.id)
        .maybeSingle();
        
      if (error) {
        console.error("Error fetching owner's business page:", error);
        return null;
      }
      
      return data as BusinessPage | null;
    },
  });
};

// Query hook for fetching page sections
export const usePageSectionsQuery = (pageId?: string) => {
  return useQuery({
    queryKey: ['businessPageSections', pageId],
    queryFn: async () => {
      if (!pageId) return [];
      
      const { data, error } = await supabase
        .from('business_page_sections')
        .select('*')
        .eq('page_id', pageId)
        .order('section_order', { ascending: true });
        
      if (error) {
        console.error("Error fetching page sections:", error);
        return [];
      }
      
      // Ensure section_type is of type SectionType
      return data.map(section => ({
        ...section,
        section_type: section.section_type as any
      })) as BusinessPageSection[];
    },
    enabled: !!pageId,
  });
};

// Query hook for fetching social links
export const useSocialLinksQuery = (businessId?: string) => {
  return useQuery({
    queryKey: ['businessSocialLinks', businessId],
    queryFn: async () => {
      if (!businessId) return [];
      
      const { data, error } = await supabase
        .from('business_social_links')
        .select('*')
        .eq('business_id', businessId);
        
      if (error) {
        console.error("Error fetching social links:", error);
        return [];
      }
      
      return data as BusinessSocialLink[];
    },
    enabled: !!businessId,
  });
};
