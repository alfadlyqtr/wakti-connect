
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

/**
 * Detects potential participants mentioned in the transcript text
 * @param text The transcript text to analyze
 * @returns Array of detected participant names or empty array if none found
 */
export const detectParticipantsFromText = (text: string): string[] => {
  if (!text) return [];
  
  const participants: Set<string> = new Set();
  
  // Common patterns for participant lists
  const participantPatterns = [
    // "In attendance" or "attending" patterns
    /(?:in attendance|attending|present|participants include|with us today|joining us|in the meeting)[:\s]+([A-Za-z\s,\.and]+)(?:\.|\n|$)/i,
    // "We have" patterns for introductions
    /(?:we have|joined by)[:\s]+([A-Za-z\s,\.and]+)(?:\.|\n|$)/i,
    // Attendance or roll call patterns
    /(?:attendance|roll call)[:\s]+([A-Za-z\s,\.and]+)(?:\.|\n|$)/i
  ];
  
  // Try to find participant lists
  for (const pattern of participantPatterns) {
    const matches = text.match(pattern);
    if (matches && matches[1]) {
      // Split the list by commas, 'and', or other separators
      const names = matches[1]
        .replace(/\band\b/gi, ',')
        .split(/,|\.|;/)
        .map(name => name.trim())
        .filter(name => name.length > 0 && name.length < 30); // Filter out empty or too long strings
      
      names.forEach(name => participants.add(name));
    }
  }
  
  return Array.from(participants);
};

/**
 * Detects potential host or meeting leader from the transcript text
 * @param text The transcript text to analyze
 * @returns Detected host name or null if none found
 */
export const detectHostFromText = (text: string): string | null => {
  if (!text) return null;
  
  // Common patterns for meeting hosts
  const hostPatterns = [
    /(?:meeting is|meeting will be|call is|session is|webinar is) (?:led by|hosted by|facilitated by|chaired by|moderated by) ([A-Za-z\s\.]+)(?:\.|\n|,|$)/i,
    /(?:our host|the host|meeting host|call host|facilitator|chairperson|moderator) (?:is|will be) ([A-Za-z\s\.]+)(?:\.|\n|,|$)/i,
    /([A-Za-z\s\.]+) (?:is hosting|will host|is facilitating|is leading|is moderating) (?:this|the|our|today's) (?:meeting|call|session|discussion)/i,
    /([A-Za-z\s\.]+) (?:welcomes everyone|welcomed everyone) to (?:the|this|our|today's) (?:meeting|call|session|discussion)/i
  ];
  
  // Try to find host
  for (const pattern of hostPatterns) {
    const matches = text.match(pattern);
    if (matches && matches[1]) {
      return matches[1].trim();
    }
  }
  
  return null;
};

/**
 * MeetingContext interface representing structured data about a meeting
 */
export interface MeetingContext {
  location?: string;
  participants?: string[];
  host?: string;
}

/**
 * Extract all possible meeting context information from a transcript
 * @param text The transcript text to analyze
 * @param providedContext Optional context data provided by the user
 * @returns Structured meeting context information
 */
export const extractMeetingContext = (
  text: string, 
  providedContext?: { location?: string; participants?: string; host?: string }
): MeetingContext => {
  // Start with user-provided context if available
  const context: MeetingContext = {};
  
  // Add location (prefer user provided, fall back to detected)
  if (providedContext?.location) {
    context.location = providedContext.location;
  } else {
    const detectedLocation = detectLocationFromText(text);
    if (detectedLocation) {
      context.location = detectedLocation;
    }
  }
  
  // Add participants (prefer user provided, fall back to detected)
  if (providedContext?.participants) {
    context.participants = providedContext.participants
      .split(',')
      .map(p => p.trim())
      .filter(p => p.length > 0);
  } else {
    const detectedParticipants = detectParticipantsFromText(text);
    if (detectedParticipants.length > 0) {
      context.participants = detectedParticipants;
    }
  }
  
  // Add host (prefer user provided, fall back to detected)
  if (providedContext?.host) {
    context.host = providedContext.host;
  } else {
    const detectedHost = detectHostFromText(text);
    if (detectedHost) {
      context.host = detectedHost;
    }
  }
  
  return context;
};
