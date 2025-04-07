
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslation from './locales/en/translation.json';
import arTranslation from './locales/ar/translation.json';

// Define the type for our translation files to allow property extension
interface TranslationWithLocation {
  location?: {
    enterLocation: string;
    viewOnMap: string;
    currentLocation: string;
    searchPlaceholder: string;
    manualEntry: string;
    googleMaps: string;
    getLocation: string;
    invalidUrl: string;
    displayName: string;
    enterUrl: string;
    previewMap: string;
    validUrl: string;
  };
  [key: string]: any;
}

// Add location translations from the legacy config
if (!((enTranslation as TranslationWithLocation).location)) {
  (enTranslation as TranslationWithLocation).location = {
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

// Get saved language before initialization to have it ready
const savedLanguage = localStorage.getItem('wakti-language');

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
    lng: savedLanguage || undefined, // Use saved language if available
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'wakti-language',
      caches: ['localStorage'],
    },
    // Add these options to ensure proper fallback
    returnNull: false,
    returnEmptyString: false
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

// Set initial document direction based on detected language
setDocumentDirection(i18n.language);

// Listen for language changes
i18n.on('languageChanged', (lng) => {
  console.log('Language changed to:', lng);
  setDocumentDirection(lng);
  // Ensure the language is saved in localStorage
  localStorage.setItem('wakti-language', lng);
});

export default i18n;
