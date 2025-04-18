
import React, { useState, useRef } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MeetingIntakeForm } from './meeting-summary/MeetingIntakeForm';
import TranscriptionPanel from './meeting-summary/TranscriptionPanel';
import RecordingControlsV2 from './meeting-summary/RecordingControlsV2';

export const MeetingSummaryToolV2 = () => {
  const [activeTab, setActiveTab] = useState('intake');
  
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

  // Handle view summary function
  const handleViewSummary = async (): Promise<void> => {
    console.log('Switching to summary view...');
    setActiveTab("summary");
    return Promise.resolve();
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Meeting Summary Tool</h2>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="intake">Meeting Details</TabsTrigger>
          <TabsTrigger value="transcription">Recording</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="intake" className="mt-4">
          <MeetingIntakeForm onSubmit={setIntakeData} onSkip={() => setActiveTab('transcription')} />
        </TabsContent>

        <TabsContent value="transcription" className="mt-4 space-y-6">
          <RecordingControlsV2
            isRecording={state.isRecording}
            recordingTime={state.recordingTime}
            selectedLanguage="en"
            autoSilenceDetection={false}
            visualFeedback={true}
            silenceThreshold={-45}
            startRecording={startRecording}
            stopRecording={stopRecording}
            startNextPart={startNextPart}
            setSelectedLanguage={() => {}}
            toggleAutoSilenceDetection={() => {}}
            toggleVisualFeedback={() => {}}
            setSilenceThreshold={() => {}}
            recordingError={state.recordingError}
            maxRecordingDuration={maxRecordingDuration}
            warnBeforeEndSeconds={warnBeforeEndSeconds}
          />

          {state.transcribedText && (
            <TranscriptionPanel
              transcribedText={state.transcribedText}
              isSummarizing={state.isSummarizing}
              generateSummary={generateSummary}
              onViewSummary={handleViewSummary}
            />
          )}
        </TabsContent>

        <TabsContent value="summary" className="mt-4">
          {state.summary && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Meeting Summary</h2>
              <div 
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: state.summary.replace(/\n/g, '<br />') 
                }} 
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
