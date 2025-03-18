
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to fetch translated content from Supabase based on current language
 * 
 * @param tableName The name of the table containing translations
 * @param contentId The ID of the content to fetch
 * @returns The translated content object, loading state, and error if any
 */
export function useTranslatedContent<T = any>(
  tableName: string, 
  contentId: string | undefined
) {
  const { i18n } = useTranslation();
  const [content, setContent] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!contentId) {
      setIsLoading(false);
      return;
    }

    const fetchTranslatedContent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // First try to get content in current language
        const currentLang = i18n.language;
        let { data, error: langError } = await supabase
          .from(`${tableName}_translations`)
          .select('*')
          .eq('content_id', contentId)
          .eq('language', currentLang)
          .single();
        
        // If no translation in current language, fall back to English
        if (langError || !data) {
          const { data: fallbackData, error: fallbackError } = await supabase
            .from(`${tableName}_translations`)
            .select('*')
            .eq('content_id', contentId)
            .eq('language', 'en')
            .single();
            
          if (fallbackError) {
            // If no English translation, get the base content
            const { data: baseData, error: baseError } = await supabase
              .from(tableName)
              .select('*')
              .eq('id', contentId)
              .single();
              
            if (baseError) {
              throw new Error(`Content not found in any language: ${baseError.message}`);
            }
            
            setContent(baseData as T);
          } else {
            setContent(fallbackData as T);
          }
        } else {
          setContent(data as T);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch translated content'));
        console.error('Error fetching translated content:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranslatedContent();
  }, [tableName, contentId, i18n.language]);

  return { content, isLoading, error };
}
