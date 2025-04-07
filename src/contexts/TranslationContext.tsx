
import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from '@/i18n/i18n';
import { useTranslation } from 'react-i18next';
import { translateWithFallback, registerTranslation } from '@/services/translationService';

interface TranslationContextType {
  isRTL: boolean;
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  translateWithFallback: (key: string, options?: any) => Promise<string>;
  registerTranslation: (key: string, translation: string, language?: string) => void;
  translationCache: Map<string, string>;
  clearCache: () => void;
  debugMode: boolean;
  toggleDebugMode: () => void;
}

// Create context with default values
const TranslationContext = createContext<TranslationContextType>({
  isRTL: false,
  currentLanguage: 'en',
  setLanguage: () => {},
  translateWithFallback: async () => '',
  registerTranslation: () => {},
  translationCache: new Map(),
  clearCache: () => {},
  debugMode: false,
  toggleDebugMode: () => {},
});

// Translation cache to avoid duplicate API calls
const translationCache = new Map<string, string>();

// Provider component
export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [debugMode, setDebugMode] = useState(false);
  
  const isRTL = i18n.language === 'ar';

  // Set language function
  const setLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  // Clear cache
  const clearCache = () => {
    translationCache.clear();
  };

  // Toggle debug mode
  const toggleDebugMode = () => {
    setDebugMode(prev => !prev);
  };
  
  // Effect to add debug overlay when debug mode is on
  useEffect(() => {
    if (debugMode) {
      const debugOverlay = document.createElement('div');
      debugOverlay.id = 'i18n-debug-overlay';
      debugOverlay.style.position = 'fixed';
      debugOverlay.style.bottom = '10px';
      debugOverlay.style.right = '10px';
      debugOverlay.style.backgroundColor = 'rgba(0,0,0,0.7)';
      debugOverlay.style.color = 'white';
      debugOverlay.style.padding = '5px 10px';
      debugOverlay.style.borderRadius = '4px';
      debugOverlay.style.fontSize = '12px';
      debugOverlay.style.zIndex = '9999';
      debugOverlay.innerText = `Lang: ${i18n.language} | RTL: ${isRTL}`;
      
      document.body.appendChild(debugOverlay);
      
      return () => {
        document.body.removeChild(debugOverlay);
      };
    }
  }, [debugMode, i18n.language, isRTL]);
  
  // Create context value object
  const contextValue: TranslationContextType = {
    isRTL,
    currentLanguage: i18n.language,
    setLanguage,
    translateWithFallback,
    registerTranslation,
    translationCache,
    clearCache,
    debugMode,
    toggleDebugMode
  };
  
  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
};

// Custom hook for using the translation context
export const useTranslationContext = () => useContext(TranslationContext);

export default TranslationContext;
