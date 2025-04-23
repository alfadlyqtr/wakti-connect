
/**
 * Google Maps initialization utilities
 */

export const isGoogleMapsLoaded = (): boolean => {
  return typeof window.google !== 'undefined' && typeof window.google.maps !== 'undefined';
};

export const waitForGoogleMapsToLoad = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (isGoogleMapsLoaded()) {
      resolve();
      return;
    }

    const checkInterval = setInterval(() => {
      if (isGoogleMapsLoaded()) {
        clearInterval(checkInterval);
        resolve();
      }
    }, 100);

    // Timeout after 10 seconds
    setTimeout(() => {
      clearInterval(checkInterval);
      reject(new Error('Google Maps failed to load'));
    }, 10000);
  });
};
