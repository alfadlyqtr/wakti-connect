
// Audio utilities for playing reminder sounds

// Default audio URLs - we use the correct notification sounds
const DEFAULT_NOTIFICATION_SOUND = '/sounds/wakti reminder sound.mp3';
const DEFAULT_REMINDER_SOUND = '/sounds/wakti reminder sound.mp3';
const TASK_COMPLETION_SOUND = '/sounds/wakto task completed sound.mp3';

// Audio context for better control
let audioContext: AudioContext | null = null;

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
 * Play a notification sound with the provided options
 */
export const playNotificationSound = async (options: {
  soundUrl?: string;
  volume?: number;
} = {}): Promise<void> => {
  const { 
    soundUrl = DEFAULT_REMINDER_SOUND, 
    volume = 0.7
  } = options;
  
  try {
    // Try to use the Web Audio API for better control
    if (audioContext) {
      const response = await fetch(soundUrl);
      const arrayBuffer = await response.arrayBuffer();
      
      // Decode the audio data
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Create source node
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      
      // Create gain node for volume control
      const gainNode = audioContext.createGain();
      gainNode.gain.value = volume;
      
      // Connect nodes
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Play the sound
      source.start(0);
      return;
    }
    
    // Fallback to HTML5 Audio if Web Audio API isn't available
    const audio = new Audio(soundUrl);
    audio.volume = volume;
    
    // Play the sound
    await audio.play();
  } catch (error) {
    console.error("Failed to play notification sound:", error);
    
    // Special handling for browser autoplay policy
    if (error instanceof DOMException && error.name === "NotAllowedError") {
      console.warn("Audio playback was prevented due to browser autoplay policy. User interaction is required.");
    }
  }
};

/**
 * Play task completion sound
 */
export const playTaskCompletionSound = async (volume: number = 0.7): Promise<void> => {
  return playNotificationSound({
    soundUrl: TASK_COMPLETION_SOUND,
    volume
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
