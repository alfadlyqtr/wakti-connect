
/**
 * Maps configuration and utilities
 */
import { supabase } from "@/integrations/supabase/client";

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Validate that we have a valid API key
if (!MAPS_API_KEY) {
  console.warn('Warning: No Google Maps API key found. Map functionality will be limited.');
}

export const GOOGLE_MAPS_API_KEY = MAPS_API_KEY;

/**
 * Generate a Google Maps URL for linking to a specific location
 */
export const generateGoogleMapsUrl = (location: string): string => {
  if (!location) return '';
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
};

/**
 * Check if a URL is a valid Google Maps URL
 */
export const isValidMapsUrl = (url: string): boolean => {
  if (!url) return false;
  return url.includes('google.com/maps');
};

/**
 * Format a Google Maps URL for display
 */
export const formatMapsUrl = (url: string): string => {
  if (!url) return '';
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
};

/**
 * Handle common Google Maps API errors
 */
export const handleMapsError = (error: any): string => {
  if (error.status === 403) {
    return "API key restrictions are preventing this request. Please check your Google Cloud Console settings.";
  } else if (error.status === 404) {
    return "No results found for this location.";
  } else {
    return "An error occurred while accessing Google Maps services.";
  }
};

