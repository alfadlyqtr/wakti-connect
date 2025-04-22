export interface IntakeData {
  title?: string;
  date?: string;
  location?: string;
  language?: 'english' | 'arabic' | 'mixed';
}

export interface MeetingSummaryState {
  isRecording: boolean;
  isProcessing: boolean;
  recordingTime: number;
  transcribedText: string;
  isSummarizing: boolean;
  summary: null | string;
  recordingError: string | null;
  detectedLocation: string | null;
  detectedAttendees: string[] | null;
  meetingParts: {
    partNumber: number;
    duration: number;
    audioBlob: Blob;
  }[];
  audioBlobs: Blob[] | null;
  meetingTitle: string | undefined;
  meetingDate: string | undefined;
  meetingLocation: string | undefined;
  language?: 'english' | 'arabic' | 'mixed';
}
