
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslation from './locales/en/translation.json';
import arTranslation from './locales/ar/translation.json';

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
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'wakti-language',
      caches: ['localStorage'],
    }
  });

// Set the HTML dir attribute based on the current language
const setDocumentDirection = (language: string) => {
  console.log('Setting document direction for language:', language);
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = language; // Set the language attribute
  if (language === 'ar') {
    document.body.classList.add('rtl');
    document.body.classList.add('font-arabic');
  } else {
    document.body.classList.remove('rtl');
    document.body.classList.remove('font-arabic');
  }
};

// Check for saved language preference and apply it immediately on load
const savedLanguage = localStorage.getItem('wakti-language');
if (savedLanguage) {
  console.log('Found saved language in i18n initialization:', savedLanguage);
  i18n.changeLanguage(savedLanguage);
  setDocumentDirection(savedLanguage);
} else {
  // If no saved language, check if browser language is Arabic
  const browserLang = navigator.language;
  if (browserLang && browserLang.toLowerCase().startsWith('ar')) {
    console.log('Browser language is Arabic, setting language to ar');
    i18n.changeLanguage('ar');
    localStorage.setItem('wakti-language', 'ar');
    setDocumentDirection('ar');
  } else {
    // Default to English if no Arabic detected
    setDocumentDirection(i18n.language);
  }
}

// Listen for language changes
i18n.on('languageChanged', (lng) => {
  console.log('Language changed to:', lng);
  setDocumentDirection(lng);
  // Ensure the language is saved in localStorage
  localStorage.setItem('wakti-language', lng);
  
  // Force reload the page to ensure all components get the new language
  // This ensures translations are applied consistently throughout the app
  window.location.reload();
});

export default i18n;
