
import { useBusinessPageQuery, useOwnerBusinessPageQuery, usePageSectionsQuery, useSocialLinksQuery } from "./useBusinessPageQueries";
import { useCreatePageMutation, useUpdatePageMutation, useUpdateSectionMutation } from "./useBusinessPageMutations";
import { useAutoSavePageSettings, usePublicPageUrl } from "./useBusinessPageUtils";
import { BusinessPage } from "@/types/business.types";
import { useCallback } from "react";

export const useBusinessPage = (pageSlug?: string) => {
  // Public view queries
  const { 
    data: businessPage, 
    isLoading: pageLoading 
  } = useBusinessPageQuery(pageSlug);
  
  // Owner queries
  const { 
    data: ownerBusinessPage, 
    isLoading: ownerPageLoading 
  } = useOwnerBusinessPageQuery();
  
  // Shared queries
  const { 
    data: pageSections, 
    isLoading: sectionsLoading 
  } = usePageSectionsQuery(businessPage?.id || ownerBusinessPage?.id);
  
  const { 
    data: socialLinks, 
    isLoading: linksLoading 
  } = useSocialLinksQuery(businessPage?.business_id || ownerBusinessPage?.business_id);
  
  // Mutations
  const createPage = useCreatePageMutation();
  const updatePage = useUpdatePageMutation();
  const updateSection = useUpdateSectionMutation();
  
  // Utilities
  const { autoSavePage, autoSaveField } = useAutoSavePageSettings(
    updatePage, 
    ownerBusinessPage?.id
  );
  
  const getPublicPageUrl = usePublicPageUrl(
    ownerBusinessPage?.page_slug || businessPage?.page_slug
  );
  
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
    
    // Helper functions
    autoSavePage,
    autoSaveField,
    getPublicPageUrl,
    
    // Loading state
    isLoading: pageLoading || ownerPageLoading || sectionsLoading || linksLoading
  };
};
