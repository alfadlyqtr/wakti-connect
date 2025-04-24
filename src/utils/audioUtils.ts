
/**
 * Simple utility functions for audio handling
 */

/**
 * Request permission to play audio (mainly for iOS devices)
 * Returns a boolean indicating whether permission was granted
 */
export const requestAudioPermission = async (): Promise<boolean> => {
  try {
    // Create a silent audio context to request permission
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create and play a silent sound to trigger permission prompt
    const oscillator = audioContext.createOscillator();
    oscillator.connect(audioContext.destination);
    oscillator.start(0);
    oscillator.stop(0.1);
    
    // If we get here without an error, permission is granted
    return true;
  } catch (error) {
    console.error("Error requesting audio permission:", error);
    return false;
  }
};

/**
 * Play a notification sound
 * @param options Configuration options for the sound
 */
export const playNotificationSound = (options?: {
  soundUrl?: string;
  volume?: number;
}): void => {
  try {
    const { 
      soundUrl = '/sounds/wakti reminder sound.mp3',
      volume = 0.5 
    } = options || {};
    
    const audio = new Audio(soundUrl);
    audio.volume = volume;
    
    // Play the sound
    audio.play().catch(error => {
      console.warn("Could not play notification sound:", error);
    });
  } catch (error) {
    console.error("Error playing notification sound:", error);
  }
};
