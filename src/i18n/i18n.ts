
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Cookies from 'js-cookie';

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

// Check if we have a stored language preference (from cookie)
const persistedLanguage = Cookies.get('wakti-language');
if (persistedLanguage) {
  logLanguageInfo(`Found persisted language in cookie: ${persistedLanguage}`);
}

// Fix for language detection resources
const resources = {
  en: {
    translation: enTranslation
  },
  ar: {
    translation: arTranslation
  }
};

// Initialize i18next with prioritized detection order
i18n
  // Add language detector with custom cookie configuration
  .use(new LanguageDetector({
    order: ['cookie', 'navigator', 'htmlTag'],
    lookupCookie: 'wakti-language',
    caches: ['cookie'],
    cookieOptions: { expires: 365 }
  }))
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Init i18next
  .init({
    resources,
    fallbackLng: 'en',
    debug: DEBUG_I18N,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    react: {
      useSuspense: false, // Avoid suspense issues with translations
    },
    // Make sure the language is applied immediately
    initImmediate: false
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

// Add the custom function
i18n.debugTranslationMissing = (key: string) => {
  logLanguageInfo(`Missing translation for key: ${key} in ${i18n.language}`);
};

export default i18n;
