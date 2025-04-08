
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English translations object for essential booking and common terms
// Also adding AI assistant related translations
const enTranslations = {
  common: {
    copy: "Copy",
    copyToClipboard: "Copied to Clipboard",
    clipboardCopyMessage: "has been copied to clipboard"
  },
  booking: {
    reference: "Booking Reference",
    saveReference: "Please save this reference number for your records",
    staffLabel: "Staff:",
    bookedFor: "Booked For:",
    phoneLabel: "Phone:"
  },
  ai: {
    documentAnalysis: "Document Analysis",
    suggestionTitle: "Try asking about:",
    sampleHistory: {
      efficiency: "How to improve team efficiency",
      marketing: "Marketing strategy ideas",
      studyPlan: "Create a study plan for exams"
    },
    timeAgo: {
      days: "{{count}} days ago",
      week: "{{count}} week ago",
      weeks: "{{count}} weeks ago"
    }
  }
};

// Initialize i18next with English-only configuration
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations
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
