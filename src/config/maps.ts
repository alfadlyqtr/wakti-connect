
/**
 * Maps configuration module
 * Provides Google Maps API key and utility functions
 */

// Google Maps API key for map embeds and location services
export const GOOGLE_MAPS_API_KEY = 'AIzaSyBIwzALxUPNbatRBj3X1HyELQG7xToQ3vA';

/**
 * Generates a Google Maps embed URL for a location query
 * @param location - The location to search for
 * @returns A URL string for the Google Maps embed
 */
export const generateMapEmbedUrl = (location: string): string => {
  if (!location) return '';
  const encodedLocation = encodeURIComponent(location);
  return `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodedLocation}`;
};

/**
 * Generates a link to open a location in Google Maps
 * @param location - The location to search for
 * @returns A URL string for Google Maps
 */
export const generateGoogleMapsUrl = (location: string): string => {
  if (!location) return '';
  const encodedLocation = encodeURIComponent(location);
  return `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
};

// Export API key as default for convenient imports
export default GOOGLE_MAPS_API_KEY;
