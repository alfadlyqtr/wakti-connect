
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { useLectureNotes } from '@/hooks/ai/useLectureNotes';
import { extractLectureContext } from '@/utils/text/transcriptionUtils';

// Import the refactored components
import RecordingControls from './RecordingControls';
import TranscriptionPanel from './TranscriptionPanel';
import NotesDisplay from './NotesDisplay';
import SavedLecturesList from './SavedLecturesList';
import { LectureContextDialog, LectureContextData } from './LectureContextDialog';

interface LectureNotesToolProps {
  onUseNotes?: (notes: string) => void;
}

export const LectureNotesTool: React.FC<LectureNotesToolProps> = ({ onUseNotes }) => {
  const {
    state,
    isDownloadingAudio,
    savedLectures,
    isLoadingHistory,
    isExporting,
    selectedLanguage,
    setSelectedLanguage,
    copied,
    notesRef,
    loadSavedLectures,
    startRecording,
    stopRecording,
    generateSummary,
    copyNotes,
    downloadAudio,
    deleteLecture,
    updateLectureTitle,
    supportsVoice,
    exportAsPDF
  } = useLectureNotes();

  // State for lecture context dialog
  const [showContextDialog, setShowContextDialog] = useState(false);
  const [lectureContext, setLectureContext] = useState<LectureContextData | null>(null);
  
  // Load saved lectures on component mount
  useEffect(() => {
    loadSavedLectures();
  }, [loadSavedLectures]);

  // Start recording with context gathering flow
  const handleStartRecording = () => {
    // Show context dialog before starting recording
    setShowContextDialog(true);
  };

  // Handler for context dialog close
  const handleContextDialogClose = (data?: LectureContextData) => {
    setShowContextDialog(false);
    
    if (data) {
      // Save the context data if provided
      setLectureContext(data);
    }
    
    // Start recording after dialog is closed
    startRecording();
  };

  // Enhanced summary generation with context
  const handleGenerateSummary = async () => {
    // Generate summary
    await generateSummary();
  };

  // Handle using the notes in the parent component if needed
  const handleCopyNotes = (notes: string) => {
    copyNotes(notes);
    
    // If onUseNotes is provided, call it with the notes
    if (onUseNotes) {
      onUseNotes(notes);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          Lecture Notes Tool
        </CardTitle>
        <CardDescription>
          Record lectures and generate comprehensive notes with AI (Supports English & Arabic)
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
        
        {/* Lecture Context Dialog */}
        <LectureContextDialog 
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
        
        {/* Lecture Notes Display */}
        {state.summary && (
          <NotesDisplay
            notes={state.summary}
            detectedCourse={state.detectedLocation}
            copied={copied}
            copyNotes={handleCopyNotes}
            exportAsPDF={exportAsPDF}
            downloadAudio={downloadAudio}
            isExporting={isExporting}
            isDownloadingAudio={isDownloadingAudio}
            audioData={typeof state.audioData === 'object' && state.audioData !== null ? state.audioData : null}
            notesRef={notesRef}
            recordingTime={state.recordingTime}
            lectureContext={lectureContext ? extractLectureContext(state.transcribedText, lectureContext) : null}
          />
        )}
        
        {/* Lecture History */}
        <SavedLecturesList
          savedLectures={savedLectures}
          isLoadingHistory={isLoadingHistory}
          onDeleteLecture={deleteLecture}
          onEditLectureTitle={updateLectureTitle}
        />
      </CardContent>
    </Card>
  );
};

