import { useState, useRef, useCallback, useEffect } from 'react';
import { useVoiceInteraction } from './useVoiceInteraction';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useVoiceSettings } from '@/store/voiceSettings';

// Type for meeting state
interface MeetingState {
  isRecording: boolean;
  recordingTime: number;
  transcribedText: string;
  summary: string;
  isSummarizing: boolean;
  audioData: string | null;
  detectedLocation: string | null;
  detectedAttendees: string | null;
  detectedActionItems: string | null;
  recordingError: string | null;
}

// Type for saved meeting
export interface SavedMeeting {
  id: string;
  title: string;
  date: string;
  summary: string;
  duration: number;
  audioData?: string | null;
}

export const useMeetingSummary = () => {
  // Get language from voice settings store
  const { language, setLanguage } = useVoiceSettings();

  // State for meeting data
  const [state, setState] = useState<MeetingState>({
    isRecording: false,
    recordingTime: 0,
    transcribedText: '',
    summary: '',
    isSummarizing: false,
    audioData: null,
    detectedLocation: null,
    detectedAttendees: null,
    detectedActionItems: null,
    recordingError: null
  });
  
  // States for UI management
  const [isExporting, setIsExporting] = useState(false);
  const [isDownloadingAudio, setIsDownloadingAudio] = useState(false);
  const [savedMeetings, setSavedMeetings] = useState<SavedMeeting[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(language || 'en');
  const [copied, setCopied] = useState(false);
  
  // Update voice settings store when language changes
  useEffect(() => {
    setLanguage(selectedLanguage as any);
  }, [selectedLanguage, setLanguage]);
  
  // Ref for summary display
  const summaryRef = useRef<HTMLDivElement>(null);
  
  // Audio data ref to store recording
  const audioDataRef = useRef<string | null>(null);
  
  // Custom hooks
  const { 
    isListening, 
    startListening, 
    stopListening, 
    transcript,
    recordingDuration,
    supportsVoice,
    error,
    audioBase64,
    processAudioWithFallbacks
  } = useVoiceInteraction({
    onTranscriptComplete: (text, audioData) => {
      console.log("Transcript complete with audio data length:", audioData?.length || 0);
      audioDataRef.current = audioData || null;
      
      setState(prev => ({ 
        ...prev, 
        transcribedText: text,
        isRecording: false,
        audioData: audioData || null
      }));
    },
    maxDuration: 2700, // 45 minutes max
    language: selectedLanguage
  });
  
  // Start recording
  const startRecording = useCallback((browserSupportsVoice: boolean) => {
    if (!browserSupportsVoice) {
      setState(prev => ({
        ...prev,
        recordingError: 'Your browser does not support voice recording'
      }));
      return;
    }
    
    // Reset state
    setState(prev => ({
      ...prev,
      isRecording: true,
      recordingError: null,
      transcribedText: '',
      summary: '',
      audioData: null,
      detectedLocation: null,
      detectedAttendees: null,
      detectedActionItems: null
    }));
    
    audioDataRef.current = null;
    
    // Start voice recording
    startListening();
    
    toast({
      title: "Recording Started",
      description: "Your meeting is now being recorded.",
    });
  }, [startListening]);
  
  // Stop recording
  const stopRecording = useCallback(() => {
    stopListening();
    
    setState(prev => ({
      ...prev,
      isRecording: false,
      recordingTime: recordingDuration
    }));
    
    toast({
      title: "Recording Stopped",
      description: "Processing your meeting audio...",
    });
  }, [stopListening, recordingDuration]);
  
  // Generate meeting summary
  const generateSummary = useCallback(async () => {
    if (!state.transcribedText) {
      toast({
        title: "No Text Available",
        description: "Please record a meeting first to generate a summary.",
        variant: "destructive"
      });
      return;
    }
    
    setState(prev => ({ ...prev, isSummarizing: true }));
    
    try {
      console.log("Generating summary with audio data:", !!audioDataRef.current);
      
      // Call AI function to summarize
      const { data, error } = await supabase.functions.invoke('ai-meeting-summary', {
        body: {
          text: state.transcribedText,
          duration: state.recordingTime,
          audioData: audioDataRef.current,
          language: selectedLanguage
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!data || !data.summary) {
        throw new Error("No summary was generated");
      }
      
      setState(prev => ({ 
        ...prev, 
        summary: data.summary,
        detectedLocation: data.location || null,
        detectedAttendees: data.attendees || null,
        detectedActionItems: data.actionItems || null,
        audioData: audioDataRef.current
      }));
      
      // Save to history
      saveToHistory(data.summary, audioDataRef.current);
      
      toast({
        title: "Summary Generated",
        description: "Your meeting summary is ready.",
      });
    } catch (err) {
      console.error("Error generating summary:", err);
      toast({
        title: "Summary Error",
        description: err instanceof Error ? err.message : "Failed to generate summary",
        variant: "destructive"
      });
    } finally {
      setState(prev => ({ ...prev, isSummarizing: false }));
    }
  }, [state.transcribedText, state.recordingTime, selectedLanguage]);
  
  // Copy summary to clipboard
  const copySummary = useCallback(() => {
    if (!state.summary) return;
    
    navigator.clipboard.writeText(state.summary);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
    
    toast({
      title: "Copied",
      description: "Summary copied to clipboard",
    });
  }, [state.summary]);
  
  // Download audio recording
  const downloadAudio = useCallback(() => {
    const audioData = state.audioData || audioDataRef.current;
    
    if (!audioData) {
      toast({
        title: "No Audio Available",
        description: "Audio recording is not available.",
        variant: "destructive"
      });
      return;
    }
    
    setIsDownloadingAudio(true);
    
    try {
      // Create a link to download the audio - converting string to Blob
      const binaryAudio = atob(audioData);
      const bytes = new Uint8Array(binaryAudio.length);
      for (let i = 0; i < binaryAudio.length; i++) {
        bytes[i] = binaryAudio.charCodeAt(i);
      }
      const audioBlob = new Blob([bytes], { type: 'audio/webm' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(audioBlob);
      link.download = `meeting-recording-${new Date().toISOString().slice(0, 10)}.webm`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: "Your audio recording is being downloaded.",
      });
    } catch (err) {
      console.error("Error downloading audio:", err);
      toast({
        title: "Download Error",
        description: "Failed to download audio recording.",
        variant: "destructive"
      });
    } finally {
      setIsDownloadingAudio(false);
    }
  }, [state.audioData]);
  
  // Save meeting to history
  const saveToHistory = useCallback((summary: string, audioData: string | null) => {
    const newMeeting: SavedMeeting = {
      id: crypto.randomUUID(),
      title: `Meeting on ${new Date().toLocaleDateString()}`,
      date: new Date().toISOString(),
      summary,
      duration: state.recordingTime,
      audioData: audioData
    };
    
    // Add to state
    setSavedMeetings(prev => [newMeeting, ...prev]);
    
    // Save to localStorage
    const existingMeetings = JSON.parse(localStorage.getItem('savedMeetings') || '[]');
    localStorage.setItem('savedMeetings', JSON.stringify([newMeeting, ...existingMeetings]));
  }, [state.recordingTime]);
  
  // Load saved meetings from localStorage
  const loadSavedMeetings = useCallback(() => {
    setIsLoadingHistory(true);
    
    try {
      const savedMeetingsData = localStorage.getItem('savedMeetings');
      
      if (savedMeetingsData) {
        const meetings = JSON.parse(savedMeetingsData);
        setSavedMeetings(meetings);
      }
    } catch (err) {
      console.error("Error loading saved meetings:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);
  
  // Load saved language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('meetingSummaryLanguage');
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
    }
  }, []);
  
  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem('meetingSummaryLanguage', selectedLanguage);
  }, [selectedLanguage]);
  
  // Effects from voice interaction hook
  useEffect(() => {
    if (error) {
      setState(prev => ({
        ...prev,
        recordingError: error.message
      }));
    }
  }, [error]);
  
  // Keep recording time in sync
  useEffect(() => {
    if (isListening) {
      setState(prev => ({
        ...prev,
        recordingTime: recordingDuration
      }));
    }
  }, [recordingDuration, isListening]);
  
  // Keep audio data in sync
  useEffect(() => {
    if (audioBase64) {
      audioDataRef.current = audioBase64;
    }
  }, [audioBase64]);
  
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
    downloadAudio,
    loadSavedMeetings
  };
};
