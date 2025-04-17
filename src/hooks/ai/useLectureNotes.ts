import { useRef, useCallback, useEffect, useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { extractLectureContext } from '@/utils/text/transcriptionUtils';
import { exportLectureNotesAsPDF } from '@/components/ai/tools/lecture-notes/LectureNotesExporter';
import { 
  useMeetingRecording, 
  useMeetingSummaryGeneration, 
  useMeetingStorage, 
  useMeetingExport 
} from './meeting';

export interface LectureNotesState {
  isRecording: boolean;
  recordingTime: number;
  recordingError: string | null;
  transcribedText: string;
  isSummarizing: boolean;
  summary: string;
  detectedLocation: string | null;
  audioData: Blob | null;
}

export interface SavedLecture {
  id: string;
  date: string;
  summary: string;
  duration: number;
  title: string;
  course?: string;
}

export const useLectureNotes = () => {
  // Initialize all the sub-hooks
  const {
    recordingState,
    selectedLanguage,
    setSelectedLanguage,
    supportsVoice,
    startRecording: startRecordingBase,
    stopRecording,
    clearRecording
  } = useMeetingRecording();

  const {
    summaryState,
    generateSummary: generateSummaryBase,
    clearSummary
  } = useMeetingSummaryGeneration();

  const {
    savedMeetings: savedLectures,
    isLoadingHistory,
    saveMeetingToSupabase: saveLectureBase,
    loadSavedMeetings: loadSavedLectures,
    deleteMeeting: deleteLecture,
    updateMeetingTitle: updateLectureTitle
  } = useMeetingStorage('lecture-notes');

  const {
    isExporting,
    setIsExporting,
    isDownloadingAudio,
    copied,
    copySummary: copyNotes,
    downloadAudio: downloadAudioBase
  } = useMeetingExport();

  // References
  const notesRef = useRef<HTMLDivElement>(null);

  // Compute the combined state
  const state: LectureNotesState = {
    isRecording: recordingState.isRecording,
    recordingTime: recordingState.recordingTime,
    recordingError: recordingState.recordingError,
    transcribedText: recordingState.transcribedText,
    isSummarizing: summaryState.isSummarizing,
    summary: summaryState.summary,
    detectedLocation: summaryState.detectedLocation,
    audioData: recordingState.audioData
  };

  // Wrapped functions with enhanced functionality
  const generateSummary = useCallback(async () => {
    // Pass educational parameters to identify it as a lecture
    const result = await generateSummaryBase(recordingState.transcribedText, selectedLanguage);
    
    // If no title is set, generate one
    if (result?.summary) {
      // Save to storage automatically
      let title = 'Untitled Lecture';
      
      // Try to extract a title from the first line of the notes
      const firstLine = result.summary.split('\n')[0];
      if (firstLine && !firstLine.startsWith('#') && firstLine.length < 50) {
        title = firstLine;
      } else if (result.location) {
        title = `Lecture: ${result.location}`;
      }
      
      // Save with detected or generic title
      await saveLectureToSupabase(title);
    }
    
    return result;
  }, [generateSummaryBase, recordingState.transcribedText, selectedLanguage]);

  const saveLectureToSupabase = useCallback(async (title?: string) => {
    return await saveLectureBase(
      summaryState.summary,
      recordingState.transcribedText,
      recordingState.recordingTime,
      selectedLanguage,
      recordingState.audioData,
      title,
      'lecture'
    );
  }, [
    saveLectureBase, 
    summaryState.summary, 
    recordingState.transcribedText, 
    recordingState.recordingTime, 
    recordingState.audioData, 
    selectedLanguage
  ]);

  const downloadAudio = useCallback(async (lectureId?: string) => {
    await downloadAudioBase(recordingState.audioData, lectureId);
  }, [downloadAudioBase, recordingState.audioData]);

  // Enhanced export function
  const handleExportAsPDF = useCallback(async () => {
    setIsExporting(true);
    try {
      // Extract context from transcript
      const exportContext = state.detectedLocation 
        ? { course: state.detectedLocation } 
        : null;
          
      await exportLectureNotesAsPDF(
        state.summary,
        state.recordingTime,
        exportContext
      );
    } finally {
      setIsExporting(false);
    }
  }, [state.summary, state.recordingTime, state.detectedLocation, setIsExporting]);

  // Load saved lectures on first render
  useEffect(() => {
    loadSavedLectures();
  }, [loadSavedLectures]);

  return {
    state,
    isExporting,
    setIsExporting,
    isDownloadingAudio,
    selectedLanguage,
    setSelectedLanguage,
    copied,
    notesRef,
    savedLectures,
    isLoadingHistory,
    loadSavedLectures,
    startRecording: startRecordingBase,
    stopRecording,
    generateSummary,
    saveLectureToSupabase,
    deleteLecture,
    updateLectureTitle,
    downloadAudio,
    copyNotes,
    supportsVoice,
    exportAsPDF: handleExportAsPDF
  };
};
