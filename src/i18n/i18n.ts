
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
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    }
  });

// Set initial direction based on the current language
const setInitialDirection = () => {
  const currentLang = i18n.language || window.localStorage.i18nextLng || 'en';
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  if (currentLang === 'ar') {
    document.body.classList.add('rtl');
  } else {
    document.body.classList.remove('rtl');
  }
};

// Set initial direction
setInitialDirection();

// Listen for language changes
i18n.on('languageChanged', (lng) => {
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  
  if (lng === 'ar') {
    document.body.classList.add('rtl');
  } else {
    document.body.classList.remove('rtl');
  }
});

export default i18n;
