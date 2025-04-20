
/**
 * Maps configuration and utilities
 */

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Validate that we have a valid API key
if (!MAPS_API_KEY || MAPS_API_KEY === 'FAKE-123') {
  console.warn('Warning: No valid Google Maps API key found. Map functionality will be limited.');
}

export const GOOGLE_MAPS_API_KEY = MAPS_API_KEY;

/**
 * Generate a Google Maps URL for linking to a specific location
 */
export const generateGoogleMapsUrl = (location: string): string => {
  if (!location) return '';
  
  const encodedLocation = encodeURIComponent(location);
  return `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
};

/**
 * Check if a URL is a valid Google Maps URL
 */
export const isValidGoogleMapsUrl = (url: string): boolean => {
  if (!url) return false;
  return url.includes('google.com/maps') || url.includes('goo.gl/maps');
};

/**
 * Format a Google Maps URL for display
 */
export const formatMapsUrl = (url: string): string => {
  if (!url) return '';
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
};
