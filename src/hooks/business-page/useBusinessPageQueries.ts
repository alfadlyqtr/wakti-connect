
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BusinessPage, BusinessPageSection, BusinessSocialLink } from "@/types/business.types";
import { fromTable } from "@/integrations/supabase/helper";

// Fetch business page by slug (for public viewing)
export const useBusinessPageQuery = (pageSlug?: string, isPreviewMode?: boolean) => {
  return useQuery({
    queryKey: ['businessPage', pageSlug, isPreviewMode],
    queryFn: async () => {
      if (!pageSlug) return null;
      
      let query = fromTable('business_pages')
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
      
      return data as BusinessPage;
    },
    enabled: !!pageSlug
  });
};

// Fetch business page by business ID (for owners)
export const useOwnerBusinessPageQuery = () => {
  return useQuery({
    queryKey: ['ownerBusinessPage'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("No active session");
      }
      
      const { data, error } = await fromTable('business_pages')
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
export const usePageSectionsQuery = (pageId?: string) => {
  return useQuery({
    queryKey: ['businessPageSections', pageId],
    queryFn: async () => {
      if (!pageId) return [];
      
      const { data, error } = await fromTable('business_page_sections')
        .select()
        .eq('page_id', pageId)
        .order('section_order', { ascending: true });
      
      if (error) {
        console.error("Error fetching page sections:", error);
        throw error;
      }
      
      return data as BusinessPageSection[] || [];
    },
    enabled: !!pageId
  });
};

// Fetch social links
export const useSocialLinksQuery = (businessId?: string) => {
  return useQuery({
    queryKey: ['businessSocialLinks', businessId],
    queryFn: async () => {
      if (!businessId) {
        console.log("No business ID for social links query");
        return [];
      }
      
      console.log("Fetching social links for business:", businessId);
      
      const { data, error } = await fromTable('business_social_links')
        .select()
        .eq('business_id', businessId);
      
      if (error) {
        console.error("Error fetching social links:", error);
        throw error;
      }
      
      console.log("Retrieved social links:", data);
      return data as BusinessSocialLink[] || [];
    },
    enabled: !!businessId
  });
};

// Fetch contact submissions
export const useContactSubmissionsQuery = (businessId?: string) => {
  return useQuery({
    queryKey: ['contactSubmissions', businessId],
    queryFn: async () => {
      if (!businessId) return [];
      
      const { data, error } = await fromTable('business_contact_submissions')
        .select()
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching contact submissions:", error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!businessId
  });
};

// Mark submission as read
export const useMarkSubmissionAsReadMutation = () => {
  return useMutation({
    mutationFn: async (submissionId: string) => {
      const { data, error } = await fromTable('business_contact_submissions')
        .update({ is_read: true })
        .eq('id', submissionId)
        .select()
        .single();
      
      if (error) {
        console.error("Error marking submission as read:", error);
        throw error;
      }
      
      return data;
    }
  });
};
