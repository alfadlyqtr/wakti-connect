
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
      
      // For full Google Maps URLs, try to extract place name
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

// Get a simplified location name for display purposes
export const getLocationName = (location: string): string => {
  const formatted = formatLocation(location);
  if (!formatted) return '';
  
  // If it's a long location, truncate it
  if (formatted.length > 30) {
    return formatted.substring(0, 30) + '...';
  }
  
  return formatted;
};

// Generate directions URL for navigation
export const generateDirectionsUrl = (location: string): string => {
  if (!location) return '';
  
  // If it's already a Maps URL, convert it to a directions URL
  if (isValidMapsUrl(location)) {
    // Extract coordinates or query from the URL if possible
    try {
      const url = new URL(location);
      const query = url.searchParams.get('query');
      const place_id = url.searchParams.get('place_id');
      
      if (place_id) {
        return `https://www.google.com/maps/dir/?api=1&destination=&destination_place_id=${place_id}`;
      }
      
      if (query) {
        return `https://www.google.com/maps/dir/?api=1&destination=${query}`;
      }
      
      // Handle URLs with @lat,lng format
      const path = url.pathname;
      const atMatch = path.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (atMatch) {
        return `https://www.google.com/maps/dir/?api=1&destination=${atMatch[1]},${atMatch[2]}`;
      }
    } catch {
      // If parsing fails, fall back to original URL
    }
  }
  
  // If it's not a Maps URL, create a directions URL to the location
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location)}`;
};
