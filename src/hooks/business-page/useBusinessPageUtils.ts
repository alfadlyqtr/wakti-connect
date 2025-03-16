
import { useCallback } from "react";
import { BusinessPage } from "@/types/business.types";

// Auto-save helper function
export const useAutoSavePageSettings = (updatePage: any, ownerBusinessPageId?: string) => {
  return useCallback((pageData: Partial<BusinessPage>) => {
    if (ownerBusinessPageId) {
      updatePage.mutate(pageData);
    }
  }, [ownerBusinessPageId, updatePage]);
};

// Get public URL function
export const usePublicPageUrl = (pageSlug?: string) => {
  return useCallback(() => {
    if (!pageSlug) return '';
    return `${window.location.origin}/business/${pageSlug}`;
  }, [pageSlug]);
};
