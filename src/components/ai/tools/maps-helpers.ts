
// Maps helpers for AI tools
import { GOOGLE_MAPS_API_KEY, generateGoogleMapsUrl } from "@/config/maps";

/**
 * Generate a map embed URL for use in iframes
 * @param location The location to embed
 * @returns A Google Maps embed URL
 */
export const generateMapEmbedUrl = (location: string): string => {
  if (!location) return '';
  
  const encodedLocation = encodeURIComponent(location);
  return `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodedLocation}`;
};
