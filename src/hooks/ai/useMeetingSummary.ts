
import { useState, useRef, useCallback, useEffect } from 'react';
import { useVoiceInteraction } from './useVoiceInteraction';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

export interface SavedMeeting {
  id: string;
  title: string;
  date: string;
  summary: string;
  duration: number;
  location: string | null;
  audioData: string | null;
}

interface MeetingSummaryState {
  isRecording: boolean;
  recordingTime: number;
  transcribedText: string;
  summary: string;
  isSummarizing: boolean;
  recordingError: string | null;
  audioData: Blob | null;
  detectedLocation: string | null;
}

export const useMeetingSummary = () => {
  // State for the meeting summary
  const [state, setState] = useState<MeetingSummaryState>({
    isRecording: false,
    recordingTime: 0,
    transcribedText: '',
    summary: '',
    isSummarizing: false,
    recordingError: null,
    audioData: null,
    detectedLocation: null
  });

  // Reference to the summary text for copying
  const summaryRef = useRef<HTMLDivElement>(null);
  
  // History state
  const [savedMeetings, setSavedMeetings] = useState<SavedMeeting[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  // Export/download state
  const [isExporting, setIsExporting] = useState(false);
  const [isDownloadingAudio, setIsDownloadingAudio] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Language settings
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  
  // Audio recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  // Voice interaction hook
  const {
    startListening,
    stopListening,
    transcript,
    isListening,
    recordingDuration,
    supportsVoice,
    error: voiceError
  } = useVoiceInteraction({
    maxDuration: 3600, // 1 hour max recording
    continuousListening: true,
  });
  
  // Start recording
  const startRecording = useCallback(() => {
    // Reset state
    setState(prev => ({
      ...prev,
      isRecording: true,
      recordingTime: 0,
      transcribedText: '',
      summary: '',
      recordingError: null,
      audioData: null,
      detectedLocation: null
    }));
    
    audioChunksRef.current = [];
    
    // Start audio recording
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          
          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              audioChunksRef.current.push(event.data);
            }
          };
          
          mediaRecorder.start(100);
          startListening();
        })
        .catch(err => {
          console.error('Error accessing microphone:', err);
          setState(prev => ({
            ...prev,
            isRecording: false,
            recordingError: 'Failed to access microphone. Please check permissions.'
          }));
        });
    } else {
      setState(prev => ({
        ...prev,
        isRecording: false,
        recordingError: 'Your browser does not support audio recording.'
      }));
    }
  }, [startListening]);
  
  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      
      // Stop all tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      // Combine audio chunks into a single blob
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      setState(prev => ({
        ...prev,
        isRecording: false,
        audioData: audioBlob,
        transcribedText: transcript
      }));
    }
    
    stopListening();
  }, [stopListening, transcript]);
  
  // Generate summary
  const generateSummary = useCallback(async () => {
    if (!state.transcribedText) {
      toast({
        title: "No transcript",
        description: "Please record a meeting first to generate a summary.",
        variant: "destructive"
      });
      return;
    }
    
    setState(prev => ({ ...prev, isSummarizing: true }));
    
    try {
      // Call AI meeting summary edge function
      const { data, error } = await supabase.functions.invoke('ai-meeting-summary', {
        body: { 
          text: state.transcribedText,
          duration: state.recordingTime || recordingDuration,
          language: selectedLanguage 
        }
      });
      
      if (error) {
        throw new Error(`Summary generation failed: ${error.message}`);
      }
      
      if (!data || !data.summary) {
        throw new Error('Failed to generate summary');
      }
      
      // Save to state
      setState(prev => ({
        ...prev,
        summary: data.summary,
        detectedLocation: data.location || null,
        isSummarizing: false
      }));
      
      // Auto-detect title from context
      const titleMatch = data.summary.match(/^# (.+?)$/m) || 
                        data.summary.match(/^## (.+?)$/m) ||
                        data.summary.match(/\*\*(.+?)\*\*/);
      const autoDetectedTitle = titleMatch ? titleMatch[1].trim() : "Meeting Summary";
      
      // Save to Supabase
      await saveMeetingToSupabase(data.summary, state.recordingTime || recordingDuration, autoDetectedTitle, data.location, state.audioData);
      
      toast({
        title: "Summary Generated",
        description: "Your meeting summary is ready.",
      });
    } catch (err) {
      console.error('Error generating summary:', err);
      setState(prev => ({ ...prev, isSummarizing: false }));
      
      toast({
        title: "Summary Error",
        description: err instanceof Error ? err.message : "Failed to generate summary",
        variant: "destructive"
      });
    }
  }, [state.transcribedText, state.recordingTime, state.audioData, recordingDuration, selectedLanguage]);

  // Save meeting to Supabase
  const saveMeetingToSupabase = async (
    summary: string, 
    duration: number, 
    title: string,
    location: string | null,
    audioData: Blob | null
  ) => {
    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Fall back to localStorage if no authenticated user
        const meetingId = uuidv4();
        
        // Convert audioBlob to base64 string for storage
        let audioBase64 = null;
        if (audioData) {
          const reader = new FileReader();
          await new Promise<void>((resolve) => {
            reader.onloadend = () => {
              audioBase64 = reader.result?.toString().split(',')[1] || null;
              resolve();
            };
            reader.readAsDataURL(audioData);
          });
        }
        
        const newMeeting: SavedMeeting = {
          id: meetingId,
          title,
          date: new Date().toISOString(),
          summary,
          duration,
          location,
          audioData: audioBase64
        };
        
        const existingMeetings = JSON.parse(localStorage.getItem('savedMeetings') || '[]');
        const updatedMeetings = [newMeeting, ...existingMeetings].slice(0, 20); 
        localStorage.setItem('savedMeetings', JSON.stringify(updatedMeetings));
        setSavedMeetings(updatedMeetings);
        return;
      }
      
      // Upload audio to storage bucket if available
      let audioUrl = null;
      if (audioData) {
        const fileName = `${user.id}/${new Date().toISOString()}-recording.webm`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('meeting_recordings')
          .upload(fileName, audioData);
          
        if (uploadError) {
          console.error('Error uploading audio:', uploadError);
        } else if (uploadData) {
          audioUrl = uploadData.path;
        }
      }
      
      // Insert meeting record into database
      const { data, error } = await supabase
        .from('meetings')
        .insert({
          user_id: user.id,
          summary,
          duration,
          date: new Date().toISOString(),
          location,
        })
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      // Reload meetings after adding new one
      loadSavedMeetings();
      
    } catch (err) {
      console.error('Error saving meeting to Supabase:', err);
      toast({
        title: "Error Saving Meeting",
        description: "Your meeting was generated but could not be saved to the database.",
        variant: "destructive"
      });
    }
  };

  // Load saved meetings from Supabase or localStorage
  const loadSavedMeetings = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Fall back to localStorage if no authenticated user
        const localMeetings = JSON.parse(localStorage.getItem('savedMeetings') || '[]');
        setSavedMeetings(localMeetings);
        return;
      }
      
      // Fetch meetings from Supabase
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      // Transform data to match SavedMeeting interface
      const meetings: SavedMeeting[] = data.map((meeting) => ({
        id: meeting.id,
        title: meeting.title || "Meeting Summary",
        date: meeting.date,
        summary: meeting.summary,
        duration: meeting.duration,
        location: meeting.location,
        audioData: null // We'll load audio separately when needed
      }));
      
      setSavedMeetings(meetings);
      
    } catch (err) {
      console.error('Error loading saved meetings:', err);
      // Fall back to localStorage
      try {
        const localMeetings = JSON.parse(localStorage.getItem('savedMeetings') || '[]');
        setSavedMeetings(localMeetings);
      } catch (e) {
        setSavedMeetings([]);
      }
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);
  
  // Delete a saved meeting
  const deleteMeeting = useCallback(async (meetingId: string) => {
    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Handle localStorage deletion
        const meetings = JSON.parse(localStorage.getItem('savedMeetings') || '[]');
        const updatedMeetings = meetings.filter((m: SavedMeeting) => m.id !== meetingId);
        localStorage.setItem('savedMeetings', JSON.stringify(updatedMeetings));
        setSavedMeetings(updatedMeetings);
        return;
      }
      
      // Delete from Supabase
      const { error } = await supabase
        .from('meetings')
        .delete()
        .eq('id', meetingId);
        
      if (error) {
        throw error;
      }
      
      // Update local state
      setSavedMeetings(prevMeetings => 
        prevMeetings.filter(meeting => meeting.id !== meetingId)
      );
      
    } catch (err) {
      console.error('Error deleting meeting:', err);
      throw err;
    }
  }, []);
  
  // Update meeting title
  const updateMeetingTitle = useCallback(async (meetingId: string, title: string) => {
    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Handle localStorage update
        const meetings = JSON.parse(localStorage.getItem('savedMeetings') || '[]');
        const updatedMeetings = meetings.map((m: SavedMeeting) => 
          m.id === meetingId ? { ...m, title: title || "Untitled Meeting" } : m
        );
        localStorage.setItem('savedMeetings', JSON.stringify(updatedMeetings));
        setSavedMeetings(updatedMeetings);
        return;
      }
      
      // Update in Supabase
      const { error } = await supabase
        .from('meetings')
        .update({ title: title || "Untitled Meeting" })
        .eq('id', meetingId);
        
      if (error) {
        throw error;
      }
      
      // Update local state
      setSavedMeetings(prevMeetings => 
        prevMeetings.map(meeting => 
          meeting.id === meetingId 
            ? { ...meeting, title: title || "Untitled Meeting" } 
            : meeting
        )
      );
      
    } catch (err) {
      console.error('Error updating meeting title:', err);
      throw err;
    }
  }, []);
  
  // Copy summary to clipboard
  const copySummary = useCallback(() => {
    if (summaryRef.current) {
      const range = document.createRange();
      range.selectNode(summaryRef.current);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
      document.execCommand('copy');
      window.getSelection()?.removeAllRanges();
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: "Copied to clipboard",
        description: "The summary has been copied to your clipboard."
      });
    }
  }, []);
  
  // Download audio recording
  const downloadAudio = useCallback(async (meetingId?: string) => {
    setIsDownloadingAudio(true);
    
    try {
      let audioToDownload = state.audioData;
      let fileName = `meeting-recording-${new Date().toISOString().slice(0, 10)}.webm`;
      
      // If meetingId is provided, fetch from Supabase
      if (meetingId) {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          // Try to get from localStorage
          const meetings = JSON.parse(localStorage.getItem('savedMeetings') || '[]');
          const meeting = meetings.find((m: SavedMeeting) => m.id === meetingId);
          
          if (meeting && meeting.audioData) {
            // Convert base64 to blob
            const binaryAudio = atob(meeting.audioData);
            const bytes = new Uint8Array(binaryAudio.length);
            for (let i = 0; i < binaryAudio.length; i++) {
              bytes[i] = binaryAudio.charCodeAt(i);
            }
            audioToDownload = new Blob([bytes], { type: 'audio/webm' });
            fileName = `meeting-recording-${new Date(meeting.date).toISOString().slice(0, 10)}.webm`;
          } else {
            throw new Error('No audio available for this meeting');
          }
        } else {
          // Get meeting from Supabase to find the recording path
          const { data: meetingData, error: meetingError } = await supabase
            .from('meetings')
            .select('*')
            .eq('id', meetingId)
            .single();
            
          if (meetingError || !meetingData) {
            throw new Error('Could not find meeting data');
          }
          
          // Get the audio file from storage
          const storagePath = `${user.id}/${new Date(meetingData.date).toISOString()}-recording.webm`;
          const { data: audioData, error: audioError } = await supabase.storage
            .from('meeting_recordings')
            .download(storagePath);
            
          if (audioError || !audioData) {
            throw new Error('Could not download audio recording');
          }
          
          audioToDownload = audioData;
          fileName = `meeting-recording-${new Date(meetingData.date).toISOString().slice(0, 10)}.webm`;
        }
      } else if (!audioToDownload) {
        throw new Error('No audio recording available');
      }
      
      // Create and trigger download
      const url = URL.createObjectURL(audioToDownload);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download Started",
        description: "Your audio recording is being downloaded."
      });
    } catch (err) {
      console.error('Error downloading audio:', err);
      toast({
        title: "Download Error",
        description: err instanceof Error ? err.message : "Failed to download audio recording",
        variant: "destructive"
      });
    } finally {
      setIsDownloadingAudio(false);
    }
  }, [state.audioData]);
  
  // Update recording time from voice interaction hook
  useEffect(() => {
    if (isListening) {
      setState(prev => ({ 
        ...prev, 
        isRecording: true,
        recordingTime: recordingDuration 
      }));
    }
    
    if (voiceError) {
      setState(prev => ({ 
        ...prev, 
        recordingError: voiceError.message 
      }));
    }
    
    // Update transcript as it comes in
    if (isListening && transcript) {
      setState(prev => ({
        ...prev,
        transcribedText: transcript
      }));
    }
  }, [isListening, recordingDuration, transcript, voiceError]);
  
  // Load saved meetings when component mounts
  useEffect(() => {
    loadSavedMeetings();
  }, [loadSavedMeetings]);
  
  return {
    state,
    isDownloadingAudio,
    savedMeetings,
    isLoadingHistory,
    isExporting,
    setIsExporting,
    selectedLanguage,
    setSelectedLanguage,
    copied,
    summaryRef,
    loadSavedMeetings,
    startRecording,
    stopRecording,
    generateSummary,
    copySummary,
    downloadAudio,
    deleteMeeting,
    updateMeetingTitle,
    supportsVoice
  };
};
