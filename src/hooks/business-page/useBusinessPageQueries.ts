
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BusinessPage, BusinessPageSection, BusinessSocialLink } from "@/types/business.types";

export const useBusinessPageQueries = () => {
  // Fetch business page by slug (for public viewing)
  const useBusinessPageQuery = (pageSlug?: string, isPreviewMode?: boolean) => {
    return useQuery({
      queryKey: ['businessPage', pageSlug, isPreviewMode],
      queryFn: async () => {
        if (!pageSlug) return null;
        
        console.log("Fetching business page with slug:", pageSlug, "Preview mode:", isPreviewMode);
        
        let query = supabase
          .from('business_pages')
          .select()
          .eq('page_slug', pageSlug);
        
        // Only check for published pages when not in preview mode
        if (!isPreviewMode) {
          query = query.eq('is_published', true);
        }
        
        const { data, error } = await query.single();
        
        if (error) {
          console.error("Error fetching business page:", error);
          throw error;
        }
        
        console.log("Business page data retrieved:", data);
        return data as BusinessPage;
      },
      enabled: !!pageSlug
    });
  };

  // Fetch business page by business ID (for owners)
  const useOwnerBusinessPageQuery = () => {
    return useQuery({
      queryKey: ['ownerBusinessPage'],
      queryFn: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          throw new Error("No active session");
        }
        
        const { data, error } = await supabase
          .from('business_pages')
          .select()
          .eq('business_id', session.user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') { // Not found is okay
          console.error("Error fetching owner's business page:", error);
          throw error;
        }
        
        return data as BusinessPage || null;
      }
    });
  };

  // Fetch page sections
  const usePageSectionsQuery = (pageId?: string) => {
    return useQuery({
      queryKey: ['businessPageSections', pageId],
      queryFn: async () => {
        if (!pageId) return [];
        
        console.log("Fetching page sections for pageId:", pageId);
        
        const { data, error } = await supabase
          .from('business_page_sections')
          .select('*')
          .eq('page_id', pageId)
          .order('section_order', { ascending: true });
        
        if (error) {
          console.error("Error fetching page sections:", error);
          throw error;
        }
        
        console.log(`Retrieved ${data?.length || 0} page sections:`, data);
        return data as BusinessPageSection[] || [];
      },
      enabled: !!pageId
    });
  };
  
  // Fetch business social links
  const useBusinessSocialLinksQuery = (businessId?: string) => {
    return useQuery({
      queryKey: ['businessSocialLinks', businessId],
      queryFn: async () => {
        if (!businessId) return [];
        
        const { data, error } = await supabase
          .from('business_social_links')
          .select('*')
          .eq('business_id', businessId);
        
        if (error) {
          console.error("Error fetching business social links:", error);
          throw error;
        }
        
        return data as BusinessSocialLink[] || [];
      },
      enabled: !!businessId
    });
  };

  // Return all queries
  return {
    useBusinessPageQuery,
    useOwnerBusinessPageQuery,
    usePageSectionsQuery,
    useBusinessSocialLinksQuery
  };
};

export default useBusinessPageQueries;
