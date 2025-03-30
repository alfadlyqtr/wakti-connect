
import { useBusinessPageQuery, useOwnerBusinessPageQuery, usePageSectionsQuery, useSocialLinksQuery } from "./useBusinessPageQueries";
import { useCreatePageMutation, useUpdatePageMutation, useUpdateSectionMutation, useSubmitContactFormMutation } from "./useBusinessPageMutations";
import { useAutoSavePageSettings, usePublicPageUrl } from "./useBusinessPageUtils";
import { useContactSubmissionsQuery, useMarkSubmissionAsReadMutation } from "./useContactSubmissionsQuery";
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
  
  // Contact submissions 
  const {
    data: contactSubmissions,
    isLoading: submissionsLoading,
    refetch: refetchSubmissions
  } = useContactSubmissionsQuery(businessPage?.business_id || ownerBusinessPage?.business_id);
  
  const markSubmissionAsRead = useMarkSubmissionAsReadMutation();
  
  // Mutations
  const createPage = useCreatePageMutation();
  const updatePage = useUpdatePageMutation();
  const updateSection = useUpdateSectionMutation();
  const submitContactForm = useSubmitContactFormMutation();
  
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
    
    // Contact submissions
    contactSubmissions,
    submissionsLoading,
    refetchSubmissions,
    markSubmissionAsRead,
    
    // Mutations
    createPage,
    updatePage,
    updateSection,
    submitContactForm,
    
    // Helper functions
    autoSavePage,
    autoSaveField,
    getPublicPageUrl,
    
    // Loading state
    isLoading: pageLoading || ownerPageLoading || sectionsLoading || linksLoading || submissionsLoading
  };
};
