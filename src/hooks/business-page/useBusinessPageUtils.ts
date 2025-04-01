
import { useCallback } from "react";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { BusinessPage } from "@/types/business.types";
import { toast } from "@/components/ui/use-toast";

// Auto-save utilities
export const useAutoSavePageSettings = (
  updatePage: any,
  pageId?: string
) => {
  // Debounced auto-save function
  const debouncedSave = useDebouncedCallback((data: Partial<BusinessPage>) => {
    if (!pageId) {
      console.error("Cannot auto-save: No page ID available");
      return;
    }
    
    console.log("Auto-saving page data:", { pageId, ...data });
    
    // Filter out null or undefined values to prevent errors
    const cleanedData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);
    
    // Only save if there's actual data to save
    if (Object.keys(cleanedData).length === 0) {
      console.log("No valid data to save, skipping auto-save");
      return;
    }
    
    updatePage.mutate({ 
      pageId, 
      data: cleanedData 
    }, {
      onSuccess: () => {
        console.log("Auto-save successful");
      },
      onError: (error: any) => {
        console.error("Auto-save failed:", error);
        toast({
          variant: "destructive",
          title: "Auto-save failed",
          description: "Your changes could not be saved automatically. Please try saving manually."
        });
      }
    });
  }, 1000);
  
  // Function to auto-save a specific field
  const autoSaveField = useCallback((fieldName: string, value: any) => {
    if (!pageId) {
      console.error("Cannot auto-save field: No page ID available");
      return;
    }
    
    // Skip saving if value is null or undefined
    if (value === null || value === undefined) {
      console.log(`Skipping auto-save for field "${fieldName}" due to null/undefined value`);
      return;
    }
    
    console.log(`Auto-saving field "${fieldName}":`, value);
    debouncedSave({ [fieldName]: value });
  }, [pageId, debouncedSave]);
  
  // Function to auto-save the entire page data
  const autoSavePage = useCallback((pageData: Partial<BusinessPage>) => {
    if (!pageId) {
      console.error("Cannot auto-save page: No page ID available");
      return;
    }
    
    console.log("Auto-saving entire page:", pageData);
    debouncedSave(pageData);
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
