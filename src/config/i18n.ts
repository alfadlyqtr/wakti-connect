
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Define English translations
const resources = {
  en: {
    translation: {
      'location.enterLocation': 'Enter event location',
      'location.viewOnMap': 'View on map',
      'location.currentLocation': 'Use my current location',
      'location.searchPlaceholder': 'Search for a location...',
      'location.manualEntry': 'Enter manually',
      'location.googleMaps': 'Use Google Maps',
      'location.getLocation': 'Get my current location',
      'location.invalidUrl': 'Invalid Google Maps URL',
      'location.displayName': 'Location display name',
      'location.enterUrl': 'Enter a Google Maps URL',
      'location.previewMap': 'Preview on map',
      'location.validUrl': 'Enter a valid Google Maps URL'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
