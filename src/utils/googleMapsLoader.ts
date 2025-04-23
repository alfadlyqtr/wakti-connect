
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
    // Check if already loaded
    if (isGoogleMapsLoaded()) {
      console.log('Google Maps API already loaded');
      resolve();
      return;
    }
    
    // Set up a listener for when the API loads
    let timeoutId: number | undefined;
    const checkInterval = setInterval(() => {
      if (isGoogleMapsLoaded()) {
        console.log('Google Maps API loaded successfully');
        clearInterval(checkInterval);
        if (timeoutId) clearTimeout(timeoutId);
        resolve();
      }
    }, 100);

    // Set timeout to avoid waiting forever
    timeoutId = setTimeout(() => {
      clearInterval(checkInterval);
      const error = new Error('Google Maps failed to load within timeout period');
      console.error(error);
      reject(error);
    }, timeoutMs);
  });
};

/**
 * Dynamically load Google Maps API if not already loaded
 * @param apiKey Google Maps API key
 * @param libraries Optional libraries to load (e.g., 'places', 'geometry')
 * @returns Promise that resolves when Google Maps is loaded
 */
export const loadGoogleMapsApi = (
  apiKey: string, 
  libraries: string[] = ['places']
): Promise<void> => {
  // Return immediately if already loaded
  if (isGoogleMapsLoaded()) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    try {
      // Create script element
      const script = document.createElement('script');
      const librariesParam = libraries.join(',');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${librariesParam}&callback=initGoogleMaps`;
      script.async = true;
      script.defer = true;
      
      // Define callback function
      window.initGoogleMaps = function() {
        console.log('Google Maps API initialized via dynamic loading');
        resolve();
      };
      
      // Handle errors
      script.onerror = () => {
        reject(new Error('Failed to load Google Maps API script'));
      };
      
      // Add script to document
      document.head.appendChild(script);
    } catch (error) {
      reject(error);
    }
  });
};

// Add the global callback to window
declare global {
  interface Window {
    initGoogleMaps?: () => void;
    google: any;
  }
}
