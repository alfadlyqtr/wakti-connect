
import { LectureContextData } from "@/components/ai/tools/lecture-notes/LectureContextDialog";

export interface LectureNotesExportContext {
  course?: string;
  instructor?: string;
  institution?: string;
  date?: string;
  recordingDuration?: number;
}

export interface MeetingContext {
  location?: string;
  participants?: string[] | string;
  host?: string;
  title?: string;
  date?: string;
}

export interface MeetingContextData {
  location?: string;
  participants?: string[];
  host?: string;
}

// Format seconds into minutes:seconds
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Extract context information from transcribed text and user-provided context
export const extractLectureContext = (
  transcribedText: string,
  userContext: LectureContextData
): LectureNotesExportContext => {
  // Use user-provided context as a base
  const context: LectureNotesExportContext = {
    ...userContext,
  };

  // Attempt to detect course name from text if not provided
  if (!context.course) {
    // Simple detection of potential course names by looking for common patterns
    const coursePatterns = [
      /\b(welcome to|this is|course on|lecture on|introduction to|lesson on|today's lecture|our topic|we're covering)\s+([A-Z][a-zA-Z\s]{3,50})\b/i,
      /\b(today in|for|in)\s+([A-Z][a-zA-Z\s]{3,30})\s+(class|course|lecture)\b/i,
    ];

    for (const pattern of coursePatterns) {
      const match = transcribedText.match(pattern);
      if (match && match[2]) {
        context.course = match[2].trim();
        break;
      }
    }
  }

  return context;
};

// Extract meeting context from transcribed text and user-provided context
export const extractMeetingContext = (
  transcribedText: string,
  userContext: MeetingContextData
): MeetingContext => {
  // Use user-provided context as a base
  const context: MeetingContext = {
    ...userContext,
    date: new Date().toISOString(),
  };

  // Attempt to detect location from text if not provided
  if (!context.location) {
    // Simple detection of potential locations by looking for common patterns
    const locationPatterns = [
      /\b(meeting|discussion|call)\s+(at|in|from)\s+([A-Z][a-zA-Z\s\-\']{2,30})\b/i,
      /\b(location|venue|place):\s+([A-Z][a-zA-Z\s\-\']{2,30})\b/i,
      /\b(welcome to|joining from|meeting from)\s+([A-Z][a-zA-Z\s\-\']{2,30})\b/i,
    ];

    for (const pattern of locationPatterns) {
      const match = transcribedText.match(pattern);
      if (match && match[3] || match && match[2]) {
        context.location = (match[3] || match[2]).trim();
        break;
      }
    }
  }

  return context;
};

// Create title from detected course or date
export const createLectureTitle = (
  detectedCourse: string | null,
  date = new Date()
): string => {
  if (detectedCourse) {
    return `${detectedCourse} Lecture`;
  }
  
  // Format date as a fallback title
  return `Lecture Notes - ${date.toLocaleDateString()}`;
};

// Check if text contains Arabic characters
export const containsArabic = (text: string): boolean => {
  const arabicPattern = /[\u0600-\u06FF]/;
  return arabicPattern.test(text);
};

// Get text direction based on content (for RTL languages like Arabic)
export const getTextDirection = (text: string): 'rtl' | 'ltr' => {
  return containsArabic(text) ? 'rtl' : 'ltr';
};
