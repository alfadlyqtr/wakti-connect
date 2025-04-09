
// Google Maps API functions and utilities

// API Key constant
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

/**
 * Generates a Google Maps URL for the given location
 * @param location - The location to search for
 * @returns URL to Google Maps for the location
 */
export const generateGoogleMapsUrl = (location: string): string => {
  // Remove any existing URLs from the location string
  const cleanLocation = location.replace(/https?:\/\/[^\s]+/g, '').trim();
  
  // Create the Google Maps URL
  const encodedLocation = encodeURIComponent(cleanLocation);
  return `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
};

/**
 * Generates an embed URL for Google Maps
 * @param location - The location to embed
 * @returns URL for embedding Google Maps
 */
export const generateMapEmbedUrl = (location: string): string => {
  const encodedLocation = encodeURIComponent(location);
  return `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodedLocation}`;
};

/**
 * Validates if a URL is a valid Google Maps URL
 * @param url - The URL to validate
 * @returns Whether the URL is a valid Google Maps URL
 */
export const isValidGoogleMapsUrl = (url: string): boolean => {
  if (!url) return false;
  return url.includes('google.com/maps') || url.includes('goo.gl/maps');
};

/**
 * Formats a Google Maps URL for display
 * @param url - The URL to format
 * @returns Formatted URL
 */
export const formatMapsUrl = (url: string): string => {
  if (!url) return '';
  return url.replace(/^https?:\/\/(www\.)?/i, '').substring(0, 30) + '...';
};

/**
 * Gets the Google Maps API key from environment variables
 * @returns The Google Maps API key
 */
export const getGoogleMapsApiKey = (): string => {
  return GOOGLE_MAPS_API_KEY;
};

/**
 * Creates a script element to load the Google Maps API
 * @returns Promise that resolves when the API is loaded
 */
export const loadGoogleMapsApi = (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const apiKey = getGoogleMapsApiKey();
    
    if (!apiKey) {
      console.warn('No Google Maps API key provided');
    }
    
    // Check if API is already loaded
    if (window.google && window.google.maps) {
      resolve();
      return;
    }
    
    // Create script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps API'));
    
    document.head.appendChild(script);
  });
};
