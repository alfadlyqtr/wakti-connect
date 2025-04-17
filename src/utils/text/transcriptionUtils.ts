/**
 * Utilities for handling meeting transcription data
 */

export interface MeetingContext {
  title?: string;
  location?: string;
  host?: string;
  participants?: string[];
}

export interface LectureContext {
  course?: string;
  lecturer?: string;
  university?: string;
  date?: string;
}

/**
 * Formats duration in seconds to a readable string
 * @param seconds - Duration in seconds
 * @returns Formatted string like "1h 30m 45s" or "5m 30s"
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

/**
 * Extracts meeting context from transcript text and combines with user-provided context
 * @param transcriptText - The transcript text to analyze
 * @param userContext - Optional user-provided context
 * @returns Combined meeting context object
 */
export const extractMeetingContext = (
  transcriptText: string,
  userContext: Record<string, any> = {}
): MeetingContext => {
  const context: MeetingContext = {
    ...userContext
  };

  // Only extract information not already provided by user
  if (!context.title) {
    // Try to extract a meeting title from the transcript
    const titlePatterns = [
      /(?:welcome to|today's|meeting about|discussing|our meeting on|call about|session on|webinar on|agenda for|topic is|meeting for) ([\w\s\-']+?)(?:\.|,|\n|$)/i,
      /(?:this is the|let's begin the|starting the|beginning) ([\w\s\-']+?) (?:meeting|call|discussion|session)/i
    ];
    
    for (const pattern of titlePatterns) {
      const match = transcriptText.match(pattern);
      if (match && match[1] && match[1].length > 3 && match[1].length < 50) {
        context.title = match[1].trim();
        break;
      }
    }
  }
  
  if (!context.location) {
    // Try to extract location
    const locationPatterns = [
      /(?:location is|located in|meeting in|from|at the|in the) ([\w\s\-']+?)(?:\.|,|\n|$)/i,
      /(?:joining from|connecting from|based in) ([\w\s\-']+?)(?:\.|,|\n|$)/i
    ];
    
    for (const pattern of locationPatterns) {
      const match = transcriptText.match(pattern);
      if (match && match[1] && match[1].length > 2 && match[1].length < 30) {
        context.location = match[1].trim();
        break;
      }
    }
  }
  
  // Return the merged context
  return context;
};

/**
 * Extracts lecture context from transcript text and combines with user-provided context
 * @param transcript - The transcript text to analyze
 * @param providedContext - Optional user-provided context
 * @returns Combined lecture context object
 */
export const extractLectureContext = (
  transcript: string,
  providedContext: {
    course?: string;
    lecturer?: string;
    university?: string;
    date?: string;
  }
): LectureContext => {
  const context: LectureContext = {};
  
  // Use provided context
  if (providedContext.course) context.course = providedContext.course;
  if (providedContext.lecturer) context.lecturer = providedContext.lecturer;
  if (providedContext.university) context.university = providedContext.university;
  if (providedContext.date) context.date = providedContext.date;
  
  // Try to extract course/subject from transcript if not provided
  if (!context.course) {
    // Look for common course identifiers in the transcript
    const courseMatches = transcript.match(/\b(course|class|subject):?\s([A-Z][A-Za-z\s]{2,40})/i) ||
                           transcript.match(/\bin\s(this|the|our|today'?s)\s([A-Z][A-Za-z\s]{2,40})\s(class|course|lecture)/i) ||
                           transcript.match(/\bwelcome\sto\s([A-Z][A-Za-z\s]{2,40})\b/i);
    
    if (courseMatches && courseMatches[2]) {
      context.course = courseMatches[2].trim();
    }
  }
  
  // Try to extract lecturer if not provided
  if (!context.lecturer) {
    // Look for common patterns to identify the lecturer
    const lecturerMatches = transcript.match(/\b(professor|prof\.?|dr\.?|instructor|lecturer)\s([A-Z][A-Za-z\s\.-]{2,30})/i) ||
                            transcript.match(/\bmy name is\s([A-Z][A-Za-z\s\.-]{2,30})/i);
    
    if (lecturerMatches && lecturerMatches[2]) {
      context.lecturer = lecturerMatches[2].trim();
    }
  }
  
  return context;
};

/**
 * Detect if a text contains Arabic language
 * @param text - The text to analyze
 * @returns True if Arabic characters are detected
 */
export const containsArabic = (text: string): boolean => {
  // Unicode range for Arabic characters
  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicPattern.test(text);
};

/**
 * Get the direction for text based on language content
 * @param text - The text to analyze
 * @returns 'rtl' for Arabic-dominant text, 'ltr' otherwise
 */
export const getTextDirection = (text: string): 'rtl' | 'ltr' => {
  if (!text) return 'ltr';
  
  // Count Arabic vs Latin characters
  let arabicCount = 0;
  let latinCount = 0;
  
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    if (charCode >= 0x0600 && charCode <= 0x06FF) {
      arabicCount++;
    } else if ((charCode >= 0x0041 && charCode <= 0x005A) || 
               (charCode >= 0x0061 && charCode <= 0x007A)) {
      latinCount++;
    }
  }
  
  // Return direction based on which script is more prevalent
  return arabicCount > latinCount ? 'rtl' : 'ltr';
};
