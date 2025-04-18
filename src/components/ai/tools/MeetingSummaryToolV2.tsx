
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useMeetingSummaryV2 } from '@/hooks/ai/useMeetingSummaryV2';
import { useVoiceSettings } from '@/store/voiceSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { MeetingIntakeForm } from './meeting-summary/MeetingIntakeForm';
import RecordingControlsV2 from './meeting-summary/RecordingControlsV2';
import AudioVisualization from './meeting-summary/AudioVisualization';
import SummaryDisplay from './meeting-summary/SummaryDisplay';
import SavedMeetingsList from './meeting-summary/SavedMeetingsList';
import TranscriptionPanel from './meeting-summary/TranscriptionPanel';

export const MeetingSummaryToolV2: React.FC = () => {
  const {
    state,
    startRecording,
    stopRecording,
    startNextPart,
    generateSummary,
    copySummary,
    downloadAudio,
    setIntakeData,
    resetSession,
    loadSavedMeetings,
    deleteMeeting,
    maxRecordingDuration,
    warnBeforeEndSeconds,
    summaryRef,
    isExporting,
    isDownloadingAudio
  } = useMeetingSummaryV2();

  const { 
    autoSilenceDetection, 
    toggleAutoSilenceDetection,
    visualFeedback,
    toggleVisualFeedback,
    silenceThreshold,
    setSilenceThreshold,
    language: selectedLanguage,
    setLanguage: setSelectedLanguage
  } = useVoiceSettings();
  
  const [savedMeetings, setSavedMeetings] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [showIntakeForm, setShowIntakeForm] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("record");
  
  // Load saved meetings
  useEffect(() => {
    const fetchMeetings = async () => {
      setIsLoadingHistory(true);
      const meetings = await loadSavedMeetings();
      setSavedMeetings(meetings);
      setIsLoadingHistory(false);
    };
    
    fetchMeetings();
  }, [loadSavedMeetings]);
  
  // Handle meeting deletion
  const handleDeleteMeeting = async (meetingId: string) => {
    const success = await deleteMeeting(meetingId);
    if (success) {
      setSavedMeetings(savedMeetings.filter(m => m.id !== meetingId));
    }
  };
  
  // Handle intake form submission
  const handleIntakeSubmit = (data: any) => {
    setIntakeData(data);
    setShowIntakeForm(false);
  };
  
  // Reset the session and show intake form again
  const handleReset = () => {
    resetSession();
    setShowIntakeForm(true);
    setActiveTab("record");
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          Meeting Summary Tool
        </CardTitle>
        <CardDescription>
          Record meetings and generate AI-powered summaries
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs defaultValue="record" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="record">Record</TabsTrigger>
            <TabsTrigger value="summary" disabled={!state.transcribedText}>Summary</TabsTrigger>
            <TabsTrigger value="saved">Saved Meetings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="record" className="space-y-6">
            {showIntakeForm ? (
              <MeetingIntakeForm 
                onSubmit={handleIntakeSubmit} 
                onSkip={() => setShowIntakeForm(false)} 
              />
            ) : (
              <>
                <RecordingControlsV2
                  isRecording={state.isRecording}
                  recordingTime={state.recordingTime}
                  selectedLanguage={selectedLanguage}
                  autoSilenceDetection={autoSilenceDetection}
                  visualFeedback={visualFeedback}
                  silenceThreshold={silenceThreshold}
                  startRecording={startRecording}
                  stopRecording={stopRecording}
                  startNextPart={startNextPart}
                  setSelectedLanguage={setSelectedLanguage}
                  toggleAutoSilenceDetection={toggleAutoSilenceDetection}
                  toggleVisualFeedback={toggleVisualFeedback}
                  setSilenceThreshold={setSilenceThreshold}
                  recordingError={state.recordingError}
                  maxRecordingDuration={maxRecordingDuration}
                  warnBeforeEndSeconds={warnBeforeEndSeconds}
                />
                
                {visualFeedback && state.isRecording && (
                  <AudioVisualization />
                )}
                
                {state.meetingParts.length > 0 && (
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p className="font-medium">Meeting Recording Parts:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      {state.meetingParts.map((part, index) => (
                        <li key={index}>
                          Part {part.partNumber}: {formatDuration(part.duration)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <TranscriptionPanel
                  transcribedText={state.transcribedText}
                  isSummarizing={state.isSummarizing}
                  generateSummary={generateSummary}
                  onViewSummary={async () => setActiveTab("summary")}
                />
              </>
            )}
          </TabsContent>
          
          <TabsContent value="summary" className="space-y-6">
            {state.summary ? (
              <SummaryDisplay
                summary={state.summary}
                detectedLocation={state.detectedLocation}
                detectedAttendees={state.detectedAttendees}
                copied={false}
                copySummary={copySummary}
                exportAsPDF={() => {}} // To be implemented 
                downloadAudio={downloadAudio}
                isExporting={isExporting}
                isDownloadingAudio={isDownloadingAudio}
                audioData={state.audioBlobs || []}
                summaryRef={summaryRef}
                onReset={handleReset}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {state.transcribedText 
                    ? "Click 'Generate Summary' to create a summary of your meeting."
                    : "Record a meeting first to generate a summary."}
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="saved">
            <SavedMeetingsList
              savedMeetings={savedMeetings}
              isLoadingHistory={isLoadingHistory}
              onDelete={handleDeleteMeeting}
              onSelect={() => {}} // To be implemented
              onDownload={() => {}} // To be implemented
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Helper function to format duration
function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
