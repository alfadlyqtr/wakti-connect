
import { useState, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";

// This hook provides automatic saving functionality for page settings
export const useAutoSavePageSettings = (updatePageMutation: any, pageId?: string) => {
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [pendingChanges, setPendingChanges] = useState<Record<string, any>>({});
  
  // Debounced auto-save function
  const autoSavePage = useCallback((data: Record<string, any>) => {
    if (!pageId) {
      console.warn("Cannot auto-save: No page ID");
      return;
    }
    
    console.log("Auto-saving page settings:", data);
    updatePageMutation.mutate(
      { pageId, data },
      {
        onSuccess: () => {
          console.log("Auto-save successful");
        },
        onError: (error: any) => {
          console.error("Auto-save failed:", error);
          toast({
            variant: "destructive",
            title: "Auto-save failed",
            description: "Your changes could not be saved. Please try again."
          });
        }
      }
    );
  }, [pageId, updatePageMutation]);
  
  // Auto-save a single field with debouncing
  const autoSaveField = useCallback((field: string, value: any) => {
    if (!pageId) {
      console.warn("Cannot auto-save field: No page ID");
      return;
    }
    
    // Add this change to pending changes
    setPendingChanges(prev => ({ ...prev, [field]: value }));
    
    // Clear existing timeout
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }
    
    // Set new timeout
    const timeoutId = setTimeout(() => {
      console.log(`Auto-saving field ${field}:`, value);
      const updatedPendingChanges = { ...pendingChanges, [field]: value };
      
      updatePageMutation.mutate(
        { pageId, data: updatedPendingChanges },
        {
          onSuccess: () => {
            console.log("Field auto-save successful");
            // Clear the pending changes that were saved
            setPendingChanges({});
            toast({
              title: "Changes saved",
              description: "Your page settings have been updated."
            });
          },
          onError: (error: any) => {
            console.error("Field auto-save failed:", error);
            toast({
              variant: "destructive",
              title: "Save failed",
              description: "Your changes could not be saved. Please try again."
            });
          }
        }
      );
    }, 1000); // 1 second delay
    
    setAutoSaveTimeout(timeoutId);
  }, [pageId, updatePageMutation, autoSaveTimeout, pendingChanges]);
  
  return { autoSavePage, autoSaveField };
};

// This hook provides a function to get the public URL for a business page
export const usePublicPageUrl = (pageSlug?: string) => {
  const getPublicPageUrl = useCallback(() => {
    if (!pageSlug) {
      return '#';
    }
    
    // Check the environment and construct appropriate URL
    const isLocalhost = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';
    
    // Get the origin (protocol + hostname + port)
    const baseUrl = window.location.origin;
    
    // Construct the full URL to the business page with proper path
    return `${baseUrl}/business/${pageSlug}`;
  }, [pageSlug]);
  
  return getPublicPageUrl;
};
