
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
