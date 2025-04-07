
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslation from './locales/en/translation.json';
import arTranslation from './locales/ar/translation.json';

// Debug flag for extensive logging
const DEBUG_I18N = process.env.NODE_ENV === 'development';

// Function to log language changes and debug info
const logLanguageInfo = (message: string, data?: any) => {
  if (DEBUG_I18N) {
    console.log(`[i18n] ${message}`, data || '');
  }
};

logLanguageInfo('Initializing i18n');

// Check if we have a stored language preference
const persistedLanguage = localStorage.getItem('wakti-language');
if (persistedLanguage) {
  logLanguageInfo(`Found persisted language: ${persistedLanguage}`);
}

// Initialize i18next
i18n
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next
  .use(initReactI18next)
  // init i18next
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      ar: {
        translation: arTranslation
      }
    },
    fallbackLng: 'en',
    debug: DEBUG_I18N,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'wakti-language',
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false, // Avoid suspense issues with translations
    }
  }, (err) => {
    if (err) {
      logLanguageInfo('Error initializing i18n:', err);
    } else {
      logLanguageInfo('i18n initialized successfully');
      // Apply language direction right away
      const currentLang = i18n.language;
      document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = currentLang;
      
      if (currentLang === 'ar') {
        document.body.classList.add('rtl');
        document.body.classList.add('font-arabic');
      }
      
      logLanguageInfo(`Initial language set to: ${currentLang}`);
    }
  });

// Add debug function to the i18n instance (properly typed)
declare module 'i18next' {
  interface i18n {
    debugTranslationMissing: (key: string) => void;
  }
}

// Now add the custom function
i18n.debugTranslationMissing = (key: string) => {
  logLanguageInfo(`Missing translation for key: ${key} in ${i18n.language}`);
};

export default i18n;
