
/**
 * Format recording duration in seconds to MM:SS format
 */
export const formatRecordingDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  
  return `${formattedMinutes}:${formattedSeconds}`;
};

/**
 * Calculate recording progress percentage
 */
export const calculateRecordingProgress = (
  currentDuration: number,
  maxDuration: number
): number => {
  return (currentDuration / maxDuration) * 100;
};

/**
 * Generate a timestamp string in HH:MM format for the current time
 */
export const getCurrentTimestamp = (): string => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  
  return `${hours}:${minutes}`;
};

/**
 * Format file size in bytes to human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
