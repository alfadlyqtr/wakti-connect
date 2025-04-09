
export const generateGoogleMapsUrl = (location: string): string => {
  // Remove any existing URLs from the location string
  const cleanLocation = location.replace(/https?:\/\/[^\s]+/g, '').trim();
  
  // Create the Google Maps URL
  const encodedLocation = encodeURIComponent(cleanLocation);
  return `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
};

export const generateLocationMessage = (location: string, mapsUrl: string): string => {
  return `Location: ${location}\n${mapsUrl}`;
};
