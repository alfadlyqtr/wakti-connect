
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

export const extractLocationFromMapsUrl = (url: string): string => {
  try {
    if (!isValidMapsUrl(url)) return url;
    
    const decodedUrl = decodeURIComponent(url);
    
    // Handle different Google Maps URL formats
    if (decodedUrl.includes('/place/')) {
      const placeMatch = decodedUrl.match(/\/place\/([^/]+)/);
      if (placeMatch) {
        return placeMatch[1]
          .replace(/\+/g, ' ')
          .replace(/@.*$/, '')
          .replace(/\d+\.\d+,\d+\.\d+/, '') // Remove coordinates
          .replace(/,/g, ', '); // Add spaces after commas
      }
    }
    
    // Extract from query parameters
    const searchParams = new URL(url).searchParams;
    const query = searchParams.get('query') || searchParams.get('q');
    if (query) {
      return decodeURIComponent(query).replace(/\+/g, ' ');
    }
    
    // Extract coordinates and try to make them more readable
    const coordsMatch = decodedUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (coordsMatch) {
      const lat = parseFloat(coordsMatch[1]).toFixed(6);
      const lng = parseFloat(coordsMatch[2]).toFixed(6);
      return `Location (${lat}, ${lng})`;
    }
    
    return 'Location on Google Maps';
  } catch {
    return url;
  }
};

export const generateMapsUrl = (location: string): string => {
  if (!location) return '';
  if (isValidMapsUrl(location)) return location;
  
  // If it's coordinates, format them properly
  const coordsMatch = location.match(/\((-?\d+\.\d+),\s*(-?\d+\.\d+)\)/);
  if (coordsMatch) {
    return `https://www.google.com/maps/search/?api=1&query=${coordsMatch[1]},${coordsMatch[2]}`;
  }
  
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
};

export const generateDirectionsUrl = (location: string): string => {
  if (!location) return '';
  
  if (isValidMapsUrl(location)) {
    const url = new URL(location);
    const placeId = url.searchParams.get('place_id');
    
    if (placeId) {
      return `https://www.google.com/maps/dir/?api=1&destination_place_id=${placeId}`;
    }
    
    const query = url.searchParams.get('query');
    if (query) {
      return `https://www.google.com/maps/dir/?api=1&destination=${query}`;
    }
    
    const coordsMatch = location.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (coordsMatch) {
      return `https://www.google.com/maps/dir/?api=1&destination=${coordsMatch[1]},${coordsMatch[2]}`;
    }
  }
  
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location)}`;
};

export const formatLocation = (location: string): string => {
  if (!location) return '';
  
  try {
    if (isValidMapsUrl(location)) {
      return extractLocationFromMapsUrl(location)
        .replace(/\+/g, ' ')
        .replace(/%20/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2'); // Add spaces between camelCase
    }
    return location;
  } catch {
    return location;
  }
};
