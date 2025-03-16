
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BusinessPage, BusinessPageSection, BusinessSocialLink } from "@/types/business.types";
import { toast } from "@/components/ui/use-toast";
import { fromTable } from "@/integrations/supabase/helper";
import { useCallback } from "react";

export const useBusinessPage = (pageSlug?: string) => {
  const queryClient = useQueryClient();

  // Fetch business page by slug (for public viewing)
  const { data: businessPage, isLoading: pageLoading } = useQuery({
    queryKey: ['businessPage', pageSlug],
    queryFn: async () => {
      if (!pageSlug) return null;
      
      const { data, error } = await fromTable('business_pages')
        .select()
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

  //  Fetch business page by business ID (for owners)
  const { data: ownerBusinessPage, isLoading: ownerPageLoading } = useQuery({
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

  // Fetch page sections with optimized query
  const { data: pageSections, isLoading: sectionsLoading } = useQuery({
    queryKey: ['businessPageSections', businessPage?.id || ownerBusinessPage?.id],
    queryFn: async () => {
      const pageId = businessPage?.id || ownerBusinessPage?.id;
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
    enabled: !!(businessPage?.id || ownerBusinessPage?.id)
  });

  // Fetch social links
  const { data: socialLinks, isLoading: linksLoading } = useQuery({
    queryKey: ['businessSocialLinks', businessPage?.business_id || ownerBusinessPage?.business_id],
    queryFn: async () => {
      const businessId = businessPage?.business_id || ownerBusinessPage?.business_id;
      if (!businessId) return [];
      
      const { data, error } = await fromTable('business_social_links')
        .select()
        .eq('business_id', businessId);
      
      if (error) {
        console.error("Error fetching social links:", error);
        throw error;
      }
      
      return data as BusinessSocialLink[] || [];
    },
    enabled: !!(businessPage?.business_id || ownerBusinessPage?.business_id)
  });

  // Create business page
  const createPage = useMutation({
    mutationFn: async (pageData: Partial<BusinessPage>) => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("No active session");
      }
      
      const { data, error } = await fromTable('business_pages')
        .insert({
          ...pageData,
          business_id: session.user.id
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error creating business page:", error);
        throw error;
      }
      
      return data as BusinessPage;
    },
    onSuccess: () => {
      toast({
        title: "Page created",
        description: "Your business page has been created successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['ownerBusinessPage'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to create page",
        description: error.message
      });
    }
  });

  // Update business page with debounce for auto-save
  const updatePage = useMutation({
    mutationFn: async (updates: Partial<BusinessPage>) => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("No active session");
      }
      
      if (!ownerBusinessPage?.id) {
        throw new Error("No business page found");
      }
      
      const { data, error } = await fromTable('business_pages')
        .update(updates)
        .eq('id', ownerBusinessPage.id)
        .eq('business_id', session.user.id) // Ensure owner
        .select()
        .single();
      
      if (error) {
        console.error("Error updating business page:", error);
        throw error;
      }
      
      return data as BusinessPage;
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

  // New method for updating a section with optimistic updates
  const updateSection = useMutation({
    mutationFn: async ({ sectionId, content }: { sectionId: string, content: any }) => {
      const { data, error } = await fromTable('business_page_sections')
        .update({ section_content: content })
        .eq('id', sectionId)
        .select()
        .single();
      
      if (error) {
        console.error("Error updating section:", error);
        throw error;
      }
      
      return data as BusinessPageSection;
    },
    onMutate: async ({ sectionId, content }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['businessPageSections'] });
      
      // Save the previous value
      const previousSections = queryClient.getQueryData<BusinessPageSection[]>(
        ['businessPageSections', businessPage?.id || ownerBusinessPage?.id]
      );
      
      // Optimistically update the UI
      if (previousSections) {
        queryClient.setQueryData<BusinessPageSection[]>(
          ['businessPageSections', businessPage?.id || ownerBusinessPage?.id],
          previousSections.map(section => 
            section.id === sectionId 
              ? { ...section, section_content: content } 
              : section
          )
        );
      }
      
      return { previousSections };
    },
    onError: (err, variables, context) => {
      // If there was an error, roll back
      if (context?.previousSections) {
        queryClient.setQueryData(
          ['businessPageSections', businessPage?.id || ownerBusinessPage?.id], 
          context.previousSections
        );
      }
      toast({
        variant: "destructive",
        title: "Failed to update section",
        description: "Your changes could not be saved. Please try again."
      });
    },
    onSuccess: () => {
      toast({
        title: "Section updated",
        description: "Your section has been updated."
      });
      queryClient.invalidateQueries({ 
        queryKey: ['businessPageSections', businessPage?.id || ownerBusinessPage?.id] 
      });
    }
  });

  // Auto-save helper function
  const autoSavePageSettings = useCallback((pageData: Partial<BusinessPage>) => {
    if (ownerBusinessPage?.id) {
      updatePage.mutate(pageData);
    }
  }, [ownerBusinessPage?.id, updatePage]);

  // Get public URL function
  const getPublicPageUrl = useCallback(() => {
    if (!ownerBusinessPage?.page_slug && !businessPage?.page_slug) return '';
    const slug = ownerBusinessPage?.page_slug || businessPage?.page_slug;
    return `${window.location.origin}/business/${slug}`;
  }, [ownerBusinessPage?.page_slug, businessPage?.page_slug]);

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
    createPage,
    updatePage,
    updateSection,
    autoSavePageSettings,
    
    // Helper functions
    getPublicPageUrl,
    
    // Loading state
    isLoading: pageLoading || ownerPageLoading || sectionsLoading || linksLoading
  };
};
