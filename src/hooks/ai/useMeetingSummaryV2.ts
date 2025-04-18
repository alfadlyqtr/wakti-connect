import { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";

// Define types to ensure correct usage throughout the codebase
interface MeetingPart {
  partNumber: number;
  duration: number;
  audioBlob: Blob;
}

interface MeetingSummaryState {
  isRecording: boolean;
  recordingTime: number;
  transcribedText: string;
  isSummarizing: boolean;
  summary: string | null;
  recordingError: string | null;
  detectedLocation: string | null;
  detectedAttendees: string[] | null;
  meetingParts: MeetingPart[];
  audioBlobs: Blob[] | null;
  meetingTitle?: string;
  meetingDate?: string;
  meetingLocation?: string;
}

interface IntakeData {
  title?: string;
  date?: string;
  location?: string;
}

export function useMeetingSummaryV2() {
  const [state, setState] = useState<MeetingSummaryState>({
    isRecording: false,
    recordingTime: 0,
    transcribedText: '',
    isSummarizing: false,
    summary: null,
    recordingError: null,
    detectedLocation: null,
    detectedAttendees: null,
    meetingParts: [],
    audioBlobs: null,
    meetingTitle: undefined,
    meetingDate: undefined,
    meetingLocation: undefined
  });

  // Constants for recording
  const maxRecordingDuration = 300; // 5 minutes per part
  const warnBeforeEndSeconds = 30; // Warn 30 seconds before the end

  // References
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const summaryRef = useRef<HTMLDivElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // For loading and exporting states
  const [isExporting, setIsExporting] = useState(false);
  const [isDownloadingAudio, setIsDownloadingAudio] = useState(false);

  // Reset the recording session
  const resetSession = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    setState({
      isRecording: false,
      recordingTime: 0,
      transcribedText: '',
      isSummarizing: false,
      summary: null,
      recordingError: null,
      detectedLocation: null,
      detectedAttendees: null,
      meetingParts: [],
      audioBlobs: null,
      meetingTitle: undefined,
      meetingDate: undefined,
      meetingLocation: undefined
    });
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      // Reset any previous recording errors
      setState(prev => ({ ...prev, recordingError: null }));
      
      audioChunksRef.current = [];
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onerror = (event) => {
        setState(prev => ({ 
          ...prev, 
          recordingError: "Error occurred during recording. Please try again.",
          isRecording: false 
        }));
        
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };
            
      mediaRecorder.start();
      
      setState(prev => ({ ...prev, isRecording: true }));
      
      // Start timer
      let seconds = 0;
      timerRef.current = window.setInterval(() => {
        seconds += 1;
        setState(prev => ({ ...prev, recordingTime: seconds }));
      }, 1000);
      
    } catch (err) {
      console.error('Error starting recording:', err);
      setState(prev => ({ 
        ...prev, 
        recordingError: "Microphone access denied. Please allow microphone access and try again."
      }));
    }
  }, []);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop();
      
      // Create a new meeting part
      const partNumber = state.meetingParts.length + 1;
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      // Add the new part to state
      setState(prev => ({
        ...prev,
        isRecording: false,
        meetingParts: [
          ...prev.meetingParts,
          {
            partNumber,
            duration: prev.recordingTime,
            audioBlob
          }
        ],
        audioBlobs: [...(prev.audioBlobs || []), audioBlob]
      }));
      
      // Stop and clear the stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      // Process the recording (transcribe etc.)
      processRecording(audioBlob);
    }
  }, [state.isRecording, state.meetingParts, state.recordingTime, state.audioBlobs]);

  // Start next part of the recording
  const startNextPart = useCallback(() => {
    // Reset timer but keep the state of previous parts
    setState(prev => ({ ...prev, recordingTime: 0 }));
    
    // Start a new recording
    startRecording();
  }, [startRecording]);

  // Process recorded audio
  const processRecording = useCallback(async (audioBlob: Blob) => {
    try {
      // Here we would transcribe the audio
      // This is a placeholder - in a real app you would send the audio to a transcription service
      const mockTranscription = "This is a placeholder transcription. In a real application, this text would come from processing the audio through a transcription service.";
      
      // Update state with transcription
      setState(prev => ({
        ...prev,
        transcribedText: prev.transcribedText 
          ? `${prev.transcribedText}\n\n${mockTranscription}`
          : mockTranscription
      }));
      
    } catch (error) {
      console.error("Error processing recording:", error);
      toast.error("Failed to process the recording. Please try again.");
    }
  }, []);

  // Generate a summary from the transcription
  const generateSummary = useCallback(async () => {
    if (!state.transcribedText) return;
    
    setState(prev => ({ ...prev, isSummarizing: true }));
    
    try {
      // In a real app, you would send the transcription to an AI service
      // This is a placeholder
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
      
      const mockSummary = `
        ## Meeting Summary

        ### Key Points:
        - Point 1: Important discussion about project timeline.
        - Point 2: Decision to allocate more resources to development.
        - Point 3: Agreement on next sprint goals.

        ### Action Items:
        - Action 1: Team to prepare status report by Friday.
        - Action 2: Schedule follow-up meeting next week.
        - Action 3: Review budget allocations.

        ### Decisions:
        - Decision 1: Approved new feature roadmap.
        - Decision 2: Postponed marketing campaign until Q3.
      `;
      
      const detectedLocation = state.meetingLocation || "Conference Room A";
      const detectedAttendees = ["John Doe", "Jane Smith", "Alex Johnson"];
      
      setState(prev => ({
        ...prev,
        summary: mockSummary,
        isSummarizing: false,
        detectedLocation,
        detectedAttendees
      }));
      
      // Save to database
      if (state.meetingParts.length > 0 && state.audioBlobs) {
        const totalDuration = state.meetingParts.reduce((sum, part) => sum + part.duration, 0);
        
        await saveMeetingSummary({
          title: state.meetingTitle || "Untitled Meeting",
          date: state.meetingDate || new Date().toISOString().split('T')[0],
          location: detectedLocation,
          summary: mockSummary,
          duration: totalDuration,
          audioBlobs: state.audioBlobs
        });
      }
      
    } catch (error) {
      console.error("Error generating summary:", error);
      setState(prev => ({ ...prev, isSummarizing: false }));
      toast.error("Failed to generate summary. Please try again.");
    }
  }, [state.transcribedText, state.meetingParts, state.audioBlobs, state.meetingTitle, state.meetingDate, state.meetingLocation]);

  // Save meeting summary to database
  const saveMeetingSummary = useCallback(async ({ 
    title, 
    date, 
    location, 
    summary, 
    duration,
    audioBlobs 
  }: { 
    title: string, 
    date: string, 
    location: string, 
    summary: string, 
    duration: number,
    audioBlobs: Blob[] 
  }) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;
      
      const meetingId = uuidv4();
      
      // Save to database
      const { error } = await supabase.from('meetings').insert({
        id: meetingId,
        user_id: user.id,
        title,
        date,
        location,
        summary,
        duration,
        has_audio: audioBlobs.length > 0,
        language: 'en',
        created_at: new Date().toISOString()
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Meeting summary saved successfully!");
      
    } catch (error) {
      console.error("Error saving meeting:", error);
      toast("Failed to save meeting summary", {
        description: "There was an error saving your meeting data",
        variant: "destructive",
      });
    }
  }, []);

  // Load saved meetings
  const loadSavedMeetings = useCallback(async () => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data || [];
      
    } catch (error) {
      console.error("Error loading meetings:", error);
      toast("Failed to load meetings", {
        description: "There was an error retrieving your saved meetings",
        variant: "destructive",
      });
      return [];
    }
  }, []);

  // Delete a meeting
  const deleteMeeting = useCallback(async (meetingId: string) => {
    try {
      const { error } = await supabase
        .from('meetings')
        .delete()
        .eq('id', meetingId);
      
      if (error) {
        throw error;
      }
      
      toast.success("Meeting deleted successfully");
      return true;
      
    } catch (error) {
      console.error("Error deleting meeting:", error);
      toast("Failed to delete meeting", {
        description: "There was an error deleting the meeting",
        variant: "destructive",
      });
      return false;
    }
  }, []);

  // Copy summary to clipboard
  const copySummary = useCallback(async () => {
    if (!state.summary) return;
    
    try {
      await navigator.clipboard.writeText(state.summary);
      toast.success("Summary copied to clipboard");
    } catch (error) {
      console.error("Error copying text:", error);
      toast.error("Failed to copy. Please try again.");
    }
  }, [state.summary]);

  // Download audio recording
  const downloadAudio = useCallback(async () => {
    if (!state.audioBlobs) return;
    
    setIsDownloadingAudio(true);
    
    try {
      // Combine all audio blobs into one file
      const combinedBlob = new Blob(state.audioBlobs, { type: 'audio/webm' });
      
      // Create a download link
      const url = URL.createObjectURL(combinedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${state.meetingTitle || 'meeting'}_recording.webm`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      
      toast.success("Audio downloaded successfully");
      
    } catch (error) {
      console.error("Error downloading audio:", error);
      toast.error("Failed to download audio. Please try again.");
    } finally {
      setIsDownloadingAudio(false);
    }
  }, [state.audioBlobs, state.meetingTitle]);

  // Set meeting intake data
  const setIntakeData = useCallback((data: IntakeData) => {
    setState(prev => ({
      ...prev,
      meetingTitle: data.title,
      meetingDate: data.date,
      meetingLocation: data.location
    }));
  }, []);

  return {
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
  };
}
