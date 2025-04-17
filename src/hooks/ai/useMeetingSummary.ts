import { useRef, useCallback, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { extractMeetingContext } from '@/utils/text/transcriptionUtils';
import { exportMeetingSummaryAsPDF } from '@/components/ai/tools/meeting-summary/MeetingSummaryExporter';
import { 
  useMeetingRecording, 
  useMeetingSummaryGeneration, 
  useMeetingStorage, 
  useMeetingExport 
} from './meeting';

export interface MeetingSummaryState {
  isRecording: boolean;
  recordingTime: number;
  recordingError: string | null;
  transcribedText: string;
  isSummarizing: boolean;
  summary: string;
  detectedLocation: string | null;
  audioData: Blob | null;
}

export interface SavedMeeting {
  id: string;
  date: string;
  summary: string;
  duration: number;
  title: string;
  location?: string;
}

export const useMeetingSummary = () => {
  // Initialize all the sub-hooks
  const {
    recordingState,
    selectedLanguage,
    setSelectedLanguage,
    supportsVoice,
    startRecording: startRecordingBase,
    stopRecording,
    clearRecording
  } = useMeetingRecording();

  const {
    summaryState,
    generateSummary: generateSummaryBase,
    clearSummary
  } = useMeetingSummaryGeneration();

  const {
    savedMeetings,
    isLoadingHistory,
    saveMeetingToSupabase: saveMeetingBase,
    loadSavedMeetings,
    deleteMeeting,
    updateMeetingTitle
  } = useMeetingStorage();

  const {
    isExporting,
    setIsExporting,
    isDownloadingAudio,
    copied,
    copySummary,
    downloadAudio: downloadAudioBase
  } = useMeetingExport();

  // References
  const summaryRef = useRef<HTMLDivElement>(null);

  // Compute the combined state
  const state: MeetingSummaryState = {
    isRecording: recordingState.isRecording,
    recordingTime: recordingState.recordingTime,
    recordingError: recordingState.recordingError,
    transcribedText: recordingState.transcribedText,
    isSummarizing: summaryState.isSummarizing,
    summary: summaryState.summary,
    detectedLocation: summaryState.detectedLocation,
    audioData: recordingState.audioData
  };

  // Wrapped functions with enhanced functionality
  const generateSummary = useCallback(async () => {
    return await generateSummaryBase(recordingState.transcribedText, selectedLanguage);
  }, [generateSummaryBase, recordingState.transcribedText, selectedLanguage]);

  const saveMeetingToSupabase = useCallback(async (title?: string) => {
    return await saveMeetingBase(
      summaryState.summary,
      recordingState.transcribedText,
      recordingState.recordingTime,
      selectedLanguage,
      recordingState.audioData,
      title
    );
  }, [
    saveMeetingBase, 
    summaryState.summary, 
    recordingState.transcribedText, 
    recordingState.recordingTime, 
    recordingState.audioData, 
    selectedLanguage
  ]);

  // Enhanced downloadAudio function that handles different input types and checks storage status
  const downloadAudio = useCallback(async (meetingIdOrBlob?: string | Blob) => {
    try {
      // If input is a string, it's a meeting ID for a saved recording
      if (typeof meetingIdOrBlob === 'string') {
        console.log('Downloading saved meeting audio:', meetingIdOrBlob);
        await downloadAudioBase(null, meetingIdOrBlob);
      } 
      // If it's a Blob object, use it directly
      else if (meetingIdOrBlob instanceof Blob) {
        console.log('Downloading provided audio blob');
        await downloadAudioBase(meetingIdOrBlob);
      } 
      // Otherwise use the recording state's audio data
      else {
        console.log('Downloading current recording audio');
        await downloadAudioBase(recordingState.audioData);
      }
    } catch (error) {
      console.error('Download audio error in useMeetingSummary:', error);
      toast({
        title: "Download failed",
        description: error instanceof Error 
          ? error.message 
          : "Could not download audio recording. Try again later.",
        variant: "destructive"
      });
    }
  }, [downloadAudioBase, recordingState.audioData, toast]);

  // Enhanced export function
  const handleExportAsPDF = useCallback(async () => {
    setIsExporting(true);
    try {
      // Extract context from transcript
      const exportContext = state.detectedLocation 
        ? { location: state.detectedLocation } 
        : null;
          
      await exportMeetingSummaryAsPDF(
        state.summary,
        state.recordingTime,
        exportContext
      );
    } finally {
      setIsExporting(false);
    }
  }, [state.summary, state.recordingTime, state.detectedLocation, setIsExporting]);

  // Load saved meetings on first render
  useEffect(() => {
    loadSavedMeetings();
  }, [loadSavedMeetings]);

  return {
    state,
    isExporting,
    setIsExporting,
    isDownloadingAudio,
    selectedLanguage,
    setSelectedLanguage,
    copied,
    summaryRef,
    savedMeetings,
    isLoadingHistory,
    loadSavedMeetings,
    startRecording: startRecordingBase,
    stopRecording,
    generateSummary,
    saveMeetingToSupabase,
    deleteMeeting,
    updateMeetingTitle,
    downloadAudio,
    copySummary,
    supportsVoice,
    exportAsPDF: handleExportAsPDF
  };
};
