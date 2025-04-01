
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { useBusinessPageUtils } from "./useBusinessPageUtils";
import { 
  useBusinessPageQuery, 
  useOwnerBusinessPageQuery, 
  usePageSectionsQuery,
  useSocialLinksQuery 
} from "./useBusinessPageQueries";
import { 
  useCreatePageMutation, 
  useUpdatePageMutation, 
  useUpdateSectionMutation,
  useSubmitContactFormMutation 
} from "./useBusinessPageMutations";
import { BusinessPage, BusinessPageSection } from "@/types/business.types";

export const useBusinessPage = (slug?: string) => {
  const [socialLinks, setSocialLinks] = useState([]);
  const queryClient = useQueryClient();
  const { getPublicPageUrl } = useBusinessPageUtils();
  
  // Queries
  const {
    data: businessPage,
    isLoading: isBusinessPageLoading,
    error: businessPageError,
  } = useBusinessPageQuery(slug);
  
  const {
    data: pageSections,
    isLoading: isSectionsLoading,
  } = usePageSectionsQuery(businessPage?.id);
  
  // Fetch owner's business page (for dashboard)
  const {
    data: ownerBusinessPage,
    isLoading: isOwnerLoading,
  } = useOwnerBusinessPageQuery();
  
  // Mutations
  const createPageMutation = useCreatePageMutation();
  const updatePageMutation = useUpdatePageMutation();
  
  // Fetch social links
  useEffect(() => {
    const fetchSocialLinks = async (businessId: string) => {
      try {
        const { data, error } = await supabase
          .from('business_social_links')
          .select('*')
          .eq('business_id', businessId);
          
        if (error) {
          console.error("Error fetching social links:", error);
          return;
        }
        
        console.log("Fetched social links:", data);
        setSocialLinks(data || []);
      } catch (error) {
        console.error("Error in fetchSocialLinks:", error);
      }
    };
    
    if (businessPage?.business_id) {
      fetchSocialLinks(businessPage.business_id);
    }
  }, [businessPage?.business_id]);
  
  // Handle mutations
  const createPage = (data: Partial<BusinessPage>) => {
    return createPageMutation.mutateAsync(data);
  };
  
  const updatePage = (pageId: string, data: Partial<BusinessPage>) => {
    return updatePageMutation.mutateAsync({ pageId, data });
  };
  
  const createSection = async (sectionType: string, pageId: string) => {
    if (!pageId) {
      throw new Error("No business page found");
    }
    
    // Calculate highest order + 1
    const highestOrder = pageSections && pageSections.length > 0
      ? Math.max(...pageSections.map(s => s.section_order))
      : -1;
    
    const nextOrder = highestOrder + 1;
    
    const { data, error } = await supabase
      .from('business_page_sections')
      .insert({
        page_id: pageId,
        section_type: sectionType,
        section_order: nextOrder,
        section_title: `New ${sectionType} section`,
        section_content: {},
        is_visible: true
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating section:", error);
      throw error;
    }
    
    queryClient.invalidateQueries({ queryKey: ['businessPageSections'] });
    return data;
  };
  
  const updateSection = (sectionId: string, data: any) => {
    return useUpdateSectionMutation().mutateAsync({ sectionId, data });
  };
  
  const deleteSection = async (sectionId: string) => {
    const { error } = await supabase
      .from('business_page_sections')
      .delete()
      .eq('id', sectionId);
    
    if (error) {
      console.error("Error deleting section:", error);
      throw error;
    }
    
    queryClient.invalidateQueries({ queryKey: ['businessPageSections'] });
    return { success: true };
  };
  
  const reorderSection = async (sectionId: string, newOrder: number) => {
    const { error } = await supabase
      .from('business_page_sections')
      .update({ section_order: newOrder })
      .eq('id', sectionId);
    
    if (error) {
      console.error("Error reordering section:", error);
      throw error;
    }
    
    queryClient.invalidateQueries({ queryKey: ['businessPageSections'] });
    return { success: true };
  };
  
  // Auto-save function for updating a single field
  const autoSaveField = async (name: string, value: any) => {
    if (!ownerBusinessPage?.id) {
      console.error("Cannot auto-save: No business page found");
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('business_pages')
        .update({ [name]: value })
        .eq('id', ownerBusinessPage.id);
        
      if (error) {
        console.error(`Error auto-saving field ${name}:`, error);
        return;
      }
      
      // Invalidate cached page data
      queryClient.invalidateQueries({ queryKey: ['ownerBusinessPage'] });
      
      // Only show toast for certain fields
      const importantFields = ['page_title', 'page_slug', 'description', 'is_published'];
      if (importantFields.includes(name)) {
        toast({
          title: "Saved",
          description: `${name.replace('_', ' ')} has been updated.`,
        });
      }
    } catch (error) {
      console.error(`Error in autoSaveField for ${name}:`, error);
    }
  };
  
  // Auto-save function for updating multiple fields
  const autoSavePage = async (data: Partial<BusinessPage>) => {
    if (!ownerBusinessPage?.id) {
      console.error("Cannot auto-save page: No business page found");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('business_pages')
        .update(data)
        .eq('id', ownerBusinessPage.id);
        
      if (error) {
        console.error("Error auto-saving page:", error);
        toast({
          variant: "destructive",
          title: "Save failed",
          description: "Failed to save changes. Please try again.",
        });
        return;
      }
      
      // Invalidate cached page data
      queryClient.invalidateQueries({ queryKey: ['ownerBusinessPage'] });
      
      toast({
        title: "Changes saved",
        description: "Your page has been updated.",
      });
    } catch (error) {
      console.error("Error in autoSavePage:", error);
    }
  };
  
  return {
    businessPage,
    ownerBusinessPage,
    pageSections,
    socialLinks,
    isLoading: isBusinessPageLoading || isSectionsLoading,
    isOwnerLoading,
    createPage,
    updatePage,
    createSection,
    updateSection,
    deleteSection,
    reorderSection,
    getPublicPageUrl,
    autoSaveField,
    autoSavePage,
  };
};

// Export the individual hooks for direct usage
export { 
  useBusinessPageQuery, 
  useOwnerBusinessPageQuery, 
  usePageSectionsQuery,
  useSocialLinksQuery 
} from './useBusinessPageQueries';

export { 
  useCreatePageMutation, 
  useUpdatePageMutation, 
  useUpdateSectionMutation,
  useSubmitContactFormMutation 
} from './useBusinessPageMutations';
