import { useState, useRef } from 'react';

export function useMeetingSummaryV2() {
  const [state, setState] = useState({
    isRecording: false,
    recordingTime: 0,
    recordingError: null,
    meetingParts: [],
    transcribedText: '',
    isSummarizing: false,
    summary: '',
    detectedLocation: '',
    detectedAttendees: [],
    audioBlobs: [],
  });

  const summaryRef = useRef(null);

  const startRecording = () => {
    setState((prev) => ({ ...prev, isRecording: true }));
  };

  const stopRecording = () => {
    setState((prev) => ({ ...prev, isRecording: false }));
  };

  const startNextPart = () => {
    setState((prev) => ({
      ...prev,
      meetingParts: [
        ...prev.meetingParts,
        { partNumber: prev.meetingParts.length + 1, duration: prev.recordingTime },
      ],
      recordingTime: 0,
    }));
  };

  const generateSummary = () => {
    setState((prev) => ({
      ...prev,
      isSummarizing: true,
    }));

    // Dummy summary after delay
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        summary: 'This is an AI-generated summary.',
        isSummarizing: false,
      }));
    }, 2000);
  };

  const copySummary = () => {
    if (state.summary) {
      navigator.clipboard.writeText(state.summary);
    }
  };

  const downloadAudio = () => {
    // Dummy implementation
  };

  const setIntakeData = (data) => {
    // Placeholder: handle intake data
  };

  const resetSession = () => {
    setState({
      isRecording: false,
      recordingTime: 0,
      recordingError: null,
      meetingParts: [],
      transcribedText: '',
      isSummarizing: false,
      summary: '',
      detectedLocation: '',
      detectedAttendees: [],
      audioBlobs: [],
    });
  };

  const loadSavedMeetings = async () => {
    return [
      { id: '1', title: 'Meeting A' },
      { id: '2', title: 'Meeting B' },
    ];
  };

  const deleteMeeting = async (id) => {
    return true;
  };

  const isExporting = false;
  const isDownloadingAudio = false;

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
    summaryRef,
    isExporting,
    isDownloadingAudio,
    maxRecordingDuration: 3600, // ⏱ 1 hour limit
    warnBeforeEndSeconds: 30,   // ⏳ Warn when 30s left
  };
}
