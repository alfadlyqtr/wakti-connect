
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { useVoiceInteraction } from '@/hooks/ai/useVoiceInteraction';
import { useMeetingSummary } from '@/hooks/ai/useMeetingSummary';
import { exportMeetingSummaryAsPDF } from './meeting-summary/MeetingSummaryExporter';
import { MeetingContext, extractMeetingContext } from '@/utils/text/transcriptionUtils';

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
    setIsExporting,
    selectedLanguage,
    setSelectedLanguage,
    copied,
    summaryRef,
    loadSavedMeetings,
    startRecording: startRecordingHook,
    stopRecording,
    generateSummary,
    copySummary,
    downloadAudio
  } = useMeetingSummary();

  // State for meeting context dialog
  const [showContextDialog, setShowContextDialog] = useState(false);
  const [meetingContext, setMeetingContext] = useState<MeetingContextData | null>(null);
  
  // Reference to the pulse animation element
  const pulseElementRef = useRef<HTMLDivElement>(null);
  
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
    startRecordingHook();
  };

  // Enhanced summary generation with context
  const handleGenerateSummary = async () => {
    // Extract context from transcript and combine with user-provided context
    const extractedContext = meetingContext 
      ? extractMeetingContext(state.transcribedText, meetingContext)
      : extractMeetingContext(state.transcribedText);
    
    // Pass the context to summary generation
    await generateSummary(extractedContext);
  };

  // Handler for exporting summary as PDF
  const handleExportAsPDF = async () => {
    setIsExporting(true);
    try {
      // Extract context from transcript and combine with user-provided context if available
      const exportContext = meetingContext 
        ? extractMeetingContext(state.transcribedText, meetingContext)
        : state.detectedLocation 
          ? { location: state.detectedLocation } as MeetingContext
          : null;
          
      await exportMeetingSummaryAsPDF(
        state.summary,
        state.recordingTime,
        exportContext
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          Meeting Summary Tool
        </CardTitle>
        <CardDescription>
          Record meetings and generate summaries with AI
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!state.supportsVoice && (
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
            exportAsPDF={handleExportAsPDF}
            downloadAudio={downloadAudio}
            isExporting={isExporting}
            isDownloadingAudio={isDownloadingAudio}
            audioData={state.audioData}
            summaryRef={summaryRef}
            recordingTime={state.recordingTime}
            meetingContext={meetingContext ? extractMeetingContext(state.transcribedText, meetingContext) : null}
          />
        )}
        
        {/* Meeting History */}
        <SavedMeetingsList
          savedMeetings={savedMeetings}
          isLoadingHistory={isLoadingHistory}
        />
      </CardContent>
    </Card>
  );
};
