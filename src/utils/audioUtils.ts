
const TASK_COMPLETION_SOUND = '/sounds/wakto task completed sound.mp3';

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
