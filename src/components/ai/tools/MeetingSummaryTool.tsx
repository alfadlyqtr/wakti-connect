import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MeetingIntakeForm } from './meeting-summary/MeetingIntakeForm';
import { useMeetingSummaryV2 } from '@/hooks/ai/meeting-summary/useMeetingSummaryV2';
import RecordingControlsV2 from './meeting-summary/RecordingControlsV2';
import { Loader2, Download, FileUp, Copy, FileText } from 'lucide-react';
import { formatTranscriptWithRTL, containsArabic } from '@/utils/audio/recordingUtils';
import { toast } from "sonner";

export const MeetingSummaryTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState("record");
  const [showIntakeForm, setShowIntakeForm] = useState(true);
  
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
    setLanguage
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

  return (
    <div className="mx-auto w-full max-w-4xl bg-white rounded-lg overflow-hidden">
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
                  <div className="flex justify-end mb-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 gap-1 text-xs"
                      onClick={() => {
                        navigator.clipboard.writeText(state.transcribedText);
                        const message = isArabicTranscript ? "تم نسخ النص" : "Transcript copied";
                        const toastMessage = isArabicTranscript ? 
                          <span lang="ar" dir="rtl">{message}</span> : message;
                        toast.success(toastMessage);
                      }}
                    >
                      <Copy className="h-3 w-3" />
                      Copy Text
                    </Button>
                  </div>
                  
                  <div 
                    className={`prose max-w-none prose-sm bg-slate-50 p-4 rounded-lg overflow-y-auto max-h-[60vh] ${
                      isArabicTranscript ? 'prose-headings:font-arabic prose-p:font-arabic' : ''
                    }`}
                  >
                    {formatTranscriptWithRTL(state.transcribedText)}
                  </div>
                  
                  {!state.summary && (
                    <Button 
                      onClick={() => {
                        generateSummary();
                        setActiveTab("summary");
                      }}
                      className="w-full mt-4"
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
          </div>
        </Tabs>
      )}
    </div>
  );
};
