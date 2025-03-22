
import React, { ReactNode, createContext, useContext } from 'react';

interface TranslationContextType {
  t: (key: string, options?: any) => ReactNode;
  i18n: {
    language: string;
    changeLanguage: (lng: string) => void;
  };
}

const TranslationContext = createContext<TranslationContextType>({
  t: (key: string) => key,
  i18n: {
    language: 'en',
    changeLanguage: () => {}
  }
});

export const TranslationProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const translations: Record<string, Record<string, string>> = {
    en: {
      'common.search': 'Search',
      'common.account': 'Account',
      'common.logOut': 'Log Out',
      'common.logIn': 'Log In',
      'common.signUp': 'Sign Up',
      'dashboard.settings': 'Settings',
    },
    ar: {
      'common.search': 'بحث',
      'common.account': 'حساب',
      'common.logOut': 'تسجيل خروج',
      'common.logIn': 'تسجيل دخول',
      'common.signUp': 'إنشاء حساب',
      'dashboard.settings': 'الإعدادات',
    }
  };

  const t = (key: string, options?: any): string => {
    const language = localStorage.getItem('i18nextLng') || 'en';
    return translations[language]?.[key] || key;
  };

  const i18n = {
    language: localStorage.getItem('i18nextLng') || 'en',
    changeLanguage: (lng: string) => {
      localStorage.setItem('i18nextLng', lng);
      // Force rerender in a real implementation
    }
  };

  return (
    <TranslationContext.Provider value={{ t, i18n }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => useContext(TranslationContext);
