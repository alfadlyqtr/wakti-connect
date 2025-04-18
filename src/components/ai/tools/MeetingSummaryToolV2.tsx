
import React, { useState, useRef } from 'react';
import TranscriptionPanel from './meeting-summary/TranscriptionPanel';

export const MeetingSummaryToolV2 = () => {
  const [activeTab, setActiveTab] = useState('transcription');
  
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
  const maxRecordingDuration = 3600; // ⏱ 1 hour limit
  const warnBeforeEndSeconds = 30;   // ⏳ Warn when 30s left

  // Fix: Explicitly define return type and make sure it returns a Promise
  const handleViewSummary = async (): Promise<void> => {
    setActiveTab("summary");
    return Promise.resolve();
  };

  return (
    <div>
      {activeTab === 'transcription' && (
        <TranscriptionPanel
          transcribedText={state.transcribedText}
          isSummarizing={state.isSummarizing}
          generateSummary={generateSummary}
          onViewSummary={handleViewSummary}
        />
      )}
      {activeTab === 'summary' && (
        <div>
          <h2>Summary</h2>
          <p>{state.summary}</p>
        </div>
      )}
    </div>
  );
};
