
import React, { useState, useRef } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MeetingIntakeForm } from './meeting-summary/MeetingIntakeForm';
import TranscriptionPanel from './meeting-summary/TranscriptionPanel';
import RecordingControlsV2 from './meeting-summary/RecordingControlsV2';
import { useMeetingSummaryV2 } from '@/hooks/ai/useMeetingSummaryV2';
import SummaryDisplay from './meeting-summary/SummaryDisplay';

export const MeetingSummaryToolV2 = () => {
  const [activeTab, setActiveTab] = useState('intake');
  const [selectedLanguage, setSelectedLanguage] = useState('auto');
  const [copied, setCopied] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  
  const {
    state,
    startRecording,
    stopRecording,
    startNextPart,
    generateSummary,
    setIntakeData,
    maxRecordingDuration,
    warnBeforeEndSeconds,
    copySummary,
    downloadAudio,
    resetSession,
    isExporting,
    isDownloadingAudio,
    exportAsPDF
  } = useMeetingSummaryV2();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleViewSummary = async (): Promise<void> => {
    setActiveTab("summary");
    return Promise.resolve();
  };

  const handleCopySummary = async () => {
    await copySummary();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            selectedLanguage={selectedLanguage}
            autoSilenceDetection={false}
            visualFeedback={true}
            silenceThreshold={-45}
            startRecording={startRecording}
            stopRecording={stopRecording}
            startNextPart={startNextPart}
            setSelectedLanguage={setSelectedLanguage}
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
            <SummaryDisplay
              summary={state.summary}
              detectedLocation={state.detectedLocation}
              detectedAttendees={state.detectedAttendees}
              copied={copied}
              copySummary={handleCopySummary}
              exportAsPDF={exportAsPDF}
              downloadAudio={downloadAudio}
              isExporting={isExporting}
              isDownloadingAudio={isDownloadingAudio}
              audioData={state.audioBlobs}
              summaryRef={summaryRef}
              onReset={resetSession}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
