
const TASK_COMPLETION_SOUND = '/sounds/wakto task completed sound.mp3';
const DEFAULT_NOTIFICATION_SOUND = '/sounds/wakti reminder sound.mp3';

// Track currently playing audio to prevent multiple instances
let currentAudio: HTMLAudioElement | null = null;

/**
 * Stop any currently playing audio
 */
const stopCurrentAudio = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
};

/**
 * Request permission to play audio
 * Returns true if permission is granted or not needed
 */
export const requestAudioPermission = async (): Promise<boolean> => {
  // Most browsers don't require explicit audio permission, but we'll check for future compatibility
  try {
    // Create a silent audio context to test permissions
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }
    
    // Close the test context after checking
    if (audioContext.state === 'running') {
      audioContext.close();
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error requesting audio permission:", error);
    return false;
  }
};

/**
 * Play task completion sound once
 */
export const playTaskCompletionSound = async (volume: number = 0.7): Promise<void> => {
  // Stop any currently playing audio
  stopCurrentAudio();
  
  try {
    const audio = new Audio(TASK_COMPLETION_SOUND);
    audio.volume = volume;
    audio.loop = false;
    
    // Store current audio
    currentAudio = audio;
    
    // Play the audio once
    await audio.play();
    
    // Clean up after playback ends
    audio.onended = () => {
      stopCurrentAudio();
    };
  } catch (error) {
    console.error("Failed to play completion sound:", error);
  }
};

/**
 * Play notification sound
 * @param options Configuration options for the notification sound
 */
export const playNotificationSound = async (options?: {
  soundUrl?: string;
  volume?: number;
  loop?: boolean;
}): Promise<void> => {
  // Stop any currently playing audio
  stopCurrentAudio();
  
  try {
    const soundUrl = options?.soundUrl || DEFAULT_NOTIFICATION_SOUND;
    const volume = options?.volume ?? 0.7;
    const loop = options?.loop ?? false;
    
    const audio = new Audio(soundUrl);
    audio.volume = volume;
    audio.loop = loop;
    
    // Store current audio
    currentAudio = audio;
    
    // Play the audio
    await audio.play();
    
    // Clean up after playback ends if not looping
    if (!loop) {
      audio.onended = () => {
        stopCurrentAudio();
      };
    }
  } catch (error) {
    console.error("Failed to play notification sound:", error);
  }
};
