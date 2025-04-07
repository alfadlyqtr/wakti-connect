
import i18n from '@/i18n/i18n';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';

// Interface for translation options
interface TranslateOptions {
  defaultValue?: string;
  context?: Record<string, any>;
  fallbackToApi?: boolean;
}

// Cache for API translations to reduce API calls
const translationCache = new Map<string, string>();

/**
 * Enhanced translate function that falls back to DeepSeek API if needed
 * 
 * @param key The translation key
 * @param options Translation options including fallback behavior
 * @returns Translated text or fallback
 */
export async function translateWithFallback(
  key: string,
  options: TranslateOptions = {}
): Promise<string> {
  // First try the regular i18next translation
  const regularTranslation = i18n.t(key, {
    defaultValue: options.defaultValue || key,
    ...options.context
  });
  
  // If we got a valid translation or API fallback is disabled, return it
  if (regularTranslation !== key || options.fallbackToApi === false) {
    return regularTranslation;
  }
  
  // Check our cache first
  const cacheKey = `${i18n.language}:${key}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey) as string;
  }
  
  // If we're in development mode, log the missing translation
  if (process.env.NODE_ENV === 'development') {
    console.warn(`Missing translation for key: "${key}" in language: ${i18n.language}`);
  }
  
  try {
    // Only call API if fallback is explicitly enabled
    if (options.fallbackToApi) {
      console.log(`Calling DeepSeek API for translation of: ${key}`);
      const apiTranslation = await callDeepSeekAPI(key, options.defaultValue || key);
      translationCache.set(cacheKey, apiTranslation);
      return apiTranslation;
    }
  } catch (error) {
    console.error('Translation API error:', error);
  }
  
  // Default fallback
  return options.defaultValue || key;
}

/**
 * Helper function to call DeepSeek API for translation via Supabase Edge Function
 */
async function callDeepSeekAPI(text: string, defaultText: string): Promise<string> {
  try {
    const sourceLang = i18n.language === 'ar' ? 'Arabic' : 'English';
    const targetLang = i18n.language === 'ar' ? 'English' : 'Arabic';
    
    const { data, error } = await supabase.functions.invoke('translate', {
      body: { text, sourceLang, targetLang }
    });
    
    if (error) {
      console.error('Supabase function error:', error);
      return defaultText;
    }
    
    return data?.translation || defaultText;
  } catch (error) {
    console.error('Error calling translate function:', error);
    return defaultText;
  }
}

/**
 * Hook for using the enhanced translation service
 */
export function useEnhancedTranslation() {
  const { t, i18n: i18nInstance } = useTranslation();
  
  // Return the enhanced functions along with the standard ones
  return {
    t,
    i18n: i18nInstance,
    translateWithFallback,
    isRTL: i18nInstance.language === 'ar'
  };
}

/**
 * Check for missing translations in the current language
 * @param keys Array of translation keys to check
 * @returns Object with missing keys and their default values
 */
export function checkMissingTranslations(keys: string[]): Record<string, string> {
  const missing: Record<string, string> = {};
  
  keys.forEach(key => {
    const translated = i18n.t(key, { defaultValue: null });
    if (translated === key || translated === null) {
      missing[key] = key;
    }
  });
  
  return missing;
}

/**
 * Register a new translation for a key
 * This would be used to save API translations back to the system
 */
export function registerTranslation(
  key: string, 
  translation: string, 
  language: string = i18n.language
): void {
  // In a real implementation, this might store to localStorage or a database
  // For now, just add to the local cache
  const cacheKey = `${language}:${key}`;
  translationCache.set(cacheKey, translation);
  
  // Log in development mode
  if (process.env.NODE_ENV === 'development') {
    console.log(`Registered translation for "${key}" in ${language}: "${translation}"`);
  }
}

/**
 * Utility to determine if a translation exists for a key
 */
export function hasTranslation(key: string, language: string = i18n.language): boolean {
  if (!key) return false;
  
  const resources = i18n.getResourceBundle(language, 'translation');
  if (!resources) return false;
  
  // Handle nested keys
  const keyParts = key.split('.');
  let current: any = resources;
  
  for (const part of keyParts) {
    if (current[part] === undefined) {
      return false;
    }
    current = current[part];
  }
  
  return typeof current === 'string';
}

/**
 * Debug translator that logs all translation attempts
 */
export function createDebugTranslator() {
  const originalT = i18n.t.bind(i18n);
  
  return (key: string, options?: any) => {
    console.log(`[Translation Debug] Translating key: ${key}`);
    const result = originalT(key, options);
    console.log(`[Translation Debug] Result: "${result}"`);
    return result;
  };
}
