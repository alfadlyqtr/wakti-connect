
import React, { createContext, useContext } from 'react';

// Create a context for the translation function
const TranslationContext = createContext<{
  t: (key: string) => string | React.ReactNode;
}>({
  t: (key) => key,
});

// Create a provider component
export const TranslationProvider: React.FC<{
  children: React.ReactNode;
  translations?: Record<string, string>;
}> = ({ children, translations = {} }) => {
  const t = (key: string) => {
    return translations[key] || key;
  };

  return (
    <TranslationContext.Provider value={{ t }}>
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
