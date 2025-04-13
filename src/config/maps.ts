
// For demo purposes, using a placeholder key
export const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; 

/**
 * Generate a Google Maps URL from a location string
 */
export const generateGoogleMapsUrl = (location: string): string => {
  const encodedLocation = encodeURIComponent(location);
  return `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
};
