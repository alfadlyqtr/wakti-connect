
/**
 * Google Maps initialization utilities
 */

/**
 * Check if Google Maps API is loaded
 */
export const isGoogleMapsLoaded = (): boolean => {
  return typeof window !== 'undefined' && 
         typeof window.google !== 'undefined' && 
         typeof window.google.maps !== 'undefined';
};

/**
 * Wait for Google Maps API to load with configurable timeout
 * @param timeoutMs - Maximum time to wait for Google Maps to load in milliseconds
 * @returns Promise that resolves when Google Maps is loaded
 */
export const waitForGoogleMapsToLoad = (timeoutMs: number = 10000): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (isGoogleMapsLoaded()) {
      console.log('Google Maps API already loaded');
      resolve();
      return;
    }
    
    let timeoutId: ReturnType<typeof setTimeout>;
    const checkInterval = setInterval(() => {
      if (isGoogleMapsLoaded()) {
        console.log('Google Maps API loaded successfully');
        clearInterval(checkInterval);
        if (timeoutId) clearTimeout(timeoutId);
        resolve();
      }
    }, 100);

    timeoutId = setTimeout(() => {
      clearInterval(checkInterval);
      reject(new Error('Google Maps failed to load within timeout period'));
    }, timeoutMs);
  });
};

/**
 * Dynamically load Google Maps API if not already loaded
 */
export const loadGoogleMapsApi = async (): Promise<void> => {
  const GOOGLE_MAPS_API_KEY = 'AIzaSyBQ6iROkrf7ebTpqevZPaa0-Gdb_-ORw0Y';
  
  if (isGoogleMapsLoaded()) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    try {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geocoding&callback=initGoogleMaps`;
      script.async = true;
      script.defer = true;
      
      window.initGoogleMaps = function() {
        console.log('Google Maps API initialized via dynamic loading');
        resolve();
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load Google Maps API script'));
      };
      
      document.head.appendChild(script);
    } catch (error) {
      reject(error);
    }
  });
};

declare global {
  interface Window {
    initGoogleMaps?: () => void;
    google: any;
  }
}
