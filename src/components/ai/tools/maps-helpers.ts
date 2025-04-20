
// Maps helpers for AI tools
import { TOMTOM_API_KEY, generateTomTomMapsUrl } from "@/config/maps";

/**
 * Generate a map embed URL for use in iframes
 * @param location The location to embed
 * @returns A TomTom Maps embed URL
 */
export const generateMapEmbedUrl = (location: string): string => {
  if (!location) return '';
  
  const encodedLocation = encodeURIComponent(location);
  // TomTom doesn't have a direct embed API like Google Maps
  // This is a simplified approach - just linking to TomTom search
  return `https://www.tomtom.com/en_gb/maps/search/${encodedLocation}/`;
};
