
/**
 * Generates a Google Maps URL from a location string
 * @param location String in format "latitude,longitude"
 */
export const generateGoogleMapsUrl = (location: string): string => {
  return `https://www.google.com/maps?q=${location}`;
};
