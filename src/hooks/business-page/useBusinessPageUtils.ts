
import { useMutation } from "@tanstack/react-query";
import { BusinessPage } from "@/types/business.types";
import { useCallback } from "react";

export const useAutoSavePageSettings = (
  updatePageMutation: ReturnType<typeof useMutation<BusinessPage, Error, any>>,
  businessPageId?: string
) => {
  // Method 1: Accept a partial BusinessPage object (for bulk updates)
  const autoSavePage = useCallback((data: Partial<BusinessPage>) => {
    if (!businessPageId) return;
    
    updatePageMutation.mutate(data, {
      // Quiet mode - no toast notifications
      onError: (error) => {
        console.error("Error auto-saving page settings:", error);
      }
    });
  }, [updatePageMutation, businessPageId]);
  
  // Method 2: Accept a name and value (for individual field updates)
  const autoSaveField = useCallback((name: string, value: any) => {
    if (!businessPageId) return;
    
    updatePageMutation.mutate({ [name]: value }, {
      // Quiet mode - no toast notifications
      onError: (error) => {
        console.error("Error auto-saving page settings:", error);
      }
    });
  }, [updatePageMutation, businessPageId]);
  
  return { autoSavePage, autoSaveField };
};

export const usePublicPageUrl = (pageSlug?: string) => {
  const getPublicPageUrl = useCallback(() => {
    if (!pageSlug) return "#";
    
    // Get the base URL of the application
    const baseUrl = window.location.origin;
    return `${baseUrl}/business/${pageSlug}`;
  }, [pageSlug]);
  
  return getPublicPageUrl;
};
