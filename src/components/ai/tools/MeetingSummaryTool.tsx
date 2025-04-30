
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MeetingIntakeForm } from './meeting-summary/MeetingIntakeForm';
import { useMeetingSummaryV2 } from '@/hooks/ai/meeting-summary/useMeetingSummaryV2';
import RecordingControlsV2 from './meeting-summary/RecordingControlsV2';
import { Loader2, Download, FileUp, Copy, FileText, Volume2 } from 'lucide-react';
import { formatTranscriptWithRTL, containsArabic } from '@/utils/audio/recordingUtils';
import { toast } from "sonner";
import TranscriptionPanel from './meeting-summary/TranscriptionPanel';
import SavedRecordingsTab from './meeting-summary/SavedRecordingsTab';
import { 
  playTextWithVoiceRSS, 
  stopCurrentAudio, 
  pauseCurrentAudio, 
  resumeCurrentAudio, 
  restartCurrentAudio 
} from '@/utils/voiceRSS';
import { VoiceControls } from './meeting-summary/components/VoiceControls';

export const MeetingSummaryTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState("record");
  const [showIntakeForm, setShowIntakeForm] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const {
    state,
    startRecording,
    stopRecording,
    startNextPart,
    generateSummary,
    copySummary,
    downloadAudio,
    exportAsPDF,
    setIntakeData,
    resetSession,
    summaryRef,
    isExporting,
    isDownloadingAudio,
    maxRecordingDuration,
    warnBeforeEndSeconds,
    language,
    setLanguage,
    updateTranscript
  } = useMeetingSummaryV2();

  const handleIntakeSubmit = (data: any) => {
    const mappedData = {
      title: data.sessionType,
      location: data.location,
      language: data.language
    };
    
    setIntakeData(mappedData);
    setShowIntakeForm(false);
  };

  const handleSkipIntake = () => {
    setShowIntakeForm(false);
  };

  const hasTranscription = !!state.transcribedText;
  const hasMeetingParts = state.meetingParts.length > 0;
  
  const isArabicTranscript = containsArabic(state.transcribedText);
  const isArabicSummary = state.summary ? containsArabic(state.summary) : false;
  
  // Define voice play controls
  const handlePlaySummary = async () => {
    try {
      if (isPaused) {
        resumeCurrentAudio();
        setIsPlaying(true);
        setIsPaused(false);
        return;
      }

      stopCurrentAudio();

      // Detect language for voice selection
      const isArabic = containsArabic(state.summary || '');
      const voice = isArabic ? 'Hareth' : 'John';
      const languageCode = isArabic ? 'ar-sa' : 'en-us';

      const audio = await playTextWithVoiceRSS({
        text: state.summary || '',
        language: languageCode,
        voice: voice,
      });

      setIsPlaying(true);
      setIsPaused(false);

      audio.onended = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };

    } catch (error) {
      console.error('Failed to play summary:', error);
      toast.error('Failed to play audio. Please try again.');
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  const handlePauseSummary = () => {
    pauseCurrentAudio();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleRestartSummary = () => {
    restartCurrentAudio();
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handleStopSummary = () => {
    stopCurrentAudio();
    setIsPlaying(false);
    setIsPaused(false);
  };
  
  // Define the onViewSummary function
  const onViewSummary = async () => {
    if (state.summary) {
      setActiveTab("summary");
    } else if (hasTranscription) {
      await generateSummary();
      setActiveTab("summary");
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl bg-white">
      {showIntakeForm ? (
        <MeetingIntakeForm onSubmit={handleIntakeSubmit} onSkip={handleSkipIntake} />
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b">
            <div className="flex items-center justify-between px-4">
              <TabsList className="h-12">
                <TabsTrigger value="record" className="data-[state=active]:bg-wakti-navy/10">
                  Record
                </TabsTrigger>
                <TabsTrigger 
                  value="transcript" 
                  className="data-[state=active]:bg-wakti-navy/10"
                  disabled={!hasTranscription}
                >
                  Transcript
                </TabsTrigger>
                <TabsTrigger 
                  value="summary" 
                  className="data-[state=active]:bg-wakti-navy/10"
                  disabled={!hasTranscription}
                >
                  Summary
                </TabsTrigger>
                <TabsTrigger 
                  value="history" 
                  className="data-[state=active]:bg-wakti-navy/10"
                >
                  History
                </TabsTrigger>
              </TabsList>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={resetSession}
                className="text-xs"
                disabled={state.isRecording || state.isProcessing}
              >
                Reset
              </Button>
            </div>
          </div>
          
          <div className="p-4 sm:p-6">
            <TabsContent value="record" className="mt-0 pt-4">
              <RecordingControlsV2
                isRecording={state.isRecording}
                recordingTime={state.recordingTime}
                selectedLanguage={language}
                startRecording={startRecording}
                stopRecording={stopRecording}
                startNextPart={startNextPart}
                setSelectedLanguage={setLanguage}
                recordingError={state.recordingError}
                maxRecordingDuration={maxRecordingDuration}
                warnBeforeEndSeconds={warnBeforeEndSeconds}
              />
              
              {state.isProcessing && (
                <div className="flex items-center justify-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-wakti-navy" />
                    <p className="text-sm text-wakti-navy">Processing audio...</p>
                  </div>
                </div>
              )}
              
              {hasMeetingParts && !state.isRecording && !state.isProcessing && (
                <div className="mt-6 border-t pt-6 border-wakti-navy/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-wakti-navy font-medium">Recording Summary</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadAudio}
                      disabled={isDownloadingAudio}
                      className="h-8 text-xs gap-1"
                    >
                      {isDownloadingAudio ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Download className="h-3 w-3" />
                      )}
                      Download Audio
                    </Button>
                  </div>
                  
                  <div className="grid gap-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-wakti-navy/70">
                      <div>
                        <span className="block font-medium">Parts</span>
                        <span>{state.meetingParts.length}</span>
                      </div>
                      <div>
                        <span className="block font-medium">Duration</span>
                        <span>
                          {Math.floor(state.meetingParts.reduce((sum, part) => sum + part.duration, 0) / 60)}m {state.meetingParts.reduce((sum, part) => sum + part.duration, 0) % 60}s
                        </span>
                      </div>
                      <div>
                        <span className="block font-medium">Language</span>
                        <span>
                          {language === 'auto' ? 'Auto-detected' : 
                           language === 'en' ? 'English' : 
                           language === 'ar' ? 'Arabic' : 'Mixed'}
                        </span>
                      </div>
                      <div>
                        <span className="block font-medium">Type</span>
                        <span>{state.meetingTitle || 'Meeting'}</span>
                      </div>
                    </div>
                    
                    {hasTranscription && !state.summary && (
                      <Button 
                        onClick={() => {
                          generateSummary();
                          setActiveTab("summary");
                        }}
                        className="w-full mt-2"
                        disabled={state.isSummarizing}
                      >
                        {state.isSummarizing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Generating Summary...
                          </>
                        ) : (
                          <>Generate AI Summary</>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="transcript" className="mt-0 pt-4">
              {hasTranscription ? (
                <div>
                  <TranscriptionPanel
                    transcribedText={state.transcribedText}
                    isSummarizing={state.isSummarizing}
                    isProcessing={state.isProcessing}
                    generateSummary={generateSummary}
                    onViewSummary={onViewSummary}
                    onStartNewMeeting={resetSession}
                    onUpdateTranscript={updateTranscript}
                    audioBlobs={state.audioBlobs}
                    onDownloadAudio={downloadAudio}
                  />
                </div>
              ) : (
                <div className="text-center py-12 text-wakti-navy/60">
                  <p>No transcript available yet.</p>
                  <p className="text-sm mt-2">Start recording to generate a transcript.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="summary" className="mt-0 pt-4">
              {state.summary ? (
                <div>
                  <div className="flex justify-end gap-2 mb-2">
                    {/* Voice playback controls */}
                    <VoiceControls
                      isPlaying={isPlaying}
                      isPaused={isPaused}
                      onPlay={handlePlaySummary}
                      onPause={handlePauseSummary}
                      onRestart={handleRestartSummary}
                      onStop={handleStopSummary}
                    />
                  
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs gap-1"
                      onClick={copySummary}
                    >
                      <Copy className="h-3 w-3" />
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs gap-1"
                      onClick={exportAsPDF}
                      disabled={isExporting}
                    >
                      {isExporting ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <FileText className="h-3 w-3" />
                      )}
                      Export PDF
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs gap-1"
                      onClick={downloadAudio}
                      disabled={isDownloadingAudio}
                    >
                      {isDownloadingAudio ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Download className="h-3 w-3" />
                      )}
                      Download Audio
                    </Button>
                  </div>
                  
                  <div 
                    ref={summaryRef}
                    className={`prose max-w-none bg-slate-50 p-4 rounded-lg overflow-y-auto max-h-[60vh] ${
                      isArabicSummary ? 'prose-headings:font-arabic prose-p:font-arabic text-right' : ''
                    }`}
                    dir={isArabicSummary ? "rtl" : "ltr"}
                  >
                    {formatTranscriptWithRTL(state.summary)}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  {state.isSummarizing ? (
                    <div className="flex flex-col items-center space-y-4">
                      <Loader2 className="h-8 w-8 animate-spin text-wakti-navy" />
                      <div className="text-wakti-navy">
                        <p className="font-medium">Generating summary</p>
                        <p className="text-sm text-wakti-navy/70">
                          Our AI is analyzing your meeting...
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-wakti-navy/60">No summary available yet.</p>
                      <Button 
                        onClick={generateSummary}
                        className="mt-4"
                        disabled={!hasTranscription}
                      >
                        Generate Summary
                      </Button>
                    </>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="mt-0 pt-4">
              <SavedRecordingsTab />
            </TabsContent>
          </div>
        </Tabs>
      )}
    </div>
  );
};
