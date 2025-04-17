
import { LectureContextData } from "@/components/ai/tools/lecture-notes/LectureContextDialog";

export interface LectureNotesExportContext {
  course?: string;
  instructor?: string;
  institution?: string;
  date?: string;
  recordingDuration?: number;
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
