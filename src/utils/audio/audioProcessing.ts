
/**
 * Format seconds into a readable time format (HH:MM:SS or MM:SS)
 * @param seconds Total seconds to format
 * @param showHours Whether to always show hours even if zero
 * @returns Formatted time string
 */
export const formatTime = (seconds: number, showHours: boolean = false): string => {
  if (isNaN(seconds) || seconds < 0) {
    return '00:00';
  }
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0 || showHours) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Estimates the file size of audio based on duration and bitrate
 * @param durationSeconds Audio duration in seconds
 * @param bitrate Bitrate in kbps (default: 128)
 * @returns Estimated file size in MB
 */
export const estimateAudioFileSize = (durationSeconds: number, bitrate: number = 128): number => {
  // Size in bytes = duration (seconds) * bitrate (kbps) * 1000 / 8
  const sizeInBytes = (durationSeconds * bitrate * 1000) / 8;
  // Convert to MB
  return sizeInBytes / (1024 * 1024);
};

/**
 * Creates a audio blob URL from a base64 string
 * @param base64Audio Base64 encoded audio data
 * @param mimeType MIME type of the audio (default: 'audio/webm')
 * @returns Blob URL that can be used with audio elements
 */
export const createAudioBlobUrl = (base64Audio: string, mimeType: string = 'audio/webm'): string => {
  try {
    // Convert base64 to binary
    const binaryString = atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Create blob and URL
    const blob = new Blob([bytes], { type: mimeType });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error creating audio blob URL:', error);
    return '';
  }
};
