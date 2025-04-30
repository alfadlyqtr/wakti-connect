/**
 * Format a location URL to be more readable
 * @param locationUrl The URL or address to format
 * @returns Formatted location text
 */
export function formatLocation(locationUrl: string): string {
  // Check if it's a Google Maps URL
  if (locationUrl.includes('maps.google.com') || locationUrl.includes('goo.gl/maps')) {
    return 'Google Maps Location';
  }
  
  // Remove protocol and www
  let formatted = locationUrl
    .replace(/^https?:\/\/(www\.)?/i, '')
    .replace(/\/.*$/, ''); // Remove path
  
  return formatted || locationUrl;
}

/**
 * Generate a directions URL for the provided location
 * @param location Location URL or address
 * @returns A Google Maps directions URL
 */
export function generateDirectionsUrl(location: string): string {
  // If it's already a Google Maps URL, use it
  if (location.includes('maps.google.com') || location.includes('goo.gl/maps')) {
    return location;
  }
  
  // Otherwise create a search URL
  const encodedLocation = encodeURIComponent(location);
  return `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
}

/**
 * Generate a maps URL for the provided location
 * @param location Location URL or address
 * @returns A Google Maps URL
 */
export function generateMapsUrl(location: string): string {
  // If it's already a Google Maps URL, use it
  if (location.includes('maps.google.com') || location.includes('goo.gl/maps')) {
    return location;
  }
  
  // Otherwise create a search URL
  const encodedLocation = encodeURIComponent(location);
  return `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
}

/**
 * Check if a URL is a valid Google Maps URL
 * @param url URL to check
 * @returns Boolean indicating if the URL is a valid Google Maps URL
 */
export function isValidMapsUrl(url: string): boolean {
  if (!url) return false;
  
  // Simple validation to check if it's a Google Maps URL
  return (
    url.includes('maps.google.com') || 
    url.includes('goo.gl/maps') || 
    url.includes('maps.app.goo.gl') || 
    url.includes('google.com/maps')
  );
}
