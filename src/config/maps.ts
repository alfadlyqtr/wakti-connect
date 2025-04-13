
// Create the missing maps config file that exports the GOOGLE_MAPS_API_KEY
// and generateGoogleMapsUrl function

/**
 * Google Maps API Key for map embeds and geocoding
 */
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

/**
 * Generate a Google Maps URL for linking to a specific location
 * @param location The location string to generate a map URL for
 * @returns Google Maps URL for the specified location
 */
export const generateGoogleMapsUrl = (location: string): string => {
  if (!location) return '';
  
  const encodedLocation = encodeURIComponent(location);
  return `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
};

/**
 * Check if a URL is a valid Google Maps URL
 * @param url URL to check
 * @returns boolean indicating if the URL is a valid Google Maps URL
 */
export const isValidGoogleMapsUrl = (url: string): boolean => {
  if (!url) return false;
  
  // Simple check if it's a Google Maps URL
  return url.includes('google.com/maps') || url.includes('goo.gl/maps');
};

/**
 * Format a Google Maps URL for display
 * @param url URL to format
 * @returns Formatted URL for display
 */
export const formatMapsUrl = (url: string): string => {
  if (!url) return '';
  
  // Remove protocol and trailing slashes for display
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
};
