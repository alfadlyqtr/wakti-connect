
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

// Helper function to check browser language preference
const detectPreferredLanguage = (): string => {
  const browserLang = navigator.language;
  const savedLang = localStorage.getItem('wakti-language');
  
  if (savedLang) {
    logLanguageInfo(`Found saved language: ${savedLang}`);
    return savedLang;
  }
  
  if (browserLang && browserLang.toLowerCase().startsWith('ar')) {
    logLanguageInfo(`Browser language is Arabic: ${browserLang}`);
    return 'ar';
  }
  
  logLanguageInfo(`Using default language: en`);
  return 'en';
};

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
    }
  });

// Set the HTML dir attribute based on the current language
const setDocumentDirection = (language: string) => {
  logLanguageInfo(`Setting document direction for language: ${language}`);
  
  // Set direction attributes
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = language; 
  
  // Add/remove CSS classes for styling
  if (language === 'ar') {
    document.body.classList.add('rtl');
    document.body.classList.add('font-arabic');
  } else {
    document.body.classList.remove('rtl');
    document.body.classList.remove('font-arabic');
  }
  
  // Force a layout recalculation to ensure RTL is properly applied
  document.body.style.display = 'none';
  setTimeout(() => {
    document.body.style.display = '';
  }, 10);
};

// Initialize language from storage or preferences
const initialLanguage = detectPreferredLanguage();
logLanguageInfo(`Setting initial language to: ${initialLanguage}`);
i18n.changeLanguage(initialLanguage);
setDocumentDirection(initialLanguage);

// Make sure language preference is saved
if (!localStorage.getItem('wakti-language')) {
  localStorage.setItem('wakti-language', initialLanguage);
}

// Listen for language changes
i18n.on('languageChanged', (lng) => {
  logLanguageInfo(`Language changed to: ${lng}`);
  setDocumentDirection(lng);
  
  // Ensure consistent storage
  localStorage.setItem('wakti-language', lng);
  
  // Force reload the page to ensure all components get the new language
  // This ensures translations are applied consistently throughout the app
  logLanguageInfo('Reloading page to apply language change');
  window.location.reload();
});

// Add some debug methods to i18n
i18n.debugTranslationMissing = (key: string) => {
  logLanguageInfo(`Missing translation for key: ${key} in ${i18n.language}`);
};

export default i18n;
