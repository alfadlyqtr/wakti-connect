
import { useEffect, useState } from 'react';
import { useTranslationContext } from '@/contexts/TranslationContext';

/**
 * Hook for managing language setting throughout the application
 * Works with the TranslationContext to provide a consistent language experience
 */
export function useLanguage() {
  const { currentLanguage, changeLanguage, isRTL } = useTranslationContext();
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize language from localStorage 
  useEffect(() => {
    const savedLanguage = localStorage.getItem('wakti-language');
    
    // If there's a saved language that's different from current, change to it
    if (savedLanguage && savedLanguage !== currentLanguage) {
      setIsLoading(true);
      changeLanguage(savedLanguage);
    }
  }, []);
  
  // Methods to switch language
  const switchToArabic = () => changeLanguage('ar');
  const switchToEnglish = () => changeLanguage('en');
  
  // Toggle between languages
  const toggleLanguage = () => {
    if (currentLanguage === 'ar') {
      switchToEnglish();
    } else {
      switchToArabic();
    }
  };
  
  return {
    currentLanguage,
    isRTL,
    isLoading,
    changeLanguage,
    switchToArabic,
    switchToEnglish,
    toggleLanguage
  };
}

export default useLanguage;
