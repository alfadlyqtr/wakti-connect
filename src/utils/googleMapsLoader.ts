
/**
 * Google Maps initialization utilities
 */

/**
 * Check if Google Maps API and Places library are loaded
 */
export const isGoogleMapsLoaded = (): boolean => {
  const isGoogleDefined = typeof window.google !== 'undefined';
  const isMapsLoaded = isGoogleDefined && typeof window.google.maps !== 'undefined';
  const isPlacesLoaded = isMapsLoaded && typeof window.google.maps.places !== 'undefined';
  
  return isPlacesLoaded;
};

/**
 * Wait for Google Maps API to load with configurable timeout
 */
export const waitForGoogleMapsToLoad = (timeoutMs: number = 10000): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (isGoogleMapsLoaded()) {
      console.log('[Maps] Already loaded');
      resolve();
      return;
    }
    
    let attempts = 0;
    const maxAttempts = 20;
    const checkInterval = setInterval(() => {
      attempts++;
      
      if (isGoogleMapsLoaded()) {
        console.log('[Maps] Successfully loaded');
        clearInterval(checkInterval);
        resolve();
      } else if (attempts >= maxAttempts) {
        clearInterval(checkInterval);
        reject(new Error('Google Maps failed to load after maximum attempts'));
      }
    }, 500);
  });
};

/**
 * Dynamically load Google Maps API
 */
export const loadGoogleMapsApi = async (): Promise<void> => {
  // Use the API key from the configuration
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  // If Google Maps is already loaded, return immediately
  if (isGoogleMapsLoaded()) {
    console.log('[Maps] API already loaded');
    return Promise.resolve();
  }

  // Remove any existing scripts to prevent duplicates
  const existingScripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
  existingScripts.forEach(script => {
    console.log('[Maps] Removing existing script to prevent duplication');
    document.head.removeChild(script);
  });

  return new Promise((resolve, reject) => {
    try {
      console.log('[Maps] Starting initialization...');
      
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.type = 'text/javascript';
      
      // Important: do NOT use async/defer here as it can cause timing issues
      script.onload = () => {
        console.log('[Maps] Script loaded successfully');
        resolve();
      };
      
      script.onerror = (error) => {
        console.error('[Maps] Failed to load script:', error);
        reject(new Error('Failed to load Google Maps API script'));
      };
      
      document.head.appendChild(script);
    } catch (error) {
      console.error('[Maps] Error in initialization:', error);
      reject(error);
    }
  });
};

declare global {
  interface Window {
    google: any;
  }
}
