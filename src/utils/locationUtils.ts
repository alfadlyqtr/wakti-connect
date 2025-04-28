
/**
 * Location formatting and map URL generation utilities
 */

export const generateMapsUrl = (location: string): string => {
  if (!location) return '';
  if (location.includes('google.com/maps')) return location;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
};

export const formatLocation = (location: string, type?: 'manual' | 'google_maps'): string => {
  if (!location) return '';
  
  // If it's a maps URL, try to extract a readable location
  if (location.includes('google.com/maps')) {
    const decodedLocation = decodeURIComponent(location);
    const queryMatch = decodedLocation.match(/[?&]q=([^&]+)/);
    if (queryMatch) {
      return decodeURIComponent(queryMatch[1].replace(/\+/g, ' '));
    }
  }
  
  return location;
};

