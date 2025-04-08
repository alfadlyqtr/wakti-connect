
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import English translations only
import enTranslation from './locales/en/translation.json';

// Initialize i18next with English-only configuration
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation
      }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

// Set document direction to LTR for English
document.documentElement.dir = 'ltr';
document.documentElement.lang = 'en';
document.body.classList.remove('rtl');
document.body.classList.remove('font-arabic');

// Simple export
export default i18n;
