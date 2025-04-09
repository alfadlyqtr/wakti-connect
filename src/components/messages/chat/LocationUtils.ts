
/**
 * Generates a Google Maps URL from a location string
 * @param location String in format "latitude,longitude"
 */
export const generateGoogleMapsUrl = (location: string): string => {
  return `https://www.google.com/maps?q=${location}`;
};

/**
 * Creates a formatted message with location information
 * @param location Raw location string
 * @param mapsUrl Google Maps URL
 */
export const generateLocationMessage = (location: string, mapsUrl: string): string => {
  return `📍 Shared Location: ${mapsUrl}`;
};
