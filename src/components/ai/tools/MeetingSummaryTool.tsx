
import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { useVoiceInteraction } from '@/hooks/ai/useVoiceInteraction';
import { useMeetingSummary } from '@/hooks/ai/useMeetingSummary';
import { useVoiceSettings } from '@/store/voiceSettings';
import { exportMeetingSummaryAsPDF } from './meeting-summary/MeetingSummaryExporter';
import RecordingControls from './meeting-summary/RecordingControls';
import SummaryDisplay from './meeting-summary/SummaryDisplay';
import SavedMeetingsList from './meeting-summary/SavedMeetingsList';
import TranscriptionPanel from './meeting-summary/TranscriptionPanel';
import { useToast } from '@/hooks/use-toast';

interface MeetingSummaryToolProps {
  onUseSummary?: (summary: string) => void;
}

export const MeetingSummaryTool: React.FC<MeetingSummaryToolProps> = ({ onUseSummary }) => {
  const { toast } = useToast();
  
  const {
    state,
    isExporting,
    setIsExporting,
    isDownloadingAudio,
    savedMeetings,
    isLoadingHistory,
    selectedLanguage,
    setSelectedLanguage,
    copied,
    summaryRef,
    deleteMeeting,
    loadSavedMeetings,
    startRecording: startRecordingHook,
    stopRecording,
    generateSummary,
    copySummary,
    downloadAudio
  } = useMeetingSummary();

  const { 
    autoSilenceDetection, 
    toggleAutoSilenceDetection,
    visualFeedback,
    toggleVisualFeedback,
    silenceThreshold,
    setSilenceThreshold,
    maxRecordingDuration
  } = useVoiceSettings();

  const { 
    supportsVoice,
    apiKeyStatus,
    apiKeyErrorDetails,
    retryApiKeyValidation
  } = useVoiceInteraction({
    continuousListening: false,
  });
  
  const pulseElementRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    loadSavedMeetings();
  }, []);

  const handleStartRecording = () => {
    if (apiKeyStatus === 'invalid' && apiKeyErrorDetails) {
      toast({
        title: "Speech Service Unavailable",
        description: apiKeyErrorDetails || "Unable to connect to speech services. Please check your API keys."
      });
      return;
    }
    
    startRecordingHook(supportsVoice, apiKeyStatus as "valid" | "invalid" | "checking" | "unchecked", apiKeyErrorDetails);
  };

  const handleExportAsPDF = async () => {
    setIsExporting(true);
    try {
      await exportMeetingSummaryAsPDF(
        state.summary,
        state.recordingTime,
        state.detectedLocation,
        state.detectedAttendees
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleUseSummary = () => {
    if (onUseSummary && state.summary) {
      onUseSummary(state.summary);
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
        {!supportsVoice && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 p-3 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Voice recording not supported</p>
              <p className="text-sm mt-1">Your browser doesn't support voice recording. Please use Chrome, Edge, or Safari for full functionality.</p>
            </div>
          </div>
        )}
        
        <RecordingControls
          isRecording={state.isRecording}
          recordingTime={state.recordingTime}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          autoSilenceDetection={autoSilenceDetection}
          toggleAutoSilenceDetection={toggleAutoSilenceDetection}
          visualFeedback={visualFeedback}
          toggleVisualFeedback={toggleVisualFeedback}
          silenceThreshold={silenceThreshold}
          setSilenceThreshold={setSilenceThreshold}
          startRecording={handleStartRecording}
          stopRecording={stopRecording}
          recordingError={state.recordingError}
          maxRecordingDuration={maxRecordingDuration}
        />
        
        <TranscriptionPanel
          transcribedText={state.transcribedText}
          isSummarizing={state.isSummarizing}
          generateSummary={generateSummary}
        />
        
        {state.summary && (
          <SummaryDisplay
            summary={state.summary}
            detectedLocation={state.detectedLocation}
            detectedAttendees={state.detectedAttendees}
            copied={copied}
            copySummary={copySummary}
            exportAsPDF={handleExportAsPDF}
            downloadAudio={downloadAudio}
            isExporting={isExporting}
            isDownloadingAudio={isDownloadingAudio}
            audioData={Array.isArray(state.audioData) ? state.audioData : state.audioData ? [state.audioData] : null}
            summaryRef={summaryRef}
          />
        )}
        
        {apiKeyStatus === 'invalid' && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 p-3 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Speech Service Unavailable</p>
              <p className="text-sm mt-1">Please check your API keys in the Supabase settings.</p>
            </div>
          </div>
        )}
        
        <SavedMeetingsList
          savedMeetings={savedMeetings}
          isLoadingHistory={isLoadingHistory}
          onDelete={deleteMeeting}
          onSelect={(meeting) => {
            // Load a saved meeting
          }}
          onDownload={(meeting) => {
            // Download saved meeting audio
          }}
        />
      </CardContent>
    </Card>
  );
};
