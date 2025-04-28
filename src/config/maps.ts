
/**
 * Maps configuration
 */

export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

if (!GOOGLE_MAPS_API_KEY) {
  console.warn('Warning: No Google Maps API key found. Location features will be limited.');
}

export const generateGoogleMapsUrl = (location: string): string => {
  if (!location) return '';
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
};

export const isValidMapsUrl = (url: string): boolean => {
  if (!url) return false;
  return url.includes('google.com/maps');
};
