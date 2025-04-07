
import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from '@/i18n/i18n';
import { useTranslation } from 'react-i18next';
import { translateWithFallback } from '@/services/translationService';
import { useToast } from '@/components/ui/use-toast';
import Cookies from 'js-cookie';

// Interface for the context
interface TranslationContextType {
  currentLanguage: string;
  isRTL: boolean;
  changeLanguage: (lang: string) => void;
  t: (key: string, options?: any) => string;
  translateAsync: (key: string, options?: any) => Promise<string>;
  loadingTranslation: boolean;
}

const TranslationContext = createContext<TranslationContextType>({
  currentLanguage: 'en',
  isRTL: false,
  changeLanguage: () => {},
  t: (key: string) => key,
  translateAsync: async (key: string) => key,
  loadingTranslation: false,
});

// Cookie name for language preference
const LANGUAGE_COOKIE_NAME = 'wakti-language';
const COOKIE_EXPIRY_DAYS = 365;

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t, i18n: i18nInstance } = useTranslation();
  const [loadingTranslation, setLoadingTranslation] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Current language state
  const currentLanguage = i18nInstance.language || 'en';
  const isRTL = currentLanguage === 'ar';
  
  // Function to set document direction and language attributes
  const applyLanguageToDOM = (language: string) => {
    const isRightToLeft = language === 'ar';
    document.documentElement.dir = isRightToLeft ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    if (isRightToLeft) {
      document.body.classList.add('rtl');
      document.body.classList.add('font-arabic');
    } else {
      document.body.classList.remove('rtl');
      document.body.classList.remove('font-arabic');
    }
    
    console.log(`[TranslationContext] Applied ${language} layout, RTL: ${isRightToLeft}`);
  };
  
  // Effect to set document direction and language attributes
  useEffect(() => {
    applyLanguageToDOM(currentLanguage);
  }, [currentLanguage]);
  
  // Initialize on first render
  useEffect(() => {
    try {
      // Get language from cookie instead of localStorage
      const savedLanguage = Cookies.get(LANGUAGE_COOKIE_NAME);
      
      if (savedLanguage && savedLanguage !== i18nInstance.language) {
        console.log(`[TranslationContext] Found saved language in cookie: ${savedLanguage}, current is: ${i18nInstance.language}`);
        
        // Wait a moment to allow i18n to initialize before changing
        setTimeout(() => {
          i18nInstance.changeLanguage(savedLanguage)
            .then(() => {
              console.log(`[TranslationContext] Applied saved language: ${savedLanguage}`);
              applyLanguageToDOM(savedLanguage);
            })
            .catch(err => {
              console.error('[TranslationContext] Error loading saved language:', err);
            });
        }, 100);
      } else {
        // Make sure DOM is correctly set even for default language
        applyLanguageToDOM(i18nInstance.language);
      }
    } catch (error) {
      console.error('[TranslationContext] Error initializing language:', error);
    }
  }, []);
  
  // Method to change language with full page reload to ensure consistent state
  const changeLanguage = (lang: string) => {
    try {
      console.log(`[TranslationContext] Changing language to: ${lang}`);
      setLoadingTranslation(true);
      
      // Save to cookie with 1-year expiration instead of localStorage
      Cookies.set(LANGUAGE_COOKIE_NAME, lang, { expires: COOKIE_EXPIRY_DAYS });
      
      // Show loading toast first
      toast({
        title: lang === 'ar' ? 'جاري تغيير اللغة...' : 'Changing language...',
        description: lang === 'ar' ? 'يرجى الانتظار' : 'Please wait',
        variant: "default",
      });
      
      // Change i18n language
      i18nInstance.changeLanguage(lang).then(() => {
        // Apply language changes to DOM immediately
        applyLanguageToDOM(lang);
        setLoadingTranslation(false);
        
        // Force reload the page to ensure all components update properly
        window.location.reload();
      }).catch(error => {
        console.error('[TranslationContext] Error changing language:', error);
        setLoadingTranslation(false);
        
        toast({
          title: "Error changing language",
          description: "There was a problem changing the language. Please try again.",
          variant: "destructive",
        });
      });
    } catch (error) {
      console.error('[TranslationContext] Error in changeLanguage:', error);
      setLoadingTranslation(false);
    }
  };
  
  // Async translation with fallback
  const translateAsync = async (key: string, options?: any) => {
    try {
      const result = await translateWithFallback(key, {
        defaultValue: options?.defaultValue || key,
        context: options?.context || {},
        fallbackToApi: options?.fallbackToApi || false
      });
      return result;
    } catch (error) {
      console.error(`[TranslationContext] Error translating "${key}":`, error);
      return options?.defaultValue || key;
    }
  };
  
  // Create value object
  const contextValue = {
    currentLanguage,
    isRTL,
    changeLanguage,
    t,
    translateAsync,
    loadingTranslation
  };
  
  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslationContext = () => useContext(TranslationContext);

export default TranslationContext;
