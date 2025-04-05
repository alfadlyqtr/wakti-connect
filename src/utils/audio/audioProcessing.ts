
/**
 * Utility functions for audio processing in the meeting summary tool
 */

/**
 * Stops all tracks in a media stream
 * @param stream Media stream to stop
 */
export const stopMediaTracks = (stream: MediaStream) => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
};

/**
 * Formats time in seconds to minutes:seconds format
 * @param seconds Total seconds
 * @returns Formatted time string (e.g. "2:45")
 */
export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};
