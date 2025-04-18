
import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useSupabaseClient } from '@/integrations/supabase/client';
// Import local types rather than relying on potentially missing modules
import { useVoiceSettings } from '@/store/voiceSettings';

// Create stub types to replace the missing ones
interface IntakeFormData {
  title?: string;
  date?: string;
  location?: string;
  attendees?: string[];
}

interface MeetingPart {
  partNumber: number;
  duration: number;
  audioBlob?: Blob;
}

interface MeetingSummaryState {
  isRecording: boolean;
  recordingTime: number;
  recordingError: string | null;
  meetingParts: MeetingPart[];
  audioBlobs: Blob[] | null;
  transcribedText: string;
  isSummarizing: boolean;
  isSaving: boolean;
  isTranscribing: boolean;
  summary: string | null;
  detectedLocation: string | null;
  detectedAttendees: string[] | null;
  intakeData: IntakeFormData | null;
}

export const useMeetingSummaryV2 = () => {
  const supabase = useSupabaseClient();
  const voiceSettings = useVoiceSettings();
  const [state, setState] = useState<MeetingSummaryState>({
    isRecording: false,
    recordingTime: 0,
    recordingError: null,
    meetingParts: [],
    audioBlobs: null,
    transcribedText: '',
    isSummarizing: false,
    isSaving: false,
    isTranscribing: false,
    summary: null,
    detectedLocation: null,
    detectedAttendees: null,
    intakeData: null,
  });

  const [isExporting, setIsExporting] = useState(false);
  const [isDownloadingAudio, setIsDownloadingAudio] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  
  const maxRecordingDuration = 2100; // 35 minutes in seconds
  const warnBeforeEndSeconds = 60; // Warn 60 seconds before end
  
  // Reset session state
  const resetSession = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop();
    }
    
    setState({
      isRecording: false,
      recordingTime: 0,
      recordingError: null,
      meetingParts: [],
      audioBlobs: null,
      transcribedText: '',
      isSummarizing: false,
      isSaving: false,
      isTranscribing: false,
      summary: null,
      detectedLocation: null,
      detectedAttendees: null,
      intakeData: null,
    });
    
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
  }, [state.isRecording]);
  
  // Start recording
  const startRecording = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, recordingError: null }));
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Set up MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setState(prev => ({ 
          ...prev, 
          isRecording: false,
          recordingError: 'Recording device error. Please check your microphone.'
        }));
        
        if (timerRef.current) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
      
      // Start recording
      mediaRecorder.start(1000); // Collect data every second
      
      // Start timer
      let recordingTime = 0;
      timerRef.current = window.setInterval(() => {
        recordingTime += 1;
        setState(prev => ({ ...prev, recordingTime }));
        
        // Auto-stop if reached max duration
        if (recordingTime >= maxRecordingDuration) {
          if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            
            if (timerRef.current) {
              window.clearInterval(timerRef.current);
              timerRef.current = null;
            }
            
            setState(prev => ({ 
              ...prev, 
              isRecording: false,
              recordingError: 'Maximum recording duration reached.'
            }));
          }
        }
      }, 1000);
      
      setState(prev => ({ ...prev, isRecording: true, recordingTime: 0 }));
    } catch (error) {
      console.error('Error starting recording:', error);
      
      // Handle common errors
      let errorMessage = 'Unknown error starting recording.';
      
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          errorMessage = 'Microphone access denied. Please allow microphone access.';
        } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
          errorMessage = 'No microphone found. Please connect a microphone.';
        } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
          errorMessage = 'Microphone is busy or not readable. Please close other apps using the microphone.';
        }
      }
      
      setState(prev => ({ ...prev, recordingError: errorMessage }));
    }
  }, [maxRecordingDuration]);
  
  // Stop recording and process audio
  const stopRecording = useCallback(async () => {
    if (!mediaRecorderRef.current || !state.isRecording) {
      return;
    }
    
    // Stop media recorder
    mediaRecorderRef.current.stop();
    
    // Stop timer
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Collect recorded audio data
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    
    // Create a new meeting part
    const newPart: MeetingPart = {
      partNumber: state.meetingParts.length + 1,
      duration: state.recordingTime,
      audioBlob
    };
    
    // Update state
    setState(prev => ({
      ...prev,
      isRecording: false,
      recordingTime: 0,
      meetingParts: [...prev.meetingParts, newPart],
      audioBlobs: [...(prev.audioBlobs || []), audioBlob],
    }));
    
    // Clear device access
    const tracks = mediaRecorderRef.current.stream.getTracks();
    tracks.forEach(track => track.stop());
    
    // Reset for next recording
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
    
    // Auto-transcribe if we have audio
    if (audioBlob.size > 0) {
      try {
        setState(prev => ({ ...prev, isTranscribing: true }));
        
        // Here we'd call the transcription API
        // This is simplified for the example
        toast({
          title: "Starting transcription...",
          description: "This may take a few moments.",
          duration: 3000,
        });
        
        // Simulate transcription for now 
        // In a real app, replace with actual API call
        setTimeout(() => {
          setState(prev => ({ 
            ...prev, 
            isTranscribing: false,
            transcribedText: prev.transcribedText + 
              (prev.transcribedText ? '\n\n' : '') + 
              `[Part ${newPart.partNumber}]\nThis would contain the transcribed text from the audio recording.` 
          }));
        }, 3000);
      } catch (error) {
        console.error('Transcription error:', error);
        setState(prev => ({ ...prev, isTranscribing: false }));
        
        toast({
          title: "Transcription Error",
          description: "Failed to transcribe audio. Please try again.",
          variant: "destructive", // Changed from "warning" to valid "destructive"
        });
      }
    }
  }, [state.isRecording, state.meetingParts, state.recordingTime, state.audioBlobs]);
  
  // Start a new recording part
  const startNextPart = useCallback(async () => {
    try {
      // Start new recording
      await startRecording();
    } catch (error) {
      console.error('Error starting next part:', error);
      toast({
        title: "Error Starting Recording",
        description: "Failed to start the next recording part. Please try again.",
        variant: "destructive", // Changed from "warning" to valid "destructive"
      });
    }
  }, [startRecording]);
  
  // Generate meeting summary
  const generateSummary = useCallback(async () => {
    if (!state.transcribedText || state.isSummarizing) {
      return;
    }
    
    setState(prev => ({ ...prev, isSummarizing: true }));
    
    try {
      // Here we'd call the summarization API
      // For now, we'll simulate it
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockSummary = {
        summary: "This is a mock summary of the meeting. It would contain key points, action items, and important discussions.",
        location: state.intakeData?.location || "Meeting Room A",
        attendees: state.intakeData?.attendees || ["John Doe", "Jane Smith"]
      };
      
      setState(prev => ({
        ...prev,
        isSummarizing: false,
        summary: mockSummary.summary,
        detectedLocation: mockSummary.location,
        detectedAttendees: mockSummary.attendees
      }));
      
      // Save the meeting summary to the database
      if (supabase) {
        setState(prev => ({ ...prev, isSaving: true }));
        
        try {
          // Insert meeting record
          const { error } = await supabase.from('meetings').insert({
            user_id: (await supabase.auth.getUser()).data.user?.id,
            duration: state.meetingParts.reduce((total, part) => total + part.duration, 0),
            date: state.intakeData?.date || new Date().toISOString().split('T')[0],
            location: mockSummary.location,
            summary: mockSummary.summary,
            language: voiceSettings.language,
            title: state.intakeData?.title || `Meeting on ${new Date().toLocaleDateString()}`
          });
          
          if (error) throw error;
          
          toast({
            title: "Meeting Saved",
            description: "Your meeting summary has been saved.",
            duration: 3000,
          });
        } catch (error) {
          console.error('Error saving meeting:', error);
          toast({
            title: "Error Saving Meeting",
            description: "Failed to save your meeting summary. Please try again.",
            variant: "destructive",
          });
        } finally {
          setState(prev => ({ ...prev, isSaving: false }));
        }
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      setState(prev => ({ ...prev, isSummarizing: false }));
      
      toast({
        title: "Summarization Error",
        description: "Failed to generate meeting summary. Please try again.",
        variant: "destructive",
      });
    }
  }, [state.transcribedText, state.isSummarizing, state.intakeData, state.meetingParts, supabase, voiceSettings.language]);
  
  // Set intake form data
  const setIntakeData = useCallback((data: IntakeFormData) => {
    setState(prev => ({ ...prev, intakeData: data }));
  }, []);
  
  // Copy summary to clipboard
  const copySummary = useCallback(async () => {
    if (!state.summary) return;
    
    try {
      await navigator.clipboard.writeText(state.summary);
      toast({
        title: "Copied to Clipboard",
        description: "Meeting summary copied to clipboard.",
        duration: 2000,
      });
    } catch (error) {
      console.error('Failed to copy summary:', error);
      toast({
        title: "Copy Failed",
        description: "Failed to copy summary to clipboard. Try again.",
        variant: "destructive",
      });
    }
  }, [state.summary]);
  
  // Download audio recording
  const downloadAudio = useCallback(async () => {
    if (!state.audioBlobs || state.audioBlobs.length === 0) {
      return;
    }
    
    setIsDownloadingAudio(true);
    
    try {
      // Combine all audio parts
      const combinedBlob = new Blob(state.audioBlobs, { type: 'audio/webm' });
      
      // Create download link
      const url = URL.createObjectURL(combinedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `meeting_recording_${new Date().toISOString().slice(0, 10)}.webm`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Download Started",
        description: "Your meeting recording is being downloaded.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error downloading audio:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download meeting recording. Try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloadingAudio(false);
    }
  }, [state.audioBlobs]);
  
  // Load saved meetings
  const loadSavedMeetings = useCallback(async () => {
    if (!supabase) return [];
    
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error loading meetings:', error);
      toast({
        title: "Error Loading Meetings",
        description: "Failed to load your saved meetings. Please try again.",
        variant: "destructive", 
      });
      return [];
    }
  }, [supabase]);
  
  // Delete a meeting
  const deleteMeeting = useCallback(async (meetingId: string) => {
    if (!supabase) return false;
    
    try {
      const { error } = await supabase
        .from('meetings')
        .delete()
        .eq('id', meetingId);
      
      if (error) throw error;
      
      toast({
        title: "Meeting Deleted",
        description: "The meeting has been deleted.",
        duration: 3000,
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting meeting:', error);
      toast({
        title: "Error Deleting Meeting",
        description: "Failed to delete the meeting. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }, [supabase]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      
      if (mediaRecorderRef.current && state.isRecording) {
        mediaRecorderRef.current.stop();
        
        const tracks = mediaRecorderRef.current.stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [state.isRecording]);
  
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
};

export type { IntakeFormData };
