/**
 * Format a location URL to be more readable
 * @param locationUrl The URL or address to format
 * @returns Formatted location text
 */
export function formatLocation(locationUrl: string): string {
  // Check if it's any Google Maps URL format
  if (isValidMapsUrl(locationUrl)) {
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
  // If it's already a Google Maps URL, use it directly
  if (isValidMapsUrl(location)) {
    // For shortened URLs like maps.app.goo.gl, don't modify them
    if (location.includes('maps.app.goo.gl') || location.includes('goo.gl/maps')) {
      return location;
    }
    
    // For normal Google Maps URLs, ensure they have the proper format
    try {
      const url = new URL(location);
      // Make sure it opens in directions mode if possible
      if (!url.searchParams.has('dirflg')) {
        url.searchParams.append('dirflg', 'd');
      }
      return url.toString();
    } catch (e) {
      console.error("Error parsing maps URL:", e);
      return location; // Return original if URL parsing fails
    }
  }
  
  // Otherwise create a search URL with the location as the destination
  const encodedLocation = encodeURIComponent(location);
  return `https://www.google.com/maps/dir/?api=1&destination=${encodedLocation}`;
}

/**
 * Generate a maps URL for the provided location
 * @param location Location URL or address
 * @returns A Google Maps URL
 */
export function generateMapsUrl(location: string): string {
  // If it's already a Google Maps URL, use it
  if (isValidMapsUrl(location)) {
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
  
  // Comprehensive check for all Google Maps URL formats
  return (
    url.includes('maps.google.com') || 
    url.includes('goo.gl/maps') || 
    url.includes('maps.app.goo.gl') || 
    url.includes('google.com/maps') ||
    url.includes('maps.google.')
  );
}
