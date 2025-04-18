
import React from 'react';
import { useMeetingSummary } from '@/hooks/ai/useMeetingSummary';
import { RecordingControls } from './meeting-summary/RecordingControls';
import { SummaryDisplay } from './meeting-summary/SummaryDisplay';
import { SavedMeetingsList } from './meeting-summary/SavedMeetingsList';
import { TranscriptionPanel } from './meeting-summary/TranscriptionPanel';

export const MeetingSummaryTool: React.FC = () => {
  const {
    state,
    startRecording,
    stopRecording,
    resetRecording,
    savedMeetings,
    downloadAudio,
    downloadMeetingSummary
  } = useMeetingSummary();

  return (
    <div className="space-y-4">
      <RecordingControls 
        isRecording={state.isRecording}
        recordingTime={state.recordingTime}
        startRecording={startRecording}
        stopRecording={stopRecording}
        resetRecording={resetRecording}
      />

      {state.summary && (
        <SummaryDisplay 
          summary={state.summary}
          onDownload={downloadMeetingSummary}
        />
      )}

      <TranscriptionPanel 
        transcription={state.transcription}
      />

      <SavedMeetingsList 
        savedMeetings={savedMeetings} 
        isLoadingHistory={false}
        onDownload={() => downloadAudio(savedMeetings[0])}  // Wrap downloadAudio in a no-argument function
      />
    </div>
  );
};
