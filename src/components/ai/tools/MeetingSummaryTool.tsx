
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Copy, FileDown, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMeetingSummaryV2 } from '@/hooks/ai/meeting-summary/useMeetingSummaryV2';
import { MeetingIntakeDialog } from './meeting-summary/MeetingIntakeDialog';
import RecordingControlsV2 from './meeting-summary/RecordingControlsV2';
import TranscriptionPanel from './meeting-summary/TranscriptionPanel';
import SummaryDisplay from './meeting-summary/SummaryDisplay';
import { toast } from "sonner";

export const MeetingSummaryTool = () => {
  const [isIntakeDialogOpen, setIsIntakeDialogOpen] = useState(false);
  const [isRecordingMode, setIsRecordingMode] = useState(false);
  const [isSummaryMode, setIsSummaryMode] = useState(false);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('auto');
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

  useEffect(() => {
    // When recording stops and processing is done, show feedback popup
    if (!state.isRecording && !state.isProcessing && state.transcribedText && !state.summary && !showFeedbackPopup && !isSummaryMode) {
      setShowFeedbackPopup(true);
    }
    
    // When summary is generated, move to summary mode
    if (state.summary && !isSummaryMode) {
      setIsSummaryMode(true);
      setShowFeedbackPopup(false);
    }
  }, [state.isRecording, state.isProcessing, state.transcribedText, state.summary, showFeedbackPopup, isSummaryMode]);

  const handleStartRecordingFlow = () => {
    setIsIntakeDialogOpen(true);
  };

  const handleIntakeSubmit = (data: any) => {
    setIntakeData(data);
    setIsIntakeDialogOpen(false);
    setIsRecordingMode(true);
    setTimeout(() => {
      startRecording();
    }, 500);
  };

  const handleSkipIntake = () => {
    setIsIntakeDialogOpen(false);
    setIsRecordingMode(true);
    setTimeout(() => {
      startRecording();
    }, 500);
  };

  const handleViewSummary = async (): Promise<void> => {
    setShowFeedbackPopup(false);
    setIsSummaryMode(true);
    return Promise.resolve();
  };

  const handleStartNewMeeting = () => {
    resetSession();
    setIsRecordingMode(false);
    setIsSummaryMode(false);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg overflow-hidden shadow-sm">
      {/* Welcome Screen with Start Button */}
      {!isRecordingMode && !isSummaryMode && !state.summary && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-10 text-center space-y-6"
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <Mic className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Meeting Summary Tool</h1>
            <p className="text-gray-500 max-w-xl mx-auto">
              Record your meetings and instantly get AI-powered summaries with key points, action items, and essential details.
            </p>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              size="lg" 
              className="px-8 py-6 text-lg rounded-full shadow-md bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              onClick={handleStartRecordingFlow}
            >
              <Mic className="mr-2 h-5 w-5" />
              Start Recording
            </Button>
          </motion.div>
        </motion.div>
      )}
      
      {/* Recording Mode with Controls */}
      <AnimatePresence>
        {isRecordingMode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-6 space-y-6"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight mb-2">Recording your meeting</h2>
              <p className="text-gray-500">Speak clearly and WAKTI AI will capture everything for you.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
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
            </div>
            
            {state.transcribedText && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <TranscriptionPanel
                  transcribedText={state.transcribedText}
                  isSummarizing={state.isSummarizing}
                  isProcessing={state.isProcessing}
                  generateSummary={generateSummary}
                  onViewSummary={handleViewSummary}
                  onStartNewMeeting={handleStartNewMeeting}
                />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Feedback Popup */}
      <AnimatePresence>
        {showFeedbackPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm"
          >
            <motion.div 
              className="bg-white p-8 rounded-xl shadow-2xl max-w-md mx-auto border border-gray-100"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
            >
              <button 
                onClick={() => setShowFeedbackPopup(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
              
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-green-100 text-green-600 mb-4">
                  <Mic className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-2">Recording Complete!</h3>
                <p className="text-gray-500">Your recording has been processed. Ready to see the summary?</p>
              </div>
              
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={() => generateSummary()}
                  size="lg"
                  className="w-full"
                  disabled={state.isSummarizing}
                >
                  {state.isSummarizing ? "Creating Summary..." : "Generate Summary"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowFeedbackPopup(false)}
                >
                  Continue Recording
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Summary Mode */}
      <AnimatePresence>
        {isSummaryMode && state.summary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold tracking-tight">Meeting Summary</h2>
              <Button 
                variant="outline" 
                onClick={handleStartNewMeeting}
              >
                Start New Meeting
              </Button>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-white rounded-lg border shadow-sm">
                <div className="border-b p-4 flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copySummary}
                    className="flex items-center gap-1"
                  >
                    <Copy className="h-4 w-4" />
                    <span>Copy</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportAsPDF}
                    disabled={isExporting}
                    className="flex items-center gap-1"
                  >
                    <FileDown className="h-4 w-4" />
                    <span>{isExporting ? "Exporting..." : "Export PDF"}</span>
                  </Button>
                  
                  {state.audioBlobs && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadAudio}
                      disabled={isDownloadingAudio}
                      className="flex items-center gap-1"
                    >
                      <Download className="h-4 w-4" />
                      <span>{isDownloadingAudio ? "Downloading..." : "Download Audio"}</span>
                    </Button>
                  )}
                </div>
                
                <SummaryDisplay
                  summary={state.summary}
                  detectedLocation={state.detectedLocation}
                  detectedAttendees={state.detectedAttendees}
                  copied={false}
                  copySummary={copySummary}
                  exportAsPDF={exportAsPDF}
                  downloadAudio={downloadAudio}
                  isExporting={isExporting}
                  isDownloadingAudio={isDownloadingAudio}
                  audioData={state.audioBlobs}
                  summaryRef={summaryRef}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Meeting Intake Dialog */}
      <MeetingIntakeDialog
        isOpen={isIntakeDialogOpen}
        onClose={() => setIsIntakeDialogOpen(false)}
        onSubmit={handleIntakeSubmit}
        onSkip={handleSkipIntake}
      />
    </div>
  );
};
