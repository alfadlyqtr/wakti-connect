
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
    console.log('Starting recording...');
    setState((prev) => ({ ...prev, isRecording: true }));
  };

  const stopRecording = () => {
    console.log('Stopping recording...');
    setState((prev) => ({ ...prev, isRecording: false }));
    // Simulate transcription for testing
    setState((prev) => ({ 
      ...prev, 
      transcribedText: 'This is a test transcription. The meeting was about testing functionality.'
    }));
  };

  const startNextPart = () => {
    console.log('Starting next part...');
    setState((prev) => ({
      ...prev,
      meetingParts: [
        ...prev.meetingParts,
        { partNumber: prev.meetingParts.length + 1, duration: prev.recordingTime },
      ],
      recordingTime: 0,
    }));
  };

  // Update the generateSummary function to return a Promise
  const generateSummary = async (): Promise<void> => {
    console.log('Generating summary...');
    setState((prev) => ({
      ...prev,
      isSummarizing: true,
    }));

    // Dummy summary after delay
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log('Summary generated!');
        setState((prev) => ({
          ...prev,
          summary: `## Meeting Summary
          
### Key Points:
- Test meeting conducted
- Functionality verification performed
- System working as expected

### Action Items:
- Review test results
- Document findings
- Plan next steps`,
          isSummarizing: false,
        }));
        resolve();
      }, 2000);
    });
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
    console.log('Switching to summary view...');
    setActiveTab("summary");
    return Promise.resolve();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Meeting Summary Tool</h2>
        <div className="space-x-2">
          {!state.isRecording ? (
            <button 
              onClick={startRecording}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Start Recording
            </button>
          ) : (
            <button 
              onClick={stopRecording}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Stop Recording
            </button>
          )}
        </div>
      </div>

      {activeTab === 'transcription' && (
        <TranscriptionPanel
          transcribedText={state.transcribedText}
          isSummarizing={state.isSummarizing}
          generateSummary={generateSummary}
          onViewSummary={handleViewSummary}
        />
      )}
      
      {activeTab === 'summary' && state.summary && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Summary</h2>
          <div 
            className="prose"
            dangerouslySetInnerHTML={{ 
              __html: state.summary.replace(/\n/g, '<br />') 
            }} 
          />
        </div>
      )}
    </div>
  );
};

