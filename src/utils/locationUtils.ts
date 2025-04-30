
// Location utilities for event creation and display

/**
 * Format a location string for display
 * Trims long addresses and formats them nicely for display
 */
export function formatLocation(location: string): string {
  if (!location) return '';
  
  // Check if it's already a short location
  if (location.length < 60) return location;
  
  // Split the location by commas
  const parts = location.split(',');
  
  if (parts.length <= 2) return location;
  
  // For longer addresses, format more concisely
  const street = parts[0].trim();
  const city = parts[1]?.trim() || '';
  const stateAndPostal = parts[2]?.trim() || '';
  const country = parts[parts.length - 1]?.trim() || '';
  
  if (country && stateAndPostal) {
    return `${street}, ${city}, ${stateAndPostal}, ${country}`;
  }
  
  return location;
}

/**
 * Create a Google Maps URL for a location string
 */
export function generateMapsUrl(location: string): string {
  if (!location) return '';
  
  const encodedLocation = encodeURIComponent(location);
  return `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
}

/**
 * Create a Google Maps directions URL for a location string
 */
export function generateDirectionsUrl(location: string): string {
  if (!location) return '';
  
  const encodedLocation = encodeURIComponent(location);
  return `https://www.google.com/maps/dir/?api=1&destination=${encodedLocation}`;
}

/**
 * Extract only the relevant parts of an address (for display)
 */
export function extractAddressParts(fullAddress: string) {
  if (!fullAddress) return { street: '', city: '', state: '', postalCode: '', country: '' };
  
  const parts = fullAddress.split(',').map(part => part.trim());
  
  // Very basic parsing - could be enhanced for different address formats
  return {
    street: parts[0] || '',
    city: parts[1] || '',
    state: parts[2]?.split(' ')?.[0] || '',
    postalCode: parts[2]?.split(' ')?.[1] || '',
    country: parts[parts.length - 1] || ''
  };
}

/**
 * Format a structured address for display on an event card
 */
export function formatStructuredAddress(address: {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}) {
  const { street, city, state, postalCode, country } = address;
  
  let formattedAddress = '';
  
  if (street) formattedAddress += street;
  
  if (city) {
    if (formattedAddress) formattedAddress += ', ';
    formattedAddress += city;
  }
  
  if (state || postalCode) {
    if (formattedAddress) formattedAddress += ', ';
    if (state) formattedAddress += state;
    if (state && postalCode) formattedAddress += ' ';
    if (postalCode) formattedAddress += postalCode;
  }
  
  if (country) {
    if (formattedAddress) formattedAddress += ', ';
    formattedAddress += country;
  }
  
  return formattedAddress;
}

/**
 * Check if a URL is a valid Google Maps URL
 */
export function isValidMapsUrl(url: string): boolean {
  if (!url) return false;
  
  // Check for common Google Maps URL patterns
  const googleMapsPatterns = [
    'google.com/maps',
    'goo.gl/maps',
    'maps.app.goo.gl',
    'maps.google.com'
  ];
  
  return googleMapsPatterns.some(pattern => url.includes(pattern));
}
