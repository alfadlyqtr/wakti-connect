
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BusinessPage, BusinessPageSection, BusinessSocialLink } from "@/types/business.types";
import { toast } from "@/components/ui/use-toast";

export const useBusinessPage = (pageSlug?: string) => {
  const queryClient = useQueryClient();

  // Fetch business page by slug (for public viewing)
  const { data: businessPage, isLoading: pageLoading } = useQuery({
    queryKey: ['businessPage', pageSlug],
    queryFn: async () => {
      if (!pageSlug) return null;
      
      const { data, error } = await supabase
        .from('business_pages')
        .select('*')
        .eq('page_slug', pageSlug)
        .eq('is_published', true)
        .single();
      
      if (error) {
        console.error("Error fetching business page:", error);
        throw error;
      }
      
      return data as BusinessPage;
    },
    enabled: !!pageSlug
  });

  // Fetch business page by business ID (for owners)
  const { data: ownerBusinessPage, isLoading: ownerPageLoading } = useQuery({
    queryKey: ['ownerBusinessPage'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("No active session");
      }
      
      const { data, error } = await supabase
        .from('business_pages')
        .select('*')
        .eq('business_id', session.user.id)
        .single();
      
      if (error) {
        console.error("Error fetching owner's business page:", error);
        throw error;
      }
      
      return data as BusinessPage;
    },
    enabled: !pageSlug // Only fetch when not viewing a specific page by slug
  });

  // Fetch page sections
  const { data: pageSections, isLoading: sectionsLoading } = useQuery({
    queryKey: ['businessPageSections', businessPage?.id || ownerBusinessPage?.id],
    queryFn: async () => {
      const pageId = businessPage?.id || ownerBusinessPage?.id;
      if (!pageId) return [];
      
      const { data, error } = await supabase
        .from('business_page_sections')
        .select('*')
        .eq('page_id', pageId)
        .order('section_order', { ascending: true });
      
      if (error) {
        console.error("Error fetching page sections:", error);
        throw error;
      }
      
      return data as BusinessPageSection[];
    },
    enabled: !!(businessPage?.id || ownerBusinessPage?.id)
  });

  // Fetch social links
  const { data: socialLinks, isLoading: linksLoading } = useQuery({
    queryKey: ['businessSocialLinks', businessPage?.business_id || ownerBusinessPage?.business_id],
    queryFn: async () => {
      const businessId = businessPage?.business_id || ownerBusinessPage?.business_id;
      if (!businessId) return [];
      
      const { data, error } = await supabase
        .from('business_social_links')
        .select('*')
        .eq('business_id', businessId);
      
      if (error) {
        console.error("Error fetching social links:", error);
        throw error;
      }
      
      return data as BusinessSocialLink[];
    },
    enabled: !!(businessPage?.business_id || ownerBusinessPage?.business_id)
  });

  // Update business page
  const updatePage = useMutation({
    mutationFn: async (updates: Partial<BusinessPage>) => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("No active session");
      }
      
      const pageId = ownerBusinessPage?.id;
      if (!pageId) {
        throw new Error("No business page found");
      }
      
      const { data, error } = await supabase
        .from('business_pages')
        .update(updates)
        .eq('id', pageId)
        .eq('business_id', session.user.id) // Ensure owner
        .select()
        .single();
      
      if (error) {
        console.error("Error updating business page:", error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Page updated",
        description: "Your business page has been updated successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['ownerBusinessPage'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to update page",
        description: error.message
      });
    }
  });

  return {
    // Public view data
    businessPage,
    pageLoading,
    
    // Owner data
    ownerBusinessPage,
    ownerPageLoading,
    
    // Shared data
    pageSections,
    sectionsLoading,
    socialLinks,
    linksLoading,
    
    // Mutations
    updatePage,
    
    // Loading state
    isLoading: pageLoading || ownerPageLoading || sectionsLoading || linksLoading
  };
};
