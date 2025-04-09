
// Google Maps API functions and utilities

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
 * Gets the Google Maps API key from environment variables
 * @returns The Google Maps API key
 */
export const getGoogleMapsApiKey = (): string => {
  return import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
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
