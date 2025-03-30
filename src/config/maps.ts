
/**
 * Utility functions for Google Maps integration
 */

export const generateMapEmbedUrl = (address: string): string => {
  // Encode the address for use in a URL
  const encodedAddress = encodeURIComponent(address);
  
  // Return a Google Maps embed URL with the encoded address
  return `https://www.google.com/maps/embed/v1/place?key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY&q=${encodedAddress}`;
};
