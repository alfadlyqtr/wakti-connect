
/**
 * Maps configuration and utilities
 */
import { supabase } from "@/integrations/supabase/client";

const MAPS_API_KEY = import.meta.env.VITE_TOMTOM_API_KEY;

// Validate that we have a valid API key
if (!MAPS_API_KEY) {
  console.warn('Warning: No TomTom Maps API key found. Map functionality will be limited.');
}

export const TOMTOM_API_KEY = MAPS_API_KEY;

/**
 * Generate a TomTom Maps URL for linking to a specific location
 * Returns a string directly instead of a Promise to fix type issues
 */
export const generateTomTomMapsUrl = (location: string): string => {
  if (!location) return '';
  
  // Generate a simple URL for immediate use (non-async)
  return `https://www.tomtom.com/en_gb/maps/search/${encodeURIComponent(location)}/`;
};

/**
 * Async version that properly geocodes but needs to be awaited
 */
export const generateTomTomMapsUrlAsync = async (location: string): Promise<string> => {
  if (!location) return '';
  
  try {
    // Call the Supabase Edge Function to get coordinates
    const { data, error } = await supabase.functions.invoke('tomtom-geocode', {
      body: { query: location }
    });

    if (error) {
      console.error('Error geocoding location:', error);
      return generateTomTomMapsUrl(location); // Fallback to simple URL
    }

    if (data && data.coordinates) {
      const { lat, lon } = data.coordinates;
      return `https://www.tomtom.com/en_gb/maps/view?lat=${lat}&lon=${lon}`;
    }

    return generateTomTomMapsUrl(location); // Fallback to simple URL
  } catch (error) {
    console.error('Error generating TomTom Maps URL:', error);
    return generateTomTomMapsUrl(location); // Fallback to simple URL
  }
};

/**
 * Check if a URL is a valid TomTom Maps URL
 */
export const isValidMapsUrl = (url: string): boolean => {
  if (!url) return false;
  return url.includes('tomtom.com/maps') || url.includes('tomtom.com/en_gb/maps');
};

/**
 * Format a TomTom Maps URL for display
 */
export const formatMapsUrl = (url: string): string => {
  if (!url) return '';
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
};

/**
 * Handle common TomTom Maps API errors
 */
export const handleMapsError = (error: any): string => {
  if (error.status === 403) {
    return "API key restrictions are preventing this request. Please check your TomTom Developer Console settings.";
  } else if (error.status === 404) {
    return "No results found for this location.";
  } else {
    return "An error occurred while accessing TomTom Maps services.";
  }
};

// For backward compatibility with Google Maps references
export const GOOGLE_MAPS_API_KEY = TOMTOM_API_KEY;
export const generateGoogleMapsUrl = generateTomTomMapsUrl;
export const generateGoogleMapsUrlAsync = generateTomTomMapsUrlAsync;
export const isValidGoogleMapsUrl = isValidMapsUrl;
