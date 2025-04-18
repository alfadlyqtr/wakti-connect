
import { useState, useRef, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useVoiceSettings } from '@/store/voiceSettings';
import { supabase } from '@/integrations/supabase/client';
import * as recordingUtils from '@/utils/audio/recordingUtils';
import { useAuth } from '@/hooks/useAuth';

export interface MeetingPart {
  partNumber: number;
  audioUrl: string;
  transcript: string;
  duration: number;
}

export interface MeetingData {
  id: string;
  title?: string;
  date: string;
  location?: string;
  attendees?: string[];
  duration: number;
  summary: string;
  transcript: string;
  audioUrls: string[];
  language: string;
}

export interface IntakeFormData {
  sessionType: 'business' | 'class' | 'custom' | 'auto';
  hostedBy?: string;
  location?: string;
  attendees?: string[];
  agenda?: string;
}

interface MeetingSummaryState {
  isRecording: boolean;
  recordingTime: number;
  isTranscribing: boolean;
  isSummarizing: boolean;
  meetingParts: MeetingPart[];
  transcribedText: string;
  summary: string;
  detectedLocation?: string;
  detectedAttendees?: string[];
  recordingError: string | null;
  isExporting: boolean;
  isDownloadingAudio: boolean;
  currentPart: number;
  meetingId: string | null;
  intakeData: IntakeFormData | null;
}

export function useMeetingSummaryV2() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { language } = useVoiceSettings();
  
  const [state, setState] = useState<MeetingSummaryState>({
    isRecording: false,
    recordingTime: 0,
    isTranscribing: false,
    isSummarizing: false,
    meetingParts: [],
    transcribedText: '',
    summary: '',
    detectedLocation: undefined,
    detectedAttendees: undefined,
    recordingError: null,
    isExporting: false,
    isDownloadingAudio: false,
    currentPart: 1,
    meetingId: null,
    intakeData: null,
  });
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const maxRecordingDuration = 3600; // 60 minutes in seconds
  const warnBeforeEndSeconds = 180; // 3 minutes warning
  const summaryRef = useRef<HTMLDivElement>(null);
  
  // State for managing multi-part recordings
  const sessionRef = useRef<{
    meetingId: string;
    userId: string;
    parts: number;
    startTime: Date;
  } | null>(null);
  
  // Start a new recording session
  const startRecording = useCallback(async () => {
    try {
      if (!user?.id) {
        toast({
          title: "Authentication required",
          description: "Please sign in to use the recording feature",
          variant: "destructive"
        });
        return;
      }
      
      setState(prev => ({
        ...prev,
        isRecording: true,
        recordingTime: 0,
        recordingError: null
      }));
      
      // Clear any previous audio chunks
      audioChunksRef.current = [];
      
      // Initialize session if this is a new recording
      if (!sessionRef.current) {
        sessionRef.current = recordingUtils.initializeRecordingSession(user.id);
        setState(prev => ({ 
          ...prev, 
          meetingId: sessionRef.current?.meetingId || null,
          currentPart: 1
        }));
      }
      
      // Start recording and get the MediaRecorder instance
      mediaRecorderRef.current = await recordingUtils.startRecording((blob) => {
        audioChunksRef.current.push(blob);
      });
      
      // Start timer
      let seconds = 0;
      timerIntervalRef.current = window.setInterval(() => {
        seconds += 1;
        setState(prev => ({ ...prev, recordingTime: seconds }));
        
        // Show warning when approaching max duration
        if (seconds === maxRecordingDuration - warnBeforeEndSeconds) {
          toast({
            title: "Recording time limit approaching",
            description: "You have 3 minutes left before the current recording ends",
            variant: "warning"
          });
        }
        
        // Auto-stop when max duration is reached
        if (seconds >= maxRecordingDuration) {
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
          }
          stopRecording();
        }
      }, 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      setState(prev => ({
        ...prev,
        isRecording: false,
        recordingError: error instanceof Error ? error.message : 'Could not access microphone'
      }));
      
      toast({
        title: "Recording failed",
        description: "Could not access your microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  }, [user, toast]);
  
  // Stop the current recording and process the audio
  const stopRecording = useCallback(async () => {
    if (!mediaRecorderRef.current || !sessionRef.current) return;
    
    try {
      // Stop the timer
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      
      setState(prev => ({ 
        ...prev, 
        isRecording: false,
        isTranscribing: true 
      }));
      
      // Stop the media recorder and get all tracks
      await recordingUtils.stopRecording(mediaRecorderRef.current);
      
      // Combine all chunks into a single blob
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      console.log(`Recording complete. Audio size: ${audioBlob.size} bytes`);
      
      if (audioBlob.size === 0) {
        throw new Error('No audio data recorded');
      }
      
      // Get session info
      const { userId, meetingId, parts } = sessionRef.current;
      const currentPart = parts + 1; // Increment for this part
      sessionRef.current.parts = currentPart;
      
      // Upload the audio blob to Supabase Storage
      const audioUrl = await recordingUtils.uploadAudioToStorage(
        audioBlob,
        userId,
        meetingId,
        currentPart
      );
      
      if (!audioUrl) {
        throw new Error('Failed to upload audio recording');
      }
      
      // Get a signed URL for the API to access
      const signedUrl = await recordingUtils.getSignedUrl(
        userId,
        meetingId,
        currentPart
      );
      
      if (!signedUrl) {
        throw new Error('Failed to get secure access to the recording');
      }
      
      // Transcribe the audio
      const transcriptionResult = await recordingUtils.transcribeAudio(
        signedUrl,
        language
      );
      
      if (!transcriptionResult) {
        throw new Error('Transcription failed');
      }
      
      // Update state with new part info
      setState(prev => {
        const newPart: MeetingPart = {
          partNumber: currentPart,
          audioUrl: audioUrl,
          transcript: transcriptionResult.text,
          duration: prev.recordingTime,
        };
        
        // Combine all parts' transcripts
        const allTranscripts = [
          ...prev.meetingParts.map(part => part.transcript),
          transcriptionResult.text
        ].join('\n\n');
        
        return {
          ...prev,
          isTranscribing: false,
          meetingParts: [...prev.meetingParts, newPart],
          transcribedText: allTranscripts,
          currentPart: currentPart + 1, // Prepare for next part
        };
      });
      
      // Save to database
      await saveMeetingPart(
        meetingId,
        userId,
        currentPart,
        audioUrl,
        transcriptionResult.text,
        state.recordingTime,
        language
      );
      
      toast({
        title: "Transcription complete",
        description: "Your recording has been successfully transcribed.",
      });
      
    } catch (error) {
      console.error('Error processing recording:', error);
      setState(prev => ({
        ...prev,
        isTranscribing: false,
        recordingError: error instanceof Error ? error.message : 'Failed to process recording'
      }));
      
      toast({
        title: "Processing failed",
        description: "There was an error processing your recording. Please try again.",
        variant: "destructive"
      });
    }
  }, [state.recordingTime, language, toast]);
  
  // Save meeting part to database
  const saveMeetingPart = async (
    meetingId: string,
    userId: string,
    partNumber: number,
    audioUrl: string,
    transcript: string,
    duration: number,
    language: string
  ) => {
    try {
      // First check if the meeting exists
      const { data: existingMeeting } = await supabase
        .from('meetings')
        .select('id')
        .eq('id', meetingId)
        .single();
      
      if (!existingMeeting) {
        // Create the meeting if it doesn't exist
        const today = new Date().toISOString().split('T')[0];
        
        const { error: createError } = await supabase
          .from('meetings')
          .insert({
            id: meetingId,
            user_id: userId,
            duration: duration,
            date: today,
            summary: '',
            has_audio: true,
            language: language,
            title: state.intakeData?.sessionType === 'auto' 
              ? 'Auto-detected Meeting' 
              : `${state.intakeData?.sessionType || 'Meeting'} Recording`,
            location: state.intakeData?.location || null,
          });
        
        if (createError) throw createError;
      } else {
        // Update the meeting duration (sum of all parts)
        const { data: parts } = await supabase
          .from('meeting_parts')
          .select('duration')
          .eq('meeting_id', meetingId);
        
        const totalDuration = (parts || []).reduce(
          (sum, part) => sum + (part.duration || 0), 
          duration
        );
        
        const { error: updateError } = await supabase
          .from('meetings')
          .update({ duration: totalDuration })
          .eq('id', meetingId);
        
        if (updateError) throw updateError;
      }
      
      // Save this part
      const { error: partError } = await supabase
        .from('meeting_parts')
        .insert({
          meeting_id: meetingId,
          part_number: partNumber,
          audio_url: audioUrl,
          transcript: transcript,
          duration: duration,
        });
      
      if (partError) throw partError;
      
    } catch (error) {
      console.error('Error saving meeting to database:', error);
      // We don't want to break the user experience if database save fails
      // Just log it and let the app continue
    }
  };
  
  // Start a new part of the same meeting
  const startNextPart = useCallback(() => {
    if (!sessionRef.current) return;
    
    // Clear audio chunks for the new part
    audioChunksRef.current = [];
    
    setState(prev => ({
      ...prev,
      recordingTime: 0,
    }));
    
    // Start recording again
    startRecording();
    
  }, [startRecording]);
  
  // Generate summary from transcribed text
  const generateSummary = useCallback(async () => {
    if (!state.transcribedText || state.transcribedText.trim().length === 0) {
      toast({
        title: "No transcript available",
        description: "Please record a meeting first before generating a summary.",
        variant: "destructive"
      });
      return;
    }
    
    setState(prev => ({ ...prev, isSummarizing: true }));
    
    try {
      const summary = await recordingUtils.generateMeetingSummary(
        state.transcribedText,
        language
      );
      
      if (!summary) {
        throw new Error('Failed to generate summary');
      }
      
      // Extract possible location and attendees from transcript
      const meetingDetails = recordingUtils.extractMeetingDetails(state.transcribedText);
      
      setState(prev => ({
        ...prev,
        isSummarizing: false,
        summary,
        detectedLocation: meetingDetails.detectedLocation || state.intakeData?.location,
        detectedAttendees: meetingDetails.detectedAttendees || state.intakeData?.attendees,
      }));
      
      // Save summary to database if we have a meeting ID
      if (sessionRef.current?.meetingId) {
        const { error } = await supabase
          .from('meetings')
          .update({ 
            summary,
            location: meetingDetails.detectedLocation || state.intakeData?.location || null,
          })
          .eq('id', sessionRef.current.meetingId);
        
        if (error) {
          console.error('Error saving summary to database:', error);
        }
      }
      
      toast({
        title: "Summary generated",
        description: "Your meeting summary is ready.",
      });
      
    } catch (error) {
      console.error('Error generating summary:', error);
      setState(prev => ({ ...prev, isSummarizing: false }));
      
      toast({
        title: "Summary generation failed",
        description: "There was an error generating your meeting summary. Please try again.",
        variant: "destructive"
      });
    }
  }, [state.transcribedText, state.intakeData, language, toast]);
  
  // Copy summary to clipboard
  const copySummary = useCallback(() => {
    if (!state.summary) return;
    
    try {
      navigator.clipboard.writeText(state.summary);
      toast({
        title: "Copied to clipboard",
        description: "Meeting summary copied to clipboard.",
      });
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard. Please try again.",
        variant: "destructive"
      });
    }
  }, [state.summary, toast]);
  
  // Download audio files
  const downloadAudio = useCallback(async () => {
    if (state.meetingParts.length === 0) return;
    
    setState(prev => ({ ...prev, isDownloadingAudio: true }));
    
    try {
      // For each part, create a download link
      const downloadPromises = state.meetingParts.map(async (part, index) => {
        try {
          // Fetch the blob
          const response = await fetch(part.audioUrl);
          const blob = await response.blob();
          
          // Create URL and trigger download
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `meeting_recording_part_${index + 1}.webm`;
          document.body.appendChild(a);
          a.click();
          
          // Clean up
          setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }, 100);
          
          return true;
        } catch (error) {
          console.error(`Error downloading part ${index + 1}:`, error);
          return false;
        }
      });
      
      await Promise.all(downloadPromises);
      
      toast({
        title: "Download complete",
        description: `Downloaded ${state.meetingParts.length} audio recording(s).`,
      });
    } catch (error) {
      console.error('Error downloading audio:', error);
      toast({
        title: "Download failed",
        description: "Could not download audio recordings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setState(prev => ({ ...prev, isDownloadingAudio: false }));
    }
  }, [state.meetingParts, toast]);
  
  // Set intake form data
  const setIntakeData = useCallback((data: IntakeFormData | null) => {
    setState(prev => ({ ...prev, intakeData: data }));
  }, []);
  
  // Reset the recording session completely
  const resetSession = useCallback(() => {
    // Stop any ongoing recording
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    
    // Clear the timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    
    // Reset all state
    setState({
      isRecording: false,
      recordingTime: 0,
      isTranscribing: false,
      isSummarizing: false,
      meetingParts: [],
      transcribedText: '',
      summary: '',
      detectedLocation: undefined,
      detectedAttendees: undefined,
      recordingError: null,
      isExporting: false,
      isDownloadingAudio: false,
      currentPart: 1,
      meetingId: null,
      intakeData: null,
    });
    
    // Clear refs
    audioChunksRef.current = [];
    mediaRecorderRef.current = null;
    sessionRef.current = null;
  }, []);
  
  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  // Load saved meetings from database
  const loadSavedMeetings = useCallback(async () => {
    if (!user?.id) return [];
    
    try {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error loading saved meetings:', error);
      return [];
    }
  }, [user]);
  
  // Delete a meeting
  const deleteMeeting = useCallback(async (meetingId: string) => {
    if (!user?.id) return false;
    
    try {
      // Delete meeting parts first (foreign key constraint)
      const { error: partsError } = await supabase
        .from('meeting_parts')
        .delete()
        .eq('meeting_id', meetingId);
      
      if (partsError) throw partsError;
      
      // Then delete the meeting
      const { error } = await supabase
        .from('meetings')
        .delete()
        .eq('id', meetingId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "Meeting deleted",
        description: "The meeting and all recordings have been deleted.",
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting meeting:', error);
      
      toast({
        title: "Delete failed",
        description: "Could not delete the meeting. Please try again.",
        variant: "destructive"
      });
      
      return false;
    }
  }, [user, toast]);
  
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
    isExporting: state.isExporting,
    isDownloadingAudio: state.isDownloadingAudio,
  };
}
