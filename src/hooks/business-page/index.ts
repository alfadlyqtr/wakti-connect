
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { useBusinessPageUtils } from "./useBusinessPageUtils";
import { useBusinessPageQueries } from "./useBusinessPageQueries";
import { useBusinessPageMutations } from "./useBusinessPageMutations";
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
  } = useQuery({
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
      
      return data;
    },
    enabled: !!slug,
  });
  
  const {
    data: pageSections,
    isLoading: isSectionsLoading,
  } = useQuery({
    queryKey: ['businessPageSections', businessPage?.id],
    queryFn: async () => {
      if (!businessPage?.id) return [];
      
      const { data, error } = await supabase
        .from('business_page_sections')
        .select('*')
        .eq('page_id', businessPage.id)
        .order('section_order', { ascending: true });
        
      if (error) {
        console.error("Error fetching page sections:", error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!businessPage?.id,
  });
  
  // Fetch owner's business page (for dashboard)
  const {
    data: ownerBusinessPage,
    isLoading: isOwnerLoading,
  } = useQuery({
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
      
      return data;
    },
  });
  
  // Mutations
  const {
    createPage,
    updatePage,
    createSection,
    updateSection,
    deleteSection,
    reorderSection,
  } = useBusinessPageMutations(queryClient);
  
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
