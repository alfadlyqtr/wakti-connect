
import React, { createContext, useContext } from 'react';

// Create a context for the translation function
const TranslationContext = createContext<{
  t: (key: string, options?: any) => string | React.ReactNode;
  i18n: {
    language: string;
    changeLanguage: (lng: string) => void;
  };
}>({
  t: (key) => key,
  i18n: {
    language: 'en',
    changeLanguage: () => {},
  }
});

// Create a provider component
export const TranslationProvider: React.FC<{
  children: React.ReactNode;
  translations?: Record<string, string | any[]>;
  language?: string;
}> = ({ children, translations = {}, language = 'en' }) => {
  const [currentLanguage, setCurrentLanguage] = React.useState(language);
  
  const t = (key: string, options?: any) => {
    if (options?.returnObjects && typeof translations[key] === 'object') {
      return translations[key];
    }
    return translations[key] || key;
  };
  
  const changeLanguage = (lng: string) => {
    setCurrentLanguage(lng);
  };

  return (
    <TranslationContext.Provider value={{ 
      t, 
      i18n: {
        language: currentLanguage,
        changeLanguage
      }
    }}>
      {children}
    </TranslationContext.Provider>
  );
};

// Export the hook
export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
