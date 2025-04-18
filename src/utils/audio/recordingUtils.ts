
/**
 * Formats recording duration from seconds to MM:SS format
 */
export const formatRecordingDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Calculates the recording progress percentage
 */
export const calculateRecordingProgress = (currentSeconds: number, maxSeconds: number): number => {
  return Math.min(100, (currentSeconds / maxSeconds) * 100);
};
