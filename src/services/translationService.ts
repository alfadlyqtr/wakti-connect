
import i18n from '@/i18n/i18n';
import { useTranslation } from 'react-i18next';

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
      // Implementation for API translation would go here
      // For now return the key or default value
      const apiTranslation = await callTranslationAPI(key, options.defaultValue || key);
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
 * Helper function to call DeepSeek API for translation
 * This would be implemented to call the Supabase Edge Function
 */
async function callTranslationAPI(text: string, defaultText: string): Promise<string> {
  // In a real implementation, this would call the DeepSeek API via a Supabase Edge Function
  // For now, we'll just return the default text
  console.log(`Would call API to translate: "${text}" from ${i18n.language === 'ar' ? 'English to Arabic' : 'Arabic to English'}`);
  return defaultText;
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
