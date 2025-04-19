
/**
 * Formats seconds into a human-readable time string (HH:MM:SS)
 * @param seconds Number of seconds
 * @returns Formatted time string
 */
export const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Calculates the total duration from an array of recording parts
 * @param parts Array of recording parts with duration property
 * @returns Total duration in seconds
 */
export const calculateTotalDuration = (parts: { duration: number }[]): number => {
  return parts.reduce((total, part) => total + part.duration, 0);
};
