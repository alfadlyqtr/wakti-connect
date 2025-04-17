
/**
 * Utility functions for transcription processing
 */

/**
 * Formats a duration in seconds to a human-readable string
 * @param seconds Number of seconds
 * @returns Formatted duration string
 */
export const formatDuration = (seconds: number): string => {
  if (!seconds) return '0s';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  let result = '';
  
  if (hours > 0) {
    result += `${hours}h `;
  }
  
  if (minutes > 0 || hours > 0) {
    result += `${minutes}m `;
  }
  
  result += `${remainingSeconds}s`;
  
  return result;
};

/**
 * Detects a potential location mentioned in the transcript text
 * @param text The transcript text to analyze
 * @returns A detected location or null if none found
 */
export const detectLocationFromText = (text: string): string | null => {
  if (!text) return null;
  
  // Common location patterns in meeting transcripts
  const locationPatterns = [
    // Meeting locations
    /(?:meeting|conference|located|held|happening|taking place|will be|scheduled)\s+(?:at|in)\s+(?:the\s+)?([A-Za-z0-9\s,]+(?:Building|Office|Center|Room|Hall|Tower|Plaza|Street|Avenue|Road|Boulevard|Place|Square|Park|Campus|Floor|Suite|Theater|Arena|Stadium|Hotel|Conference|Center|Venue))/i,
    // Room numbers or specific locations
    /(?:room|location|place|venue)\s+(?:is|will be|at)\s+(?:the\s+)?([A-Za-z0-9\s\-]+)/i,
    // Address patterns
    /(?:address is|located at|taking place at)\s+([0-9]+\s+[A-Za-z\s]+(?:Street|Avenue|Road|Boulevard|Lane|Drive|Place|Court))/i
  ];
  
  // Try each pattern
  for (const pattern of locationPatterns) {
    const matches = text.match(pattern);
    if (matches && matches[1]) {
      return matches[1].trim();
    }
  }
  
  return null;
};
