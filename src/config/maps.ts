
/**
 * Utility functions for generating map URLs
 */

// Function to generate a Google Maps embed URL for a location
export const generateMapEmbedUrl = (location: string): string => {
  // Sanitize the location for URL use
  const encodedLocation = encodeURIComponent(location);
  
  // The API key would typically be stored in environment variables
  // For now we'll use a URL that doesn't require an API key
  return `https://www.google.com/maps/embed/v1/place?key=AIzaSyDynN3EzG_5oH-ZgGYCAww3IRNCg2unJBw&q=${encodedLocation}`;
};

// Function to generate a Google Maps URL for opening in a new tab
export const generateGoogleMapsUrl = (location: string): string => {
  const encodedLocation = encodeURIComponent(location);
  return `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
};
