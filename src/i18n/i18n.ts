
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslation from './locales/en/translation.json';
import arTranslation from './locales/ar/translation.json';

// Add location translations from the legacy config
if (!enTranslation.location) {
  enTranslation.location = {
    enterLocation: 'Enter event location',
    viewOnMap: 'View on map',
    currentLocation: 'Use my current location',
    searchPlaceholder: 'Search for a location...',
    manualEntry: 'Enter manually',
    googleMaps: 'Use Google Maps',
    getLocation: 'Get my current location',
    invalidUrl: 'Invalid Google Maps URL',
    displayName: 'Location display name',
    enterUrl: 'Enter a Google Maps URL',
    previewMap: 'Preview on map',
    validUrl: 'Enter a valid Google Maps URL'
  };
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

// Check for saved language preference
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
  }
  setDocumentDirection(i18n.language);
}

// Listen for language changes
i18n.on('languageChanged', (lng) => {
  console.log('Language changed to:', lng);
  setDocumentDirection(lng);
  // Ensure the language is saved in localStorage
  localStorage.setItem('wakti-language', lng);
});

export default i18n;
