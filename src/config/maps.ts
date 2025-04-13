
// For demo purposes, using a placeholder key
export const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; 

/**
 * Generate a Google Maps URL from a location string
 */
export const generateGoogleMapsUrl = (location: string): string => {
  const encodedLocation = encodeURIComponent(location);
  return `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
};

/**
 * Check if a URL is a valid Google Maps URL
 */
export const isValidGoogleMapsUrl = (url: string): boolean => {
  // Basic validation to check if it's a Google Maps URL
  return url.includes('google.com/maps') || url.includes('maps.google.com');
};

/**
 * Format a maps URL to ensure it's valid
 */
export const formatMapsUrl = (url: string): string => {
  if (!url) return '';
  
  // If it's just a location name, convert to a maps URL
  if (!url.startsWith('http')) {
    return generateGoogleMapsUrl(url);
  }
  
  // If it's already a URL, return as is
  return url;
};
