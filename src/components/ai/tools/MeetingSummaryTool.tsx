import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { useMeetingSummary } from '@/hooks/ai/useMeetingSummary';
import { extractMeetingContext } from '@/utils/text/transcriptionUtils';
import RecordingControls from './meeting-summary/RecordingControls';
import TranscriptionPanel from './meeting-summary/TranscriptionPanel';
import SummaryDisplay from './meeting-summary/SummaryDisplay';
import SavedMeetingsList from './meeting-summary/SavedMeetingsList';
import { MeetingContextDialog, MeetingContextData } from './meeting-summary/MeetingContextDialog';
import { LANGUAGE_STORAGE_KEY } from '@/hooks/ai/meeting/useMeetingRecording';

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

  const [showContextDialog, setShowContextDialog] = useState(false);
  const [meetingContext, setMeetingContext] = useState<MeetingContextData | null>(null);

  useEffect(() => {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
    }
  }, [setSelectedLanguage]);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  };

  useEffect(() => {
    loadSavedMeetings();
  }, [loadSavedMeetings]);

  const handleStartRecording = () => {
    setShowContextDialog(true);
  };

  const handleContextDialogClose = (data?: MeetingContextData) => {
    setShowContextDialog(false);
    
    if (data) {
      setMeetingContext(data);
      startRecording();
    }
  };

  const handleGenerateSummary = async () => {
    await generateSummary();
  };

  const handleCopySummary = (summary: string) => {
    copySummary(summary);
    
    if (onUseSummary) {
      onUseSummary(summary);
    }
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
        
        <MeetingContextDialog 
          open={showContextDialog} 
          onClose={handleContextDialogClose} 
        />
        
        <RecordingControls
          isRecording={state.isRecording}
          recordingTime={state.recordingTime}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={handleLanguageChange}
          startRecording={handleStartRecording}
          stopRecording={stopRecording}
          recordingError={state.recordingError}
        />
        
        {state.transcribedText && (
          <TranscriptionPanel
            transcribedText={state.transcribedText}
            isSummarizing={state.isSummarizing}
            generateSummary={handleGenerateSummary}
          />
        )}
        
        {state.summary && (
          <SummaryDisplay
            summary={state.summary}
            detectedLocation={state.detectedLocation}
            copied={copied}
            copySummary={handleCopySummary}
            exportAsPDF={exportAsPDF}
            downloadAudio={downloadAudio}
            isExporting={isExporting}
            isDownloadingAudio={isDownloadingAudio}
            audioData={state.audioData}
            summaryRef={summaryRef}
            recordingTime={state.recordingTime}
            meetingContext={meetingContext ? extractMeetingContext(state.transcribedText, meetingContext) : null}
          />
        )}
        
        <SavedMeetingsList
          savedMeetings={savedMeetings}
          isLoadingHistory={isLoadingHistory}
          onDeleteMeeting={deleteMeeting}
          onEditMeetingTitle={updateMeetingTitle}
          onDownloadAudio={downloadAudio}
        />
      </CardContent>
    </Card>
  );
};
