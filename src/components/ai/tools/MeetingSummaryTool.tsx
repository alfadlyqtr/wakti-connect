
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVoiceInteraction } from '@/hooks/ai/useVoiceInteraction';
import { useMeetingSummary } from '@/hooks/ai/useMeetingSummary';
import { useVoiceSettings } from '@/store/voiceSettings';
import { exportMeetingSummaryAsPDF } from './meeting-summary/MeetingSummaryExporter';
import RecordingControlsV2 from './meeting-summary/RecordingControlsV2';
import SummaryDisplay from './meeting-summary/SummaryDisplay';
import SavedMeetingsList from './meeting-summary/SavedMeetingsList';
import TranscriptionPanel from './meeting-summary/TranscriptionPanel';
import { MeetingIntakeDialog } from './meeting-summary/MeetingIntakeDialog';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { IntakeData } from '@/hooks/ai/meeting-summary/types';

interface MeetingSummaryToolProps {
  onUseSummary?: (summary: string) => void;
}

export const MeetingSummaryTool: React.FC<MeetingSummaryToolProps> = ({ onUseSummary }) => {
  const { toast } = useToast();
  const [showIntakeDialog, setShowIntakeDialog] = useState(false);
  const [isStartingRecording, setIsStartingRecording] = useState(false);
  const [intakeData, setIntakeDataLocal] = useState<IntakeData | null>(null);
  
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
    
    setShowIntakeDialog(true);
  };

  const setIntakeData = (data: IntakeData) => {
    setIntakeDataLocal(data);
    // In a real implementation, we would want to update the state in the hook
    // For now, we're just capturing it locally
  };

  const handleIntakeSubmit = (data: IntakeData) => {
    setShowIntakeDialog(false);
    setIsStartingRecording(true);
    setIntakeData(data);
    
    // When calling startRecordingHook, we need to provide the expected arguments
    // We can pass default values if specific values aren't needed
    startRecordingHook(false, '', null);
  };

  const handleSkipIntake = () => {
    setShowIntakeDialog(false);
    setIsStartingRecording(true);
    
    // When calling startRecordingHook, we need to provide the expected arguments
    // We can pass default values if specific values aren't needed
    startRecordingHook(false, '', null);
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
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-900/90 to-purple-900/90 p-4 sm:p-6">
      <Card className="max-w-4xl mx-auto bg-black/40 border-none shadow-2xl backdrop-blur-xl">
        <CardContent className="p-6 space-y-6">
          {!state.isRecording && !state.transcribedText && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <Button
                onClick={handleStartRecording}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 rounded-full text-lg font-medium shadow-xl hover:shadow-2xl transform transition-all hover:scale-105"
              >
                <Mic className="w-6 h-6 mr-2" />
                Start Recording
              </Button>
            </motion.div>
          )}
          
          {(state.isRecording || state.transcribedText) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <RecordingControlsV2
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
                startRecording={() => startRecordingHook(false, '', null)}
                stopRecording={stopRecording}
                startNextPart={() => {}}
                recordingError={state.recordingError}
                maxRecordingDuration={maxRecordingDuration}
                warnBeforeEndSeconds={30}
              />

              <TranscriptionPanel
                transcribedText={state.transcribedText}
                isSummarizing={state.isSummarizing}
                isProcessing={state.isProcessing}
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
            </motion.div>
          )}
          
          <SavedMeetingsList
            savedMeetings={savedMeetings}
            isLoadingHistory={isLoadingHistory}
            onDelete={deleteMeeting}
            onSelect={() => {}}
            onDownload={() => {}}
          />
        </CardContent>
      </Card>

      <MeetingIntakeDialog
        isOpen={showIntakeDialog}
        onClose={() => setShowIntakeDialog(false)}
        onSubmit={handleIntakeSubmit}
        onSkip={handleSkipIntake}
      />
    </div>
  );
};
