
/**
 * Generates a Google Maps URL from a location string
 * @param location String in format "latitude,longitude"
 */
export const generateGoogleMapsUrl = (location: string): string => {
  return `https://www.google.com/maps?q=${location}`;
};

/**
 * Generates a Google Maps embed URL
 * @param location String in format "latitude,longitude" or address
 */
export const generateMapEmbedUrl = (location: string): string => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(location)}`;
};

/**
 * Google Maps API key for embedding maps
 * This is a public key and can be exposed on the client
 */
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

/**
 * Checks if a string is a valid Google Maps URL
 * @param url URL to check
 */
export const isValidGoogleMapsUrl = (url: string): boolean => {
  return url.startsWith('https://www.google.com/maps') || 
         url.startsWith('https://goo.gl/maps') || 
         url.startsWith('https://maps.google.com');
};

/**
 * Format a URL to ensure it's a valid maps URL
 * @param url URL to format
 */
export const formatMapsUrl = (url: string): string => {
  if (!url) return '';
  
  if (!url.startsWith('http')) {
    return `https://${url}`;
  }
  
  return url;
};
