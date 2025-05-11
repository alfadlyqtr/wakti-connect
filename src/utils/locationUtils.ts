
/**
 * Validates if a URL is a valid Google Maps URL
 */
export const isValidMapsUrl = (url: string): boolean => {
  if (!url) return false;
  
  // Simple check if it contains maps.google or google.com/maps
  return url.includes("maps.google") || 
         url.includes("google.com/maps") || 
         url.includes("goo.gl/maps");
};

/**
 * Generates a directions URL from a Google Maps URL
 * If the URL already has directions, it will return the URL as is
 */
export const generateDirectionsUrl = (url: string): string => {
  if (!url) return "";
  
  // If the URL already contains 'dir', it's a directions URL
  if (url.includes("/dir/") || url.includes("&dirflg=")) {
    return url;
  }
  
  // Extract the place ID or coordinates if available
  const placeIdMatch = url.match(/[?&]q=place_id:([^&]+)/);
  if (placeIdMatch && placeIdMatch[1]) {
    return `https://www.google.com/maps/dir/?api=1&destination=place_id:${placeIdMatch[1]}`;
  }
  
  // Extract coordinates if available
  const coordMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (coordMatch && coordMatch[1] && coordMatch[2]) {
    return `https://www.google.com/maps/dir/?api=1&destination=${coordMatch[1]},${coordMatch[2]}`;
  }
  
  // If we can't extract specific coordinates or place ID, return the original URL
  return url;
};
