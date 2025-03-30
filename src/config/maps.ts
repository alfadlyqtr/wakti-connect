
export const GOOGLE_MAPS_API_KEY = 'AIzaSyA4j92W_YgT4LdU5pzw6a0kzHNAtdz3i2E';

// Helper to generate a Google Maps URL from coordinates or place name
export const generateGoogleMapsUrl = (query: string): string => {
  if (!query) return '';
  
  // Check if query is coordinates (lat,lng format)
  const isCoordinates = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/.test(query);
  
  if (isCoordinates) {
    return `https://www.google.com/maps?q=${query}`;
  } else {
    // It's a place name, encode it for URL
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  }
};

// Generate embed URL for Google Maps iframes
export const generateMapEmbedUrl = (address: string): string => {
  return `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(address)}`;
};
