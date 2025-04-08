
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

// Get saved language before initialization to have it ready
const savedLanguage = localStorage.getItem('wakti-language') || 'en';

// Make sure all keys from English exist in Arabic
const ensureKeysExist = (enObj: any, arObj: any, path = '') => {
  for (const key in enObj) {
    const currentPath = path ? `${path}.${key}` : key;
    if (typeof enObj[key] === 'object' && enObj[key] !== null && !Array.isArray(enObj[key])) {
      if (!arObj[key] || typeof arObj[key] !== 'object') {
        arObj[key] = {};
      }
      ensureKeysExist(enObj[key], arObj[key], currentPath);
    } else if (arObj[key] === undefined) {
      // If key doesn't exist in Arabic, add it with the same value as English
      console.log(`Adding missing translation key: ${currentPath}`);
      arObj[key] = enObj[key];
    }
  }
  
  // Also check for any keys in arObj that aren't in enObj and log them
  for (const key in arObj) {
    const currentPath = path ? `${path}.${key}` : key;
    if (enObj[key] === undefined) {
      console.log(`Found extra key in Arabic translations: ${currentPath}`);
    } else if (typeof arObj[key] === 'object' && arObj[key] !== null && !Array.isArray(arObj[key]) && 
               typeof enObj[key] === 'object' && enObj[key] !== null && !Array.isArray(enObj[key])) {
      ensureKeysExist(enObj[key], arObj[key], currentPath);
    }
  }
};

// Synchronize translation keys
ensureKeysExist(enTranslation, arTranslation);

// Debug: Log the synchronized Arabic translation for priority.normal
// Type-safe check to access the nested property
const taskPriority = arTranslation?.task?.priority;
console.log('Arabic translation for task.priority.normal:', 
  taskPriority && typeof taskPriority === 'object' && taskPriority.normal ? 
  taskPriority.normal : 'Missing translation');

// Initialize i18next with enhanced configuration
i18n
  // Use language detector
  .use(LanguageDetector)
  // Connect with React
  .use(initReactI18next)
  // Initialize
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      ar: {
        translation: arTranslation
      }
    },
    lng: savedLanguage, // Use saved language if available
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
    returnEmptyString: false,
    // Ensure initialization completes properly
    initImmediate: false,
    // Add missing keys to prevent showing raw keys
    saveMissing: false,
    missingKeyHandler: (lngs, ns, key) => {
      console.warn(`Missing translation key: ${key} in namespace: ${ns} for languages: ${lngs.join(', ')}`);
    },
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
