
/**
 * Utility functions for Google Maps integration
 */

// Google Maps API key (use environment variable in production)
export const GOOGLE_MAPS_API_KEY = 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY';

// Generate embed URL for Google Maps
export const generateMapEmbedUrl = (address: string): string => {
  // Encode the address for use in a URL
  const encodedAddress = encodeURIComponent(address);
  
  // Return a Google Maps embed URL with the encoded address
  return `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodedAddress}`;
};

// Generate a Google Maps URL for navigation
export const generateGoogleMapsUrl = (address: string): string => {
  const encodedAddress = encodeURIComponent(address);
  return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
};
