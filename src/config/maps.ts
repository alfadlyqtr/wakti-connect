
// Google Maps API configuration
export const GOOGLE_MAPS_API_KEY = "AIzaSyA4j92W_YgT4LdU5pzw6a0kzHNAtdz3i2E";

// Function to generate Google Maps embed URL
export const generateMapEmbedUrl = (address: string): string => {
  return `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(address)}&zoom=15`;
};
