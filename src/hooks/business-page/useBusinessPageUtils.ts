
import { useCallback } from "react";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { BusinessPage } from "@/types/business.types";

// Auto-save utilities
export const useAutoSavePageSettings = (
  updatePage: any,
  pageId?: string
) => {
  // Debounced auto-save function
  const debouncedSave = useDebouncedCallback((data: Partial<BusinessPage>) => {
    if (pageId) {
      updatePage.mutate({ id: pageId, ...data });
    }
  }, 1000);
  
  // Function to auto-save a specific field
  const autoSaveField = useCallback((fieldName: string, value: any) => {
    if (pageId) {
      debouncedSave({ [fieldName]: value });
    }
  }, [pageId, debouncedSave]);
  
  // Function to auto-save the entire page data
  const autoSavePage = useCallback((pageData: Partial<BusinessPage>) => {
    if (pageId) {
      debouncedSave({ ...pageData });
    }
  }, [pageId, debouncedSave]);
  
  return { autoSavePage, autoSaveField };
};

// Get public page URL
export const usePublicPageUrl = (pageSlug?: string) => {
  return useCallback(() => {
    if (!pageSlug) return '';
    
    // Determine base URL based on environment
    const baseUrl = window.location.origin;
    
    return `${baseUrl}/business/${pageSlug}`;
  }, [pageSlug]);
};
