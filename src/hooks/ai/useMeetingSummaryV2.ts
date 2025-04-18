
import { useState, useRef, useCallback } from 'react';
import { toast } from "sonner";
import { MeetingSummaryState, IntakeData } from './meeting-summary/types';
import { useRecordingHandlers } from './meeting-summary/useRecordingHandlers';
import { useSummaryHandlers } from './meeting-summary/useSummaryHandlers';
import { useMeetingsHandlers } from './meeting-summary/useMeetingsHandlers';

export function useMeetingSummaryV2() {
  const [state, setState] = useState<MeetingSummaryState>({
    isRecording: false,
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
    meetingLocation: undefined
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
      meetingLocation: undefined
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

  const setIntakeData = useCallback((data: IntakeData) => {
    setState(prev => ({
      ...prev,
      meetingTitle: data.title,
      meetingDate: data.date,
      meetingLocation: data.location
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
    setIntakeData,
    resetSession,
    loadSavedMeetings,
    deleteMeeting,
    maxRecordingDuration,
    warnBeforeEndSeconds,
    summaryRef,
    isExporting,
    isDownloadingAudio
  };
}
