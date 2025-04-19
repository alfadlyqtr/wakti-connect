
export interface MeetingPart {
  partNumber: number;
  duration: number;
  audioBlob: Blob;
}

export interface MeetingSummaryState {
  isRecording: boolean;
  isProcessing: boolean;
  recordingTime: number;
  transcribedText: string;
  isSummarizing: boolean;
  summary: string | null;
  recordingError: string | null;
  detectedLocation: string | null;
  detectedAttendees: string[] | null;
  meetingParts: MeetingPart[];
  audioBlobs: Blob[] | null;
  meetingTitle?: string;
  meetingDate?: string;
  meetingLocation?: string;
}

export interface IntakeData {
  title?: string;
  date?: string;
  location?: string;
}
