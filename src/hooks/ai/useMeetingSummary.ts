
import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useVoiceSettings } from '@/store/voiceSettings';
import jsPDF from 'jspdf';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { SavedMeeting } from '@/components/ai/tools/meeting-summary/SavedMeetingsList';

// Define state interface
interface MeetingSummaryState {
  isRecording: boolean;
  recordingTime: number;
  recordingError: string | null;
  transcribedText: string;
  isSummarizing: boolean;
  summary: string;
  detectedLocation: string | null;
  detectedAttendees: string[] | null;
  audioData: Blob | null;
}

export const useMeetingSummary = () => {
  // State for recording and processing
  const [state, setState] = useState<MeetingSummaryState>({
    isRecording: false,
    recordingTime: 0,
    recordingError: null,
    transcribedText: '',
    isSummarizing: false,
    summary: '',
    detectedLocation: null,
    detectedAttendees: null,
    audioData: null,
  });

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneStreamRef = useRef<MediaStream | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  // Voice settings from store
  const { silenceThreshold, maxRecordingDuration } = useVoiceSettings();

  // State for UI
  const [isExporting, setIsExporting] = useState(false);
  const [isDownloadingAudio, setIsDownloadingAudio] = useState(false);
  const [savedMeetings, setSavedMeetings] = useState<SavedMeeting[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [copied, setCopied] = useState(false);

  // Toast notifications
  const { toast } = useToast();

  // Load user's meeting history on component mount
  const loadSavedMeetings = async () => {
    setIsLoadingHistory(true);
    try {
      // Get the current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw userError;
      }
      
      const userId = userData.user?.id;
      
      if (!userId) {
        toast({
          title: "Authentication error",
          description: "Please sign in to view your meeting history",
          variant: "destructive"
        });
        setIsLoadingHistory(false);
        return;
      }

      // Fetch meetings from database
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform the data to match the SavedMeeting interface
      const formattedMeetings: SavedMeeting[] = data.map(meeting => ({
        id: meeting.id,
        title: meeting.title || 'Untitled Meeting',
        summary: meeting.summary,
        date: meeting.date,
        duration: meeting.duration,
        audioStoragePath: meeting.audio_storage_path
      }));

      setSavedMeetings(formattedMeetings);
    } catch (error) {
      console.error("Error loading meetings:", error);
      toast({
        title: "Error",
        description: "Failed to load your meeting history",
        variant: "destructive"
      });
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Start recording function
  const startRecording = async (
    supportsVoice: boolean, 
    apiKeyStatus: 'valid' | 'invalid' | 'checking' | 'unchecked', 
    apiKeyErrorDetails: string | null
  ) => {
    // Reset state for new recording
    setState(prev => ({
      ...prev,
      isRecording: false,
      recordingTime: 0,
      recordingError: null,
      transcribedText: '',
      summary: '',
      detectedLocation: null,
      detectedAttendees: null,
      audioData: null
    }));

    // Check if voice is supported
    if (!supportsVoice) {
      setState(prev => ({
        ...prev,
        recordingError: "Your browser doesn't support voice recording. Please use Chrome, Edge, or Safari."
      }));
      return;
    }

    // Check API key status
    if (apiKeyStatus === 'invalid') {
      setState(prev => ({
        ...prev,
        recordingError: apiKeyErrorDetails || "Voice API key validation failed."
      }));
      return;
    }

    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      microphoneStreamRef.current = stream;

      // Set up audio context and analyser for visualization
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      
      const analyser = audioContext.createAnalyser();
      analyserRef.current = analyser;
      
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      
      analyser.fftSize = 256;

      // Setup audio recording
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Handle audio data when available
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Start recording
      mediaRecorder.start(200);
      
      // Update state to recording
      setState(prev => ({ ...prev, isRecording: true }));

      // Set up timer for recording duration
      let recordedTime = 0;
      recordingIntervalRef.current = window.setInterval(() => {
        recordedTime += 1;
        
        // Check if max recording time reached
        if (maxRecordingDuration && recordedTime >= maxRecordingDuration) {
          stopRecording();
          return;
        }
        
        setState(prev => ({ ...prev, recordingTime: recordedTime }));
      }, 1000);

    } catch (error) {
      console.error("Error starting recording:", error);
      setState(prev => ({
        ...prev,
        recordingError: "Error accessing microphone. Please ensure you've granted permission."
      }));
    }
  };

  // Stop recording function
  const stopRecording = async () => {
    // Clear recording interval
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }

    // Stop animation frame if active
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Stop media recorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      
      // Wait for recorder to finish
      await new Promise<void>((resolve) => {
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.onstop = () => resolve();
        } else {
          resolve();
        }
      });
    }

    // Clean up microphone stream
    if (microphoneStreamRef.current) {
      microphoneStreamRef.current.getTracks().forEach(track => track.stop());
      microphoneStreamRef.current = null;
    }

    // Clean up audio context
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      await audioContextRef.current.close();
      audioContextRef.current = null;
      analyserRef.current = null;
    }

    // Process recorded audio
    if (audioChunksRef.current.length > 0) {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      // Transcribe audio
      try {
        setState(prev => ({ ...prev, isRecording: false }));
        
        // Create FormData for API request
        const formData = new FormData();
        formData.append('file', audioBlob, 'recording.webm');
        formData.append('language', selectedLanguage);
        
        // Call transcription API
        const response = await fetch('https://sqdjqehcxpzsudhzjwbu.functions.supabase.co/voice-transcription', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error(`Transcription failed: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        setState(prev => ({
          ...prev,
          transcribedText: result.text || '',
          audioData: audioBlob
        }));
        
      } catch (error) {
        console.error("Error transcribing audio:", error);
        toast({
          title: "Transcription Error",
          description: "Failed to transcribe your recording. Please try again.",
          variant: "destructive"
        });
        
        setState(prev => ({
          ...prev,
          isRecording: false,
          recordingError: "Failed to transcribe audio."
        }));
      }
    } else {
      setState(prev => ({
        ...prev,
        isRecording: false,
        recordingError: "No audio was recorded."
      }));
    }
  };

  // Generate summary from transcribed text
  const generateSummary = async () => {
    if (!state.transcribedText || state.transcribedText.trim() === '') {
      toast({
        title: "Error",
        description: "No transcribed text to summarize.",
        variant: "destructive"
      });
      return;
    }

    setState(prev => ({ ...prev, isSummarizing: true }));

    try {
      // Call AI summary API
      const response = await fetch('https://sqdjqehcxpzsudhzjwbu.functions.supabase.co/ai-meeting-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: state.transcribedText,
          language: selectedLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error(`Summarization failed: ${response.statusText}`);
      }

      const result = await response.json();

      // Update state with summary results
      setState(prev => ({
        ...prev,
        summary: result.summary || '',
        detectedLocation: result.location || null,
        detectedAttendees: result.attendees || null,
        isSummarizing: false
      }));

      // Save the meeting to database if we have a summary
      if (result.summary) {
        await saveMeeting(result.summary, result.location, result.attendees);
      }

    } catch (error) {
      console.error("Error generating summary:", error);
      toast({
        title: "Summarization Error",
        description: "Failed to summarize the meeting. Please try again.",
        variant: "destructive"
      });
      setState(prev => ({ ...prev, isSummarizing: false }));
    }
  };

  // Save meeting to database
  const saveMeeting = async (
    summary: string,
    location: string | null,
    attendees: string[] | null
  ) => {
    try {
      // Get the current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw userError;
      }
      
      const userId = userData.user?.id;
      
      if (!userId) {
        toast({
          title: "Authentication error",
          description: "Please sign in to save meetings",
          variant: "destructive"
        });
        return;
      }

      // Format current date
      const date = new Date().toISOString();
      
      // Create a unique filename for the audio
      const audioPath = state.audioData ? `${userId}/${uuidv4()}.webm` : null;

      // Upload audio file to storage if available
      if (state.audioData && audioPath) {
        const { error: uploadError } = await supabase.storage
          .from('meeting-recordings')
          .upload(audioPath, state.audioData);

        if (uploadError) {
          console.error("Error uploading audio:", uploadError);
          // Continue even if audio upload fails
        }
      }

      // Insert meeting record
      const { data, error } = await supabase
        .from('meetings')
        .insert({
          user_id: userId,
          title: "Meeting on " + new Date().toLocaleDateString(),
          summary: summary,
          date: date,
          duration: state.recordingTime,
          location: location,
          language: selectedLanguage,
          has_audio: !!state.audioData,
          audio_storage_path: audioPath
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Refresh meeting list
      loadSavedMeetings();

      toast({
        title: "Success",
        description: "Meeting summary saved successfully",
      });

    } catch (error) {
      console.error("Error saving meeting:", error);
      toast({
        title: "Error",
        description: "Failed to save meeting summary",
        variant: "destructive"
      });
    }
  };

  // Copy summary to clipboard
  const copySummary = () => {
    if (!state.summary) return;
    
    // Create temporary element to extract text without HTML formatting
    const tempElement = document.createElement('div');
    tempElement.innerHTML = state.summary;
    const textToCopy = tempElement.textContent || tempElement.innerText || '';
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({
          title: "Copied",
          description: "Summary copied to clipboard",
        });
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        toast({
          title: "Error",
          description: "Failed to copy text to clipboard",
          variant: "destructive"
        });
      });
  };

  // Download audio recording
  const downloadAudio = async () => {
    setIsDownloadingAudio(true);
    
    try {
      const selectedMeeting = savedMeetings.find(m => m.summary === state.summary);
      
      if (state.audioData) {
        // Direct download for current recording
        const url = URL.createObjectURL(state.audioData);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'meeting_recording.webm';
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else if (selectedMeeting?.audioStoragePath) {
        // Download from Supabase storage
        const { data, error } = await supabase.storage
          .from('meeting-recordings')
          .download(selectedMeeting.audioStoragePath);
          
        if (error) {
          throw error;
        }
        
        // Create download link
        const url = URL.createObjectURL(data);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'meeting_recording.webm';
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error("No audio available for download");
      }
      
      toast({
        title: "Success",
        description: "Audio downloaded successfully",
      });
    } catch (error) {
      console.error("Error downloading audio:", error);
      toast({
        title: "Download Error",
        description: "Failed to download audio recording",
        variant: "destructive"
      });
    } finally {
      setIsDownloadingAudio(false);
    }
  };

  // Delete meeting
  const deleteMeeting = async (meetingId: string) => {
    try {
      // Find the meeting to get the audio path
      const meetingToDelete = savedMeetings.find(m => m.id === meetingId);
      
      // Delete audio file from storage if it exists
      if (meetingToDelete?.audioStoragePath) {
        const { error: storageError } = await supabase.storage
          .from('meeting-recordings')
          .remove([meetingToDelete.audioStoragePath]);
          
        if (storageError) {
          console.error("Error deleting audio file:", storageError);
          // Continue with deletion even if file removal fails
        }
      }
      
      // Delete the meeting record
      const { error } = await supabase
        .from('meetings')
        .delete()
        .eq('id', meetingId);

      if (error) {
        throw error;
      }

      // Update local state
      setSavedMeetings(prev => prev.filter(meeting => meeting.id !== meetingId));

      toast({
        title: "Success",
        description: "Meeting deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting meeting:", error);
      toast({
        title: "Error",
        description: "Failed to delete meeting",
        variant: "destructive"
      });
    }
  };

  // Load meetings on component mount
  useEffect(() => {
    loadSavedMeetings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    state,
    isExporting,
    setIsExporting,
    isDownloadingAudio,
    savedMeetings,
    isLoadingHistory,
    selectedLanguage,
    setSelectedLanguage,
    copied,
    summaryRef,
    startRecording,
    stopRecording,
    generateSummary,
    copySummary,
    deleteMeeting,
    loadSavedMeetings,
    downloadAudio
  };
};
