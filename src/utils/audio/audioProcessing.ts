
/**
 * Formats seconds into minutes:seconds format
 */
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Calculates audio levels from an audio buffer
 */
export const calculateAudioLevel = (audioBuffer: Float32Array): number => {
  let sum = 0;
  
  // Calculate the sum of absolute values
  for (let i = 0; i < audioBuffer.length; i++) {
    sum += Math.abs(audioBuffer[i]);
  }
  
  // Calculate the average amplitude
  const average = sum / audioBuffer.length;
  
  // Convert to a 0-100 scale
  return Math.min(100, Math.floor(average * 100 * 5));
};
