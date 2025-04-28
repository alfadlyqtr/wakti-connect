
/**
 * Location formatting and map URL generation utilities
 */

export const generateMapsUrl = (location: string): string => {
  if (!location) return '';
  if (location.includes('google.com/maps')) return location;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
};

export const formatLocation = (location: string): string => {
  if (!location) return '';
  
  // If it's a maps URL, try to extract a readable location
  if (location.includes('google.com/maps')) {
    // Try to extract location name from the URL
    const decodedLocation = decodeURIComponent(location);
    const parts = decodedLocation.split('/');
    const lastPart = parts[parts.length - 1];
    
    // Remove any URL parameters
    const cleanLocation = lastPart.split('?')[0];
    
    // Replace plus signs and underscores with spaces
    return cleanLocation.replace(/[+_]/g, ' ').trim();
  }
  
  return location;
};
