
import { GOOGLE_MAPS_API_KEY } from "@/config/maps";

/**
 * Generate a map embed URL for use in iframes
 */
export const generateMapEmbedUrl = (location: string): string => {
  if (!location) return '';
  
  // Handle both coordinate strings and addresses
  const encodedLocation = encodeURIComponent(location);
  return `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodedLocation}`;
};

/**
 * Get formatted address from coordinates using Google Maps Geocoding API
 */
export const getFormattedAddress = async (latitude: number, longitude: number): Promise<string> => {  
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      return data.results[0].formatted_address;
    }
    
    return `${latitude}, ${longitude}`;
  } catch (error) {
    console.error('Error getting formatted address:', error);
    return `${latitude}, ${longitude}`;
  }
};

/**
 * Get an address preview for the location
 */
export const getAddressPreview = (location: string): string => {
  if (!location) return '';
  
  // If it's coordinates, try to format them nicely
  const coordsMatch = location.match(/^(-?\d+\.\d+),\s*(-?\d+\.\d+)$/);
  if (coordsMatch) {
    const [_, lat, lng] = coordsMatch;
    return `Location found (${parseFloat(lat).toFixed(4)}, ${parseFloat(lng).toFixed(4)})`;
  }
  
  return location;
};
