
import { useMutation } from "@tanstack/react-query";
import { BusinessPage } from "@/types/business.types";
import { useCallback } from "react";

export const useAutoSavePageSettings = (
  updatePageMutation: ReturnType<typeof useMutation<BusinessPage, Error, any>>,
  businessPageId?: string
) => {
  const autoSave = useCallback((data: Partial<BusinessPage>) => {
    if (!businessPageId) return;
    
    updatePageMutation.mutate(data, {
      // Quiet mode - no toast notifications
      onError: (error) => {
        console.error("Error auto-saving page settings:", error);
      }
    });
  }, [updatePageMutation, businessPageId]);
  
  return autoSave;
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
