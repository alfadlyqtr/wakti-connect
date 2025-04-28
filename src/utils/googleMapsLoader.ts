
/**
 * Google Maps initialization utilities
 */

/**
 * Check if Google Maps API and Places library are loaded
 */
export const isGoogleMapsLoaded = (): boolean => {
  return typeof window !== 'undefined' && 
         typeof window.google !== 'undefined' && 
         typeof window.google.maps !== 'undefined' &&
         typeof window.google.maps.places !== 'undefined';
};

/**
 * Wait for Google Maps API to load with configurable timeout
 * @param timeoutMs - Maximum time to wait for Google Maps to load in milliseconds
 * @returns Promise that resolves when Google Maps is loaded
 */
export const waitForGoogleMapsToLoad = (timeoutMs: number = 10000): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (isGoogleMapsLoaded()) {
      console.log('Google Maps API and Places library already loaded');
      resolve();
      return;
    }
    
    let timeoutId: ReturnType<typeof setTimeout>;
    const checkInterval = setInterval(() => {
      if (isGoogleMapsLoaded()) {
        console.log('Google Maps API and Places library loaded successfully');
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
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBQ6iROkrf7ebTpqevZPaa0-Gdb_-ORw0Y';
  
  if (isGoogleMapsLoaded()) {
    console.log('Google Maps API already loaded, skipping initialization');
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    try {
      console.log('Starting Google Maps API initialization...');
      
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMaps`;
      script.async = true;
      script.defer = true;
      
      window.initGoogleMaps = function() {
        console.log('Google Maps API initialized successfully');
        resolve();
      };
      
      script.onerror = (error) => {
        console.error('Failed to load Google Maps script:', error);
        reject(new Error('Failed to load Google Maps API script'));
      };
      
      document.head.appendChild(script);
    } catch (error) {
      console.error('Error in Google Maps initialization:', error);
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
