
/**
 * Maps configuration and utilities
 */

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Validate that we have a valid API key
if (!MAPS_API_KEY) {
  console.warn('Warning: No Google Maps API key found. Map functionality will be limited.');
}

export const GOOGLE_MAPS_API_KEY = MAPS_API_KEY;

/**
 * Generate a Google Maps URL for linking to a specific location
 */
export const generateGoogleMapsUrl = (location: string): string => {
  if (!location) return '';
  
  try {
    const encodedLocation = encodeURIComponent(location);
    return `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
  } catch (error) {
    console.error('Error generating Google Maps URL:', error);
    return '';
  }
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

/**
 * Handle common Google Maps API errors
 */
export const handleGoogleMapsError = (error: any): string => {
  if (error.status === "REQUEST_DENIED") {
    return "API key restrictions are preventing this request. Please check your Google Cloud Console settings.";
  } else if (error.status === "ZERO_RESULTS") {
    return "No results found for this location.";
  } else {
    return "An error occurred while accessing Google Maps services.";
  }
};
