
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
        return placeMatch[1].replace(/\+/g, ' ').replace(/@.*$/, '');
      }
    }
    
    // Extract from search query
    const searchParams = new URL(url).searchParams;
    const query = searchParams.get('query') || searchParams.get('q');
    if (query) {
      return decodeURIComponent(query);
    }
    
    // Extract from coordinates format
    const coordsMatch = decodedUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (coordsMatch) {
      return `${coordsMatch[1]}, ${coordsMatch[2]}`;
    }
    
    return 'Location on Google Maps';
  } catch {
    return url;
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
    if (isValidMapsUrl(location)) {
      return extractLocationFromMapsUrl(location).replace(/[+_]/g, ' ');
    }
    return location;
  } catch {
    return location;
  }
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

