
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { useMeetingSummary } from '@/hooks/ai/useMeetingSummary';
import { extractMeetingContext } from '@/utils/text/transcriptionUtils';

// Import the refactored components
import RecordingControls from './meeting-summary/RecordingControls';
import TranscriptionPanel from './meeting-summary/TranscriptionPanel';
import SummaryDisplay from './meeting-summary/SummaryDisplay';
import SavedMeetingsList from './meeting-summary/SavedMeetingsList';
import { MeetingContextDialog, MeetingContextData } from './meeting-summary/MeetingContextDialog';

interface MeetingSummaryToolProps {
  onUseSummary?: (summary: string) => void;
}

export const MeetingSummaryTool: React.FC<MeetingSummaryToolProps> = ({ onUseSummary }) => {
  const {
    state,
    isDownloadingAudio,
    savedMeetings,
    isLoadingHistory,
    isExporting,
    selectedLanguage,
    setSelectedLanguage,
    copied,
    summaryRef,
    loadSavedMeetings,
    startRecording,
    stopRecording,
    generateSummary,
    copySummary,
    downloadAudio,
    deleteMeeting,
    updateMeetingTitle,
    supportsVoice,
    exportAsPDF
  } = useMeetingSummary();

  // State for meeting context dialog
  const [showContextDialog, setShowContextDialog] = useState(false);
  const [meetingContext, setMeetingContext] = useState<MeetingContextData | null>(null);
  
  // Load saved meetings on component mount
  useEffect(() => {
    loadSavedMeetings();
  }, [loadSavedMeetings]);

  // Start recording with context gathering flow
  const handleStartRecording = () => {
    // Show context dialog before starting recording
    setShowContextDialog(true);
  };

  // Handler for context dialog close
  const handleContextDialogClose = (data?: MeetingContextData) => {
    setShowContextDialog(false);
    
    if (data) {
      // Save the context data if provided
      setMeetingContext(data);
    }
    
    // Start recording after dialog is closed
    startRecording();
  };

  // Enhanced summary generation with context
  const handleGenerateSummary = async () => {
    // Generate summary
    await generateSummary();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          Meeting Summary Tool
        </CardTitle>
        <CardDescription>
          Record meetings and generate summaries with AI (Supports English & Arabic)
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!supportsVoice && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 p-3 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Voice recording not supported</p>
              <p className="text-sm mt-1">Your browser doesn't support voice recording. Please use Chrome, Edge, or Safari for full functionality.</p>
            </div>
          </div>
        )}
        
        {/* Meeting Context Dialog */}
        <MeetingContextDialog 
          open={showContextDialog} 
          onClose={handleContextDialogClose} 
        />
        
        {/* Voice Recording Controls */}
        <RecordingControls
          isRecording={state.isRecording}
          recordingTime={state.recordingTime}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          startRecording={handleStartRecording}
          stopRecording={stopRecording}
          recordingError={state.recordingError}
        />
        
        {/* Transcribed Text Section */}
        <TranscriptionPanel
          transcribedText={state.transcribedText}
          isSummarizing={state.isSummarizing}
          generateSummary={handleGenerateSummary}
        />
        
        {/* Meeting Summary Display */}
        {state.summary && (
          <SummaryDisplay
            summary={state.summary}
            detectedLocation={state.detectedLocation}
            copied={copied}
            copySummary={copySummary}
            exportAsPDF={exportAsPDF}
            downloadAudio={downloadAudio}
            isExporting={isExporting}
            isDownloadingAudio={isDownloadingAudio}
            audioData={typeof state.audioData === 'object' && state.audioData !== null ? state.audioData : null}
            summaryRef={summaryRef}
            recordingTime={state.recordingTime}
            meetingContext={meetingContext ? extractMeetingContext(state.transcribedText, meetingContext) : null}
          />
        )}
        
        {/* Meeting History */}
        <SavedMeetingsList
          savedMeetings={savedMeetings}
          isLoadingHistory={isLoadingHistory}
          onDeleteMeeting={deleteMeeting}
          onEditMeetingTitle={updateMeetingTitle}
        />
      </CardContent>
    </Card>
  );
};
