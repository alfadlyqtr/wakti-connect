
/**
 * Utility functions for generating map URLs
 */

// Google Maps API key
export const GOOGLE_MAPS_API_KEY = "AIzaSyDynN3EzG_5oH-ZgGYCAww3IRNCg2unJBw";

// Function to generate a Google Maps embed URL for a location
export const generateMapEmbedUrl = (location: string): string => {
  // Sanitize the location for URL use
  const encodedLocation = encodeURIComponent(location);
  
  // Use the API key for the embed URL
  return `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodedLocation}`;
};

// Function to generate a Google Maps URL for opening in a new tab
export const generateGoogleMapsUrl = (location: string): string => {
  const encodedLocation = encodeURIComponent(location);
  return `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
};
