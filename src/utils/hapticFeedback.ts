
/**
 * Utility functions for providing haptic feedback on mobile devices
 */

// Check if the device supports vibration
const supportsVibration = (): boolean => {
  return typeof navigator !== 'undefined' && 'vibrate' in navigator;
};

// Provides a light tap feedback (short vibration)
export const lightHapticFeedback = (): void => {
  if (supportsVibration()) {
    navigator.vibrate(10);
  }
};

// Provides a medium feedback for confirmations
export const mediumHapticFeedback = (): void => {
  if (supportsVibration()) {
    navigator.vibrate(40);
  }
};

// Provides strong feedback for important actions
export const strongHapticFeedback = (): void => {
  if (supportsVibration()) {
    navigator.vibrate([60, 30, 60]);
  }
};

// Provides error feedback (double vibration)
export const errorHapticFeedback = (): void => {
  if (supportsVibration()) {
    navigator.vibrate([30, 50, 80]);
  }
};

// Success pattern (triple pulse)
export const successHapticFeedback = (): void => {
  if (supportsVibration()) {
    navigator.vibrate([30, 20, 30, 20, 30]);
  }
};

// Warning pattern
export const warningHapticFeedback = (): void => {
  if (supportsVibration()) {
    navigator.vibrate([20, 30, 80]);
  }
};

// Platform-aware haptic feedback
export const platformHapticFeedback = (type: 'selection' | 'impact' | 'notification' | 'success' | 'warning' | 'error'): void => {
  // Get platform from HTML class
  const isIOS = document.documentElement.classList.contains('ios');
  const isAndroid = document.documentElement.classList.contains('android');
  
  // Apply platform-specific patterns
  if (isIOS) {
    // iOS-like haptic patterns (shorter, more subtle)
    switch (type) {
      case 'selection': lightHapticFeedback(); break;
      case 'impact': mediumHapticFeedback(); break;
      case 'notification': navigator.vibrate(25); break;
      case 'success': navigator.vibrate([15, 10, 15]); break;
      case 'warning': navigator.vibrate([20, 20, 20]); break;
      case 'error': navigator.vibrate([20, 30, 40]); break;
    }
  } else if (isAndroid) {
    // Android-like haptic patterns (slightly stronger)
    switch (type) {
      case 'selection': navigator.vibrate(15); break;
      case 'impact': navigator.vibrate(50); break;
      case 'notification': navigator.vibrate([25, 50, 25]); break;
      case 'success': navigator.vibrate([30, 20, 30, 20, 30]); break;
      case 'warning': navigator.vibrate([20, 30, 80]); break;
      case 'error': navigator.vibrate([30, 50, 100]); break;
    }
  } else {
    // Default fallback
    switch (type) {
      case 'selection': lightHapticFeedback(); break;
      case 'impact': mediumHapticFeedback(); break;
      case 'notification': mediumHapticFeedback(); break;
      case 'success': successHapticFeedback(); break;
      case 'warning': warningHapticFeedback(); break;
      case 'error': errorHapticFeedback(); break;
    }
  }
};
