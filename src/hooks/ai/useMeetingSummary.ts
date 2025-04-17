
import { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { detectLocationFromText } from '@/utils/text/transcriptionUtils';

// Type for meeting state
interface MeetingState {
  isRecording: boolean;
  recordingTime: number;
  transcribedText: string;
  summary: string;
  isSummarizing: boolean;
  audioData: string | null;
  detectedLocation: string | null;
  recordingError: string | null;
  supportsVoice: boolean;
}

// Type for saved meeting
export interface SavedMeeting {
  id: string;
  title: string;
  date: string;
  summary: string;
  duration: number;
}

export const useMeetingSummary = () => {
  // State for meeting data
  const [state, setState] = useState<MeetingState>({
    isRecording: false,
    recordingTime: 0,
    transcribedText: '',
    summary: '',
    isSummarizing: false,
    audioData: null,
    detectedLocation: null,
    recordingError: null,
    supportsVoice: typeof window !== 'undefined' && 'MediaRecorder' in window
  });
  
  // States for UI management
  const [isExporting, setIsExporting] = useState(false);
  const [isDownloadingAudio, setIsDownloadingAudio] = useState(false);
  const [savedMeetings, setSavedMeetings] = useState<SavedMeeting[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [copied, setCopied] = useState(false);
  
  // Ref for summary display
  const summaryRef = useRef<HTMLDivElement>(null);
  
  // Refs for audio recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Start recording
  const startRecording = useCallback(async () => {
    if (!state.supportsVoice) {
      setState(prev => ({
        ...prev,
        recordingError: 'Your browser does not support voice recording'
      }));
      return;
    }
    
    try {
      // Reset state
      setState(prev => ({
        ...prev,
        isRecording: true,
        recordingError: null,
        recordingTime: 0,
        transcribedText: '',
        summary: '',
        audioData: null,
        detectedLocation: null
      }));
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          
          // Convert to base64 for storage and transmission
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = () => {
            const base64data = reader.result?.toString();
            if (base64data) {
              const audioBase64 = base64data.split(',')[1];
              setState(prev => ({ ...prev, audioData: audioBase64 }));
              
              // Process audio with transcription service
              processAudioTranscription(audioBase64);
            }
          };
        }
        
        // Release media stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };
      
      // Start recording
      mediaRecorder.start(100); // Collect chunks every 100ms
      
      // Start timer for recording duration
      let seconds = 0;
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      timerRef.current = setInterval(() => {
        seconds += 1;
        setState(prev => ({ ...prev, recordingTime: seconds }));
        
        // Auto-stop after 5 minutes
        if (seconds >= 300) {
          stopRecording();
        }
      }, 1000);
      
      toast({
        title: "Recording Started",
        description: "Your meeting is now being recorded.",
      });
    } catch (err) {
      console.error("Error starting recording:", err);
      setState(prev => ({
        ...prev,
        isRecording: false,
        recordingError: err instanceof Error ? err.message : 'Failed to access microphone'
      }));
      
      toast({
        title: "Recording Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  }, [state.supportsVoice]);
  
  // Stop recording
  const stopRecording = useCallback(() => {
    // Stop the timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Stop the MediaRecorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      // Clean up if MediaRecorder wasn't started properly
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
    
    setState(prev => ({
      ...prev,
      isRecording: false
    }));
    
    toast({
      title: "Recording Stopped",
      description: "Processing your meeting audio...",
    });
  }, []);
  
  // Process audio with transcription service
  const processAudioTranscription = async (audioBase64: string) => {
    try {
      setState(prev => ({ ...prev, transcribedText: 'Transcribing audio...' }));
      
      // Call Supabase function for transcription
      const { data, error } = await supabase.functions.invoke('voice-transcription', {
        body: { audio: audioBase64 }
      });
      
      if (error) {
        throw new Error(`Transcription error: ${error.message}`);
      }
      
      if (!data || !data.text) {
        throw new Error("No transcription received");
      }
      
      // Use utility to detect location in transcript
      const location = detectLocationFromText(data.text);
      
      setState(prev => ({
        ...prev,
        transcribedText: data.text,
        detectedLocation: location
      }));
      
      toast({
        title: "Transcription Complete",
        description: "Your meeting recording has been transcribed.",
      });
    } catch (err) {
      console.error("Transcription error:", err);
      
      setState(prev => ({
        ...prev,
        transcribedText: '',
        recordingError: err instanceof Error ? err.message : 'Failed to transcribe audio'
      }));
      
      toast({
        title: "Transcription Error",
        description: err instanceof Error ? err.message : "Failed to transcribe audio",
        variant: "destructive"
      });
    }
  };
  
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
      // Call AI function to summarize
      const { data, error } = await supabase.functions.invoke('ai-meeting-summary', {
        body: {
          text: state.transcribedText,
          duration: state.recordingTime,
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
        detectedLocation: data.location || prev.detectedLocation
      }));
      
      // Save to history
      saveToHistory(data.summary);
      
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
    if (!state.audioData) {
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
      const binaryAudio = atob(state.audioData);
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
  const saveToHistory = useCallback((summary: string) => {
    const newMeeting: SavedMeeting = {
      id: crypto.randomUUID(),
      title: `Meeting on ${new Date().toLocaleDateString()}`,
      date: new Date().toISOString(),
      summary,
      duration: state.recordingTime
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
