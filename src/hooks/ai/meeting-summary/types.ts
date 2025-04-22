
export interface MeetingPart {
  partNumber: number;
  duration: number;
  audioBlob: Blob;
  isRTL?: boolean;
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
  language: string;
  isRTL?: boolean;
}

export interface IntakeData {
  title?: string;
  date?: string;
  location?: string;
  language?: string;
}

export interface MeetingSummaryPDFOptions {
  title: string;
  companyLogo: string;
  isRTL?: boolean;  // Optional property for RTL support
}
