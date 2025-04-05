
import { supabase } from '@/integrations/supabase/client';

/**
 * Maps configuration module
 * Provides Google Maps API key and utility functions
 */

// Export a constant API key for immediate use
// Note: In production, this should be replaced with a key from environment variables
export const GOOGLE_MAPS_API_KEY = 'AIzaSyBIwzALxUPNbatRBj3X1HyELQG7xToQ3vA';

/**
 * Fetches the Google Maps API key from the Supabase Edge Function
 * Falls back to the static key if needed
 */
export const getMapsApiKey = async (): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('get-maps-key');
    
    if (error) {
      console.error('Error fetching Maps API key:', error);
      return GOOGLE_MAPS_API_KEY; // Fallback to constant key
    }
    
    return data.apiKey || GOOGLE_MAPS_API_KEY;
  } catch (err) {
    console.error('Exception fetching Maps API key:', err);
    return GOOGLE_MAPS_API_KEY; // Fallback to constant key
  }
};

/**
 * Generates a Google Maps embed URL for a location query
 * @param location - The location to search for
 * @returns A URL string for the Google Maps embed
 */
export const generateMapEmbedUrl = (location: string): string => {
  if (!location) return '';
  const encodedLocation = encodeURIComponent(location);
  return `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodedLocation}`;
};

/**
 * Generates a link to open a location in Google Maps
 * @param location - The location to search for
 * @returns A URL string for Google Maps
 */
export const generateGoogleMapsUrl = (location: string): string => {
  if (!location) return '';
  const encodedLocation = encodeURIComponent(location);
  return `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
};

// For backward compatibility - export the key as default
export default GOOGLE_MAPS_API_KEY;
