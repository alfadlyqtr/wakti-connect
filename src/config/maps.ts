
// Replace with your actual Google Maps API key - using a placeholder for development
export const GOOGLE_MAPS_API_KEY = "AIzaSyC5vVwJj8r01_2VLL0Z_34Z9PnVpA0PhcQ";

// Generate a Google Maps URL from a location string or coordinates
export const generateGoogleMapsUrl = (location: string): string => {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
};

// Format a Google Maps URL to make it more readable
export const formatMapsUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    if (urlObj.searchParams.has('query')) {
      return `Google Maps: ${decodeURIComponent(urlObj.searchParams.get('query') || '')}`;
    }
    return url;
  } catch {
    return url;
  }
};

// Check if a string is a valid Google Maps URL
export const isValidGoogleMapsUrl = (url: string): boolean => {
  if (!url) return false;
  
  // Check for various valid Google Maps URL formats
  const googleMapsPatterns = [
    // Standard maps.google.com format
    /^https?:\/\/(www\.)?maps\.google\.com/,
    // Standard google.com/maps format
    /^https?:\/\/(www\.)?google\.com\/maps/,
    // Short URL format (goo.gl)
    /^https?:\/\/goo\.gl\/maps\//,
    // Mobile app URL format
    /^https?:\/\/maps\.app\.goo\.gl\//,
    // Coordinate-based format
    /^https?:\/\/(www\.)?google\.com\/maps\/place\/[^\/]+\/@[-\d.]+,[-\d.]+/
  ];

  return googleMapsPatterns.some(pattern => pattern.test(url));
};

// Generate an embed URL for maps
export const generateMapEmbedUrl = (location: string): string => {
  return `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(location)}`;
};

// Get Maps API key (for components that need it directly)
export const getMapsApiKey = (): string => {
  return GOOGLE_MAPS_API_KEY;
};
