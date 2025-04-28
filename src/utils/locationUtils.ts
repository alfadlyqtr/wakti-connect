
/**
 * Location formatting and map URL generation utilities
 */

export const isValidMapsUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return (
      urlObj.hostname.includes('google.com/maps') ||
      urlObj.hostname.includes('maps.google.com') ||
      urlObj.hostname.includes('maps.app.goo.gl') ||
      urlObj.hostname.includes('goo.gl/maps')
    );
  } catch {
    return false;
  }
};

export const generateMapsUrl = (location: string): string => {
  if (!location) return '';
  if (isValidMapsUrl(location)) return location;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
};

export const formatLocation = (location: string): string => {
  if (!location) return '';
  
  try {
    // If it's a maps URL, try to extract a readable location
    if (isValidMapsUrl(location)) {
      const decodedLocation = decodeURIComponent(location);
      
      // Handle goo.gl shortened URLs
      if (decodedLocation.includes('goo.gl') || decodedLocation.includes('maps.app')) {
        return 'Location selected (via Google Maps)';
      }
      
      // For full Google Maps URLs, try to extract location name
      const parts = decodedLocation.split(/[/?]/);
      const locationPart = parts.find(part => 
        !part.includes('google.com') && 
        !part.includes('maps') && 
        !part.startsWith('@') &&
        part.length > 0
      );
      
      if (locationPart) {
        return locationPart.replace(/[+_]/g, ' ').trim();
      }
      
      return 'Location selected (via Google Maps)';
    }
    
    return location;
  } catch {
    return location;
  }
};
