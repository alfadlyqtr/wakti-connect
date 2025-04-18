import { useState, useRef, useEffect } from 'react';
import { useVoiceSettings } from '@/store/voiceSettings';
import { improveTranscriptionAccuracy, detectLocationFromText, detectAttendeesFromText } from '@/utils/text/transcriptionUtils';
import { blobToBase64, createSilenceDetector, stopMediaTracks } from '@/utils/audio/audioProcessing';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { v4 as uuidv4 } from 'uuid';
import { SavedMeeting } from '@/components/ai/tools/meeting-summary/SavedMeetingsList';

interface MeetingSummaryState {
  isRecording: boolean;
  recordingTime: number;
  transcribedText: string;
  audioData: Blob | null;
  summary: string;
  isSummarizing: boolean;
  detectedLocation: string | null;
  detectedAttendees: string[] | null;
  recordingError: string | null;
}

const initialState: MeetingSummaryState = {
  isRecording: false,
  recordingTime: 0,
  transcribedText: '',
  audioData: null,
  summary: '',
  isSummarizing: false,
  detectedLocation: null,
  detectedAttendees: null,
  recordingError: null
};

export const useMeetingSummary = () => {
  const { toast } = useToast();
  const { language: selectedLanguage, setLanguage, autoSilenceDetection, visualFeedback, silenceThreshold, maxRecordingDuration } = useVoiceSettings();
  const [state, setState] = useState<MeetingSummaryState>(initialState);
  const [isExporting, setIsExporting] = useState(false);
  const [isDownloadingAudio, setIsDownloadingAudio] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [savedMeetings, setSavedMeetings] = useState<SavedMeeting[]>([]);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const silenceDetectorRef = useRef<AnalyserNode | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  
  const [storedMeetings, setStoredMeetings] = useLocalStorage<SavedMeeting[]>('wakti-meeting-summaries', []);
  
  useEffect(() => {
    loadSavedMeetings();
  }, []);
  
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      if (streamRef.current) {
        stopMediaTracks(streamRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);
  
  const loadSavedMeetings = () => {
    setIsLoadingHistory(true);
    
    try {
      setSavedMeetings(storedMeetings);
    } catch (error) {
      console.error('Error loading saved meetings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load saved meetings.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingHistory(false);
    }
  };
  
  const saveMeeting = (summary: string, audioData: Blob | null) => {
    try {
      const newMeeting: SavedMeeting = {
        id: uuidv4(),
        title: summary.split('\n')[0].replace(/^#+\s*/, '').substring(0, 50) || 'Untitled Meeting',
        summary,
        date: new Date().toISOString(),
        duration: state.recordingTime,
        audioUrl: audioData ? URL.createObjectURL(audioData) : undefined
      };
      
      const updatedMeetings = [newMeeting, ...storedMeetings];
      setStoredMeetings(updatedMeetings);
      setSavedMeetings(updatedMeetings);
      
      toast({
        title: 'Success',
        description: 'Meeting summary saved.',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error saving meeting:', error);
      toast({
        title: 'Error',
        description: 'Failed to save meeting summary.',
        variant: 'destructive',
      });
    }
  };
  
  const deleteMeeting = (id: string) => {
    try {
      const updatedMeetings = storedMeetings.filter(meeting => meeting.id !== id);
      setStoredMeetings(updatedMeetings);
      setSavedMeetings(updatedMeetings);
      
      toast({
        title: 'Success',
        description: 'Meeting deleted.',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error deleting meeting:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete meeting.',
        variant: 'destructive',
      });
    }
  };
  
  const startRecording = async (supportsVoice: boolean, apiKeyStatus: string, apiKeyErrorDetails: string | null) => {
    setState(prev => ({ 
      ...prev, 
      isRecording: false, 
      recordingError: null 
    }));
    
    try {
      if (!supportsVoice) {
        setState(prev => ({ 
          ...prev, 
          recordingError: 'Your browser does not support voice recording. Please use Chrome, Edge, or Safari.' 
        }));
        return;
      }
      
      audioChunksRef.current = [];
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      streamRef.current = stream;
      
      if (autoSilenceDetection) {
        audioContextRef.current = new AudioContext();
        silenceDetectorRef.current = createSilenceDetector(
          audioContextRef.current,
          stream,
          silenceThreshold,
          (isSilent) => {
            if (isSilent) {
              console.log('Silence detected, stopping recording automatically');
              stopRecording();
            }
          }
        );
      }
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.onstart = () => {
        setState(prev => ({ ...prev, isRecording: true }));
        
        timerRef.current = window.setInterval(() => {
          setState(prev => {
            if (prev.recordingTime >= maxRecordingDuration - 1) {
              window.clearInterval(timerRef.current as number);
              stopRecording();
              return prev;
            }
            return { ...prev, recordingTime: prev.recordingTime + 1 };
          });
        }, 1000);
      };
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        if (timerRef.current) {
          window.clearInterval(timerRef.current);
        }
        
        if (streamRef.current) {
          stopMediaTracks(streamRef.current);
        }
        
        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }
        
        setState(prev => ({ ...prev, isRecording: false }));
        
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          setState(prev => ({ ...prev, audioData: audioBlob }));
          
          try {
            const base64Audio = await blobToBase64(audioBlob);
            await transcribeAudio(base64Audio);
          } catch (error) {
            console.error('Error processing recording:', error);
            setState(prev => ({ 
              ...prev, 
              recordingError: 'Failed to process recording. Please try again.' 
            }));
          }
        }
      };
      
      mediaRecorder.start(100);
      
      toast({
        title: 'Recording Started',
        description: 'Your voice is now being recorded.',
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      setState(prev => ({ 
        ...prev, 
        recordingError: 'Failed to access microphone. Please check permissions and try again.' 
      }));
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      
      toast({
        title: 'Recording Stopped',
        description: 'Processing your recording...',
      });
    }
  };
  
  const transcribeAudio = async (base64Audio: string) => {
    try {
      toast({
        title: 'Transcribing',
        description: 'Converting your speech to text...',
      });
      
      const { data, error } = await supabase.functions.invoke('voice-transcription', {
        body: { audio: base64Audio, language: selectedLanguage }
      });
      
      if (error) {
        throw new Error(`Transcription error: ${error.message}`);
      }
      
      if (data && data.text) {
        const improvedText = improveTranscriptionAccuracy(data.text, selectedLanguage);
        setState(prev => ({ ...prev, transcribedText: improvedText }));
        
        toast({
          title: 'Transcription Complete',
          description: 'Your speech has been converted to text.',
        });
      } else if (data && data.fallback) {
        setState(prev => ({ 
          ...prev, 
          recordingError: data.message || 'Transcription services unavailable. Please try again later.' 
        }));
      } else {
        throw new Error('No transcription received');
      }
    } catch (error) {
      console.error('Transcription error:', error);
      setState(prev => ({ 
        ...prev, 
        recordingError: error instanceof Error ? error.message : 'Failed to transcribe audio' 
      }));
      
      toast({
        title: 'Transcription Failed',
        description: 'Could not convert your speech to text. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const generateSummary = async () => {
    if (!state.transcribedText) {
      toast({
        title: 'No Text Available',
        description: 'Please record and transcribe some audio first.',
        variant: 'destructive',
      });
      return;
    }
    
    setState(prev => ({ ...prev, isSummarizing: true }));
    
    try {
      toast({
        title: 'Generating Summary',
        description: 'Creating your meeting summary...',
      });
      
      const { data, error } = await supabase.functions.invoke('ai-meeting-summary', {
        body: { text: state.transcribedText, language: selectedLanguage }
      });
      
      if (error) {
        throw new Error(`Summary generation error: ${error.message}`);
      }
      
      if (data && data.summary) {
        const detectedLocation = detectLocationFromText(state.transcribedText);
        const detectedAttendees = detectAttendeesFromText(state.transcribedText);
        
        setState(prev => ({ 
          ...prev, 
          summary: data.summary,
          detectedLocation,
          detectedAttendees,
          isSummarizing: false
        }));
        
        saveMeeting(data.summary, state.audioData);
        
        toast({
          title: 'Summary Complete',
          description: 'Your meeting summary is ready.',
        });
      } else {
        throw new Error('No summary received');
      }
    } catch (error) {
      console.error('Summary generation error:', error);
      setState(prev => ({ ...prev, isSummarizing: false }));
      
      toast({
        title: 'Summary Failed',
        description: 'Could not generate meeting summary. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const copySummary = () => {
    if (state.summary) {
      navigator.clipboard.writeText(state.summary);
      setCopied(true);
      
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: 'Summary Copied',
        description: 'Meeting summary copied to clipboard.',
      });
    }
  };
  
  const downloadAudio = () => {
    if (state.audioData) {
      setIsDownloadingAudio(true);
      
      try {
        const url = URL.createObjectURL(state.audioData);
        const a = document.createElement('a');
        a.href = url;
        a.download = `meeting_recording_${new Date().toISOString().split('T')[0]}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        toast({
          title: 'Audio Downloaded',
          description: 'Meeting recording has been downloaded.',
        });
        
        setTimeout(() => URL.revokeObjectURL(url), 100);
      } catch (error) {
        console.error('Error downloading audio:', error);
        toast({
          title: 'Download Failed',
          description: 'Could not download audio recording.',
          variant: 'destructive',
        });
      } finally {
        setIsDownloadingAudio(false);
      }
    }
  };
  
  return {
    state,
    isExporting,
    setIsExporting,
    isDownloadingAudio,
    savedMeetings,
    isLoadingHistory,
    selectedLanguage,
    setSelectedLanguage: setLanguage,
    copied,
    summaryRef,
    loadSavedMeetings,
    saveMeeting,
    deleteMeeting,
    startRecording,
    stopRecording,
    generateSummary,
    copySummary,
    downloadAudio
  };
};
