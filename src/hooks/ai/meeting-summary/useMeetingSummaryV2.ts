import { useState, useRef, useCallback } from 'react';
import { toast } from "sonner";
import { MeetingSummaryState, IntakeData } from './types';
import { useRecordingHandlers } from './useRecordingHandlers';
import { useSummaryHandlers } from './useSummaryHandlers';
import { useMeetingsHandlers } from './useMeetingsHandlers';
import { exportMeetingSummaryAsPDF } from '@/components/ai/tools/meeting-summary/MeetingSummaryExporter';

export function useMeetingSummaryV2() {
  const [state, setState] = useState<MeetingSummaryState>({
    isRecording: false,
    isProcessing: false,
    recordingTime: 0,
    transcribedText: '',
    isSummarizing: false,
    summary: null,
    recordingError: null,
    detectedLocation: null,
    detectedAttendees: null,
    meetingParts: [],
    audioBlobs: null,
    meetingTitle: undefined,
    meetingDate: undefined,
    meetingLocation: undefined,
    language: 'mixed'
  });

  const summaryRef = useRef<HTMLDivElement | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isDownloadingAudio, setIsDownloadingAudio] = useState(false);

  const {
    startRecording,
    stopRecording,
    cleanup,
    mediaRecorderRef,
    streamRef,
    timerRef
  } = useRecordingHandlers(setState, state);

  const { generateSummary } = useSummaryHandlers(state, setState);
  const { loadSavedMeetings, deleteMeeting } = useMeetingsHandlers();

  const startNextPart = useCallback(() => {
    setState(prev => ({ ...prev, recordingTime: 0 }));
    startRecording();
  }, [startRecording]);

  const resetSession = useCallback(() => {
    cleanup();
    setState({
      isRecording: false,
      isProcessing: false,
      recordingTime: 0,
      transcribedText: '',
      isSummarizing: false,
      summary: null,
      recordingError: null,
      detectedLocation: null,
      detectedAttendees: null,
      meetingParts: [],
      audioBlobs: null,
      meetingTitle: undefined,
      meetingDate: undefined,
      meetingLocation: undefined,
      language: 'mixed'
    });
  }, [cleanup]);

  const copySummary = useCallback(async () => {
    if (!state.summary) return;
    
    try {
      await navigator.clipboard.writeText(state.summary);
      toast("Summary copied to clipboard");
    } catch (error) {
      console.error("Error copying text:", error);
      toast("Failed to copy. Please try again.");
    }
  }, [state.summary]);

  const downloadAudio = useCallback(async () => {
    if (!state.audioBlobs) return;
    
    setIsDownloadingAudio(true);
    
    try {
      const combinedBlob = new Blob(state.audioBlobs, { type: 'audio/webm' });
      
      const url = URL.createObjectURL(combinedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${state.meetingTitle || 'meeting'}_recording.webm`;
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      
      toast("Audio downloaded successfully");
      
    } catch (error) {
      console.error("Error downloading audio:", error);
      toast("Failed to download audio. Please try again.");
    } finally {
      setIsDownloadingAudio(false);
    }
  }, [state.audioBlobs, state.meetingTitle]);

  const exportAsPDF = useCallback(async () => {
    if (!state.summary) return;
    
    setIsExporting(true);
    
    try {
      // Calculate total duration
      const totalDuration = state.meetingParts.reduce((sum, part) => 
        sum + part.duration, 0);
      
      await exportMeetingSummaryAsPDF(
        state.summary,
        totalDuration,
        state.detectedLocation,
        state.detectedAttendees,
        {
          title: state.meetingTitle || 'Meeting Summary',
          companyLogo: '/lovable-uploads/9b7d0693-89eb-4cc5-b90b-7834bfabda0e.png'
        }
      );
      
      toast.success("PDF exported successfully");
      
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }, [state.summary, state.meetingParts, state.detectedLocation, state.detectedAttendees, state.meetingTitle]);

  const setIntakeData = useCallback((data: IntakeData) => {
    setState(prev => ({
      ...prev,
      meetingTitle: data.title,
      meetingDate: data.date,
      meetingLocation: data.location,
      language: data.language || 'mixed'
    }));
  }, []);

  const maxRecordingDuration = 3600; // 1 hour limit
  const warnBeforeEndSeconds = 30;   // Warn when 30s left

  return {
    state,
    startRecording,
    stopRecording,
    startNextPart,
    generateSummary,
    copySummary,
    downloadAudio,
    exportAsPDF,
    setIntakeData,
    resetSession,
    loadSavedMeetings,
    deleteMeeting,
    maxRecordingDuration,
    warnBeforeEndSeconds,
    summaryRef,
    isExporting,
    isDownloadingAudio,
    language: state.language
  };
}
