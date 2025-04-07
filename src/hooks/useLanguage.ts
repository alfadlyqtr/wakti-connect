
import { useEffect, useState } from 'react';
import { useTranslationContext } from '@/contexts/TranslationContext';

/**
 * Hook for managing language setting throughout the application
 * Works with the TranslationContext to provide a consistent language experience
 */
export function useLanguage() {
  const { currentLanguage, changeLanguage, isRTL, loadingTranslation } = useTranslationContext();
  
  // Methods to switch language
  const switchToArabic = () => {
    if (currentLanguage !== 'ar') {
      console.log('[useLanguage] Switching to Arabic');
      changeLanguage('ar');
    }
  };
  
  const switchToEnglish = () => {
    if (currentLanguage !== 'en') {
      console.log('[useLanguage] Switching to English');
      changeLanguage('en');
    }
  };
  
  // Toggle between languages
  const toggleLanguage = () => {
    console.log('[useLanguage] Toggling language from', currentLanguage);
    if (currentLanguage === 'ar') {
      switchToEnglish();
    } else {
      switchToArabic();
    }
  };
  
  // Debug information 
  useEffect(() => {
    console.log(`[useLanguage] Current language: ${currentLanguage}, RTL: ${isRTL}`);
  }, [currentLanguage, isRTL]);
  
  return {
    currentLanguage,
    isRTL,
    isLoading: loadingTranslation,
    changeLanguage,
    switchToArabic,
    switchToEnglish,
    toggleLanguage
  };
}

export default useLanguage;
