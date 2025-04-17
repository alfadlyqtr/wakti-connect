
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
      
      // Save meeting to history
      const meetingId = uuidv4();
      
      // Convert audioBlob to base64 string for storage
      let audioBase64 = null;
      if (state.audioData) {
        const reader = new FileReader();
        await new Promise<void>((resolve) => {
          reader.onloadend = () => {
            audioBase64 = reader.result?.toString().split(',')[1] || null;
            resolve();
          };
          reader.readAsDataURL(state.audioData);
        });
      }
      
      // Auto-detect title from context
      const titleMatch = data.summary.match(/^# (.+?)$/m) || 
                        data.summary.match(/^## (.+?)$/m) ||
                        data.summary.match(/\*\*(.+?)\*\*/);
      const autoDetectedTitle = titleMatch ? titleMatch[1].trim() : "Meeting Summary";
      
      // Save to local storage
      const newMeeting: SavedMeeting = {
        id: meetingId,
        title: autoDetectedTitle,
        date: new Date().toISOString(),
        summary: data.summary,
        duration: state.recordingTime || recordingDuration,
        location: data.location,
        audioData: audioBase64
      };
      
      const existingMeetings = JSON.parse(localStorage.getItem('savedMeetings') || '[]');
      const updatedMeetings = [newMeeting, ...existingMeetings].slice(0, 20); // Keep only 20 most recent
      localStorage.setItem('savedMeetings', JSON.stringify(updatedMeetings));
      setSavedMeetings(updatedMeetings);
      
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

  // Load saved meetings from local storage
  const loadSavedMeetings = useCallback(() => {
    setIsLoadingHistory(true);
    try {
      const meetings = JSON.parse(localStorage.getItem('savedMeetings') || '[]');
      setSavedMeetings(meetings);
    } catch (err) {
      console.error('Error loading saved meetings:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);
  
  // Delete a saved meeting
  const deleteMeeting = useCallback(async (meetingId: string) => {
    try {
      const meetings = JSON.parse(localStorage.getItem('savedMeetings') || '[]');
      const updatedMeetings = meetings.filter((m: SavedMeeting) => m.id !== meetingId);
      localStorage.setItem('savedMeetings', JSON.stringify(updatedMeetings));
      setSavedMeetings(updatedMeetings);
    } catch (err) {
      console.error('Error deleting meeting:', err);
      throw err;
    }
  }, []);
  
  // Update meeting title
  const updateMeetingTitle = useCallback(async (meetingId: string, title: string) => {
    try {
      const meetings = JSON.parse(localStorage.getItem('savedMeetings') || '[]');
      const updatedMeetings = meetings.map((m: SavedMeeting) => 
        m.id === meetingId ? { ...m, title: title || "Untitled Meeting" } : m
      );
      localStorage.setItem('savedMeetings', JSON.stringify(updatedMeetings));
      setSavedMeetings(updatedMeetings);
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
  const downloadAudio = useCallback(() => {
    if (!state.audioData) {
      toast({
        title: "No Audio Available",
        description: "There is no audio recording to download.",
        variant: "destructive"
      });
      return;
    }
    
    setIsDownloadingAudio(true);
    
    try {
      const url = URL.createObjectURL(state.audioData);
      const a = document.createElement('a');
      a.href = url;
      a.download = `meeting-recording-${new Date().toISOString().slice(0, 10)}.webm`;
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
        description: "Failed to download audio recording.",
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
