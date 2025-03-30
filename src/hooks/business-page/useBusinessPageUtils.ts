
import { useState, useEffect, useCallback } from 'react';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';
import { BusinessPage } from '@/types/business.types';

/**
 * Utility hook for auto-saving page settings
 */
export const useAutoSavePageSettings = (
  updatePage: any,
  pageId?: string
) => {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  
  // Debounced auto-save function
  const autoSavePage = useDebouncedCallback((pageData: Partial<BusinessPage>) => {
    if (!pageId) return;
    
    setSaveStatus('saving');
    updatePage.mutate({
      ...pageData,
      id: pageId
    }, {
      onSuccess: () => {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      },
      onError: () => {
        setSaveStatus('error');
      }
    });
  }, 1000);
  
  // Function to handle auto-saving a single field
  const autoSaveField = useCallback((name: string, value: any) => {
    if (!pageId) return;
    
    setSaveStatus('saving');
    autoSavePage({
      id: pageId,
      [name]: value
    });
  }, [pageId, autoSavePage]);
  
  // Reset save status when page ID changes
  useEffect(() => {
    setSaveStatus('idle');
  }, [pageId]);
  
  return {
    saveStatus,
    autoSavePage,
    autoSaveField
  };
};

/**
 * Utility hook to get the public URL for a business page
 */
export const usePublicPageUrl = (pageSlug?: string) => {
  const getPublicPageUrl = useCallback(() => {
    if (!pageSlug) return '#';
    
    // Return URL to the public business page
    return `/business/${pageSlug}`;
  }, [pageSlug]);
  
  return getPublicPageUrl;
};
