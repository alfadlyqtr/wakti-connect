
/**
 * Checks if a URL is a valid Google Maps URL
 */
export const isValidGoogleMapsUrl = (url: string): boolean => {
  // Basic validation for Google Maps URLs
  if (!url) return false;
  
  // Check if it's a URL
  try {
    const parsedUrl = new URL(url);
    
    // Check if it's a Google Maps URL
    return (
      parsedUrl.hostname.includes('google.com') && 
      (parsedUrl.pathname.includes('/maps') || 
       parsedUrl.hostname.includes('maps.google'))
    );
  } catch (error) {
    // Not a valid URL
    return false;
  }
};

/**
 * Formats a Google Maps URL for consistent display and storage
 */
export const formatMapsUrl = (url: string): string => {
  if (!url) return '';
  
  // Basic formatting for consistency
  try {
    const parsedUrl = new URL(url);
    
    // Return the URL with protocol and hostname
    return parsedUrl.toString();
  } catch (error) {
    // If it's not a valid URL, return as is
    return url;
  }
};

/**
 * Google Maps API key
 */
export const GOOGLE_MAPS_API_KEY = 'AIzaSyD5QBJ4O3ovpZ9UI6ZekiZ7H4h9gN_lDg0';

/**
 * Generate a Google Maps URL from a location string
 */
export const generateGoogleMapsUrl = (location: string): string => {
  if (!location) return '';
  
  const encodedLocation = encodeURIComponent(location);
  return `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
};
