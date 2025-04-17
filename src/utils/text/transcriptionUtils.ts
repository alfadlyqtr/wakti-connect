
/**
 * Utility functions for processing transcription text
 */

/**
 * Detects potential location information in transcription text
 * @param text The transcription text to analyze
 * @returns The detected location or null if none found
 */
export const detectLocationFromText = (text: string): string | null => {
  try {
    // Multiple location detection patterns
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
  } catch (err) {
    console.error("Error detecting location:", err);
    return null;
  }
};

/**
 * Formats seconds into a readable duration string
 * @param seconds Total seconds
 * @returns Formatted duration string (e.g. "1h 30m")
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
};
