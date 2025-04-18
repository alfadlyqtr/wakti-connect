
import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { useMeetingSummary } from '@/hooks/ai/useMeetingSummary';
import { exportMeetingSummaryAsPDF } from './meeting-summary/MeetingSummaryExporter';

// Import the refactored components
import RecordingControls from './meeting-summary/RecordingControls';
import TranscriptionPanel from './meeting-summary/TranscriptionPanel';
import SummaryDisplay from './meeting-summary/SummaryDisplay';
import SavedMeetingsList from './meeting-summary/SavedMeetingsList';

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
    startRecording,
    stopRecording,
    generateSummary,
    copySummary,
    downloadAudio
  } = useMeetingSummary();
  
  // Reference to the pulse animation element
  const pulseElementRef = useRef<HTMLDivElement>(null);
  
  // Load saved meetings on component mount
  useEffect(() => {
    loadSavedMeetings();
  }, [loadSavedMeetings]);

  // Handler for exporting summary as PDF
  const handleExportAsPDF = async () => {
    setIsExporting(true);
    try {
      await exportMeetingSummaryAsPDF(
        state.summary,
        state.recordingTime,
        state.detectedLocation
      );
    } finally {
      setIsExporting(false);
    }
  };

  const supportsVoice = typeof window !== 'undefined' && ('MediaRecorder' in window);

  // Handler for language selection that ensures type safety
  const handleLanguageChange = (lang: string) => {
    // Validate that the language is one of the allowed values before setting it
    if (['en', 'ar', 'es', 'fr', 'de', 'auto'].includes(lang)) {
      setSelectedLanguage(lang as "en" | "ar" | "es" | "fr" | "de" | "auto");
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
        
        {/* Voice Recording Controls */}
        <RecordingControls
          isRecording={state.isRecording}
          recordingTime={state.recordingTime}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={handleLanguageChange}
          startRecording={() => startRecording(supportsVoice)}
          stopRecording={stopRecording}
          recordingError={state.recordingError}
        />
        
        {/* Transcribed Text Section */}
        <TranscriptionPanel
          transcribedText={state.transcribedText}
          isSummarizing={state.isSummarizing}
          generateSummary={generateSummary}
        />
        
        {/* Meeting Summary Display */}
        {state.summary && (
          <SummaryDisplay
            summary={state.summary}
            detectedLocation={state.detectedLocation}
            detectedAttendees={state.detectedAttendees}
            detectedActionItems={state.detectedActionItems}
            copied={copied}
            copySummary={copySummary}
            exportAsPDF={handleExportAsPDF}
            downloadAudio={downloadAudio}
            isExporting={isExporting}
            isDownloadingAudio={isDownloadingAudio}
            audioData={state.audioData}
            summaryRef={summaryRef}
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
