
// Audio utilities for playing reminder sounds

// Default audio URLs
const DEFAULT_NOTIFICATION_SOUND = '/sounds/wakti reminder sound.mp3';
const DEFAULT_REMINDER_SOUND = '/sounds/wakti reminder sound.mp3';
const TASK_COMPLETION_SOUND = '/sounds/wakto task completed sound.mp3';

// Audio context for better control
let audioContext: AudioContext | null = null;

// Track currently playing audio to prevent multiple instances
let currentAudio: HTMLAudioElement | null = null;
let currentSource: AudioBufferSourceNode | null = null;

/**
 * Initialize the audio context (must be called on user interaction)
 */
export const initializeAudio = (): void => {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.error("Web Audio API is not supported in this browser", error);
    }
  }
};

/**
 * Stop any currently playing audio
 */
const stopCurrentAudio = () => {
  if (currentSource) {
    try {
      currentSource.stop();
      currentSource.disconnect();
      currentSource = null;
    } catch (e) {
      // Ignore errors if already stopped
    }
  }
  
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    } catch (e) {
      // Ignore errors if already paused
    }
  }
};

/**
 * Play a notification sound with the provided options
 */
export const playNotificationSound = async (options: {
  soundUrl?: string;
  volume?: number;
  duration?: number;
} = {}): Promise<void> => {
  const { 
    soundUrl = DEFAULT_REMINDER_SOUND, 
    volume = 0.7,
    duration = 3000 // Default 3 seconds
  } = options;
  
  // Stop any currently playing audio
  stopCurrentAudio();
  
  try {
    // Create and play a simple audio element - simpler approach
    const audio = new Audio(soundUrl);
    audio.volume = volume;
    audio.loop = false; // Ensure no looping
    
    // Store current audio
    currentAudio = audio;
    
    // Play the audio once
    await audio.play();
    
    // Auto-stop after 2 seconds for task completion sounds or after duration for other sounds
    const soundDuration = soundUrl === TASK_COMPLETION_SOUND ? 2000 : duration;
    
    // Stop after duration
    setTimeout(() => {
      if (currentAudio === audio) {
        audio.pause();
        audio.currentTime = 0;
        currentAudio = null;
      }
    }, soundDuration);
  } catch (error) {
    console.error("Failed to play notification sound:", error);
    
    // Special handling for browser autoplay policy
    if (error instanceof DOMException && error.name === "NotAllowedError") {
      console.warn("Audio playback was prevented due to browser autoplay policy. User interaction is required.");
      initializeAudio(); // Try to initialize audio context on user interaction
    }
  }
};

/**
 * Play task completion sound
 */
export const playTaskCompletionSound = async (volume: number = 0.7): Promise<void> => {
  return playNotificationSound({
    soundUrl: TASK_COMPLETION_SOUND,
    volume,
    duration: 2000 // Fixed 2-second duration for completion sound
  });
};

/**
 * Request permission to play sounds and show notifications
 */
export const requestAudioPermission = async (): Promise<boolean> => {
  // Initialize audio on user interaction
  initializeAudio();
  
  // Return true if we successfully initialized audio
  return !!audioContext;
};
