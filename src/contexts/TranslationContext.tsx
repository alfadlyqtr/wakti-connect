
import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from '@/i18n/i18n';
import { useTranslation } from 'react-i18next';
import { translateWithFallback } from '@/services/translationService';
import { useToast } from '@/components/ui/use-toast';

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

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t, i18n: i18nInstance } = useTranslation();
  const [loadingTranslation, setLoadingTranslation] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Current language state
  const currentLanguage = i18nInstance.language || 'en';
  const isRTL = currentLanguage === 'ar';
  
  // Effect to set document direction and language attributes
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;
    
    if (isRTL) {
      document.body.classList.add('rtl');
      document.body.classList.add('font-arabic');
    } else {
      document.body.classList.remove('rtl');
      document.body.classList.remove('font-arabic');
    }
    
    console.log(`[TranslationContext] Language set to ${currentLanguage} (RTL: ${isRTL})`);
  }, [currentLanguage, isRTL]);
  
  // Method to change language without full page reload
  const changeLanguage = (lang: string) => {
    try {
      console.log(`[TranslationContext] Changing language to: ${lang}`);
      setLoadingTranslation(true);
      
      // Save to localStorage
      localStorage.setItem('wakti-language', lang);
      
      // Change i18n language
      i18nInstance.changeLanguage(lang).then(() => {
        setLoadingTranslation(false);
        
        // Show success toast
        toast({
          title: lang === 'ar' ? 'تم تغيير اللغة' : 'Language changed',
          description: lang === 'ar' ? 'تم تغيير اللغة إلى العربية' : 'Language changed to English',
          variant: "default",
        });
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
