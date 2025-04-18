
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
  audioStoragePath?: string | null;
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
  recordingError: null,
  audioStoragePath: null
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
  
  // Get current user ID
  const getCurrentUserId = () => {
    const { data: { user } } = supabase.auth.getUser();
    return user?.id || 'default-user';
  };
  
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
  
  const saveMeeting = async (summary: string, audioData: Blob | null) => {
    try {
      let audioStoragePath: string | undefined;

      // If audio data exists, upload to Supabase Storage
      if (audioData) {
        const fileExt = 'webm';
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${getCurrentUserId()}/meeting-recordings/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('meeting-recordings')
          .upload(filePath, audioData, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          throw uploadError;
        }

        audioStoragePath = filePath;
      }

      const newMeeting: SavedMeeting = {
        id: uuidv4(),
        title: summary.split('\n')[0].replace(/^#+\s*/, '').substring(0, 50) || 'Untitled Meeting',
        summary,
        date: new Date().toISOString(),
        duration: state.recordingTime,
        audioUrl: audioStoragePath ? 
          (await supabase.storage.from('meeting-recordings').getPublicUrl(audioStoragePath)).data.publicUrl 
          : undefined,
        audioStoragePath
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
  
  const deleteMeeting = async (id: string) => {
    try {
      // Find the meeting to get its audio storage path
      const meeting = storedMeetings.find(m => m.id === id);
      
      if (meeting?.audioStoragePath) {
        // Delete audio file from storage
        const { error: storageError } = await supabase.storage
          .from('meeting-recordings')
          .remove([meeting.audioStoragePath]);
        
        if (storageError) {
          console.error('Error deleting audio file:', storageError);
        }
      }

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

  const downloadAudio = async () => {
    if (state.audioData) {
      setIsDownloadingAudio(true);
      
      try {
        // If we have a storage path, download from Supabase
        if (state.audioStoragePath) {
          const { data, error } = await supabase.storage
            .from('meeting-recordings')
            .download(state.audioStoragePath);
          
          if (error) throw error;
          
          const url = URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = url;
          a.download = `meeting_recording_${new Date().toISOString().split('T')[0]}.webm`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          
          setTimeout(() => URL.revokeObjectURL(url), 100);
        } else {
          // Fallback to original blob method
          const url = URL.createObjectURL(state.audioData);
          const a = document.createElement('a');
          a.href = url;
          a.download = `meeting_recording_${new Date().toISOString().split('T')[0]}.webm`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          
          setTimeout(() => URL.revokeObjectURL(url), 100);
        }
        
        toast({
          title: 'Audio Downloaded',
          description: 'Meeting recording has been downloaded.',
        });
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

  // Start recording function
  const startRecording = async (supportsVoice: boolean, apiKeyStatus: string, apiKeyErrorDetails: string) => {
    if (!supportsVoice) {
      setState(prev => ({ ...prev, recordingError: 'Voice recording is not supported in your browser.' }));
      return;
    }

    if (apiKeyStatus !== 'valid') {
      setState(prev => ({ ...prev, recordingError: apiKeyErrorDetails || 'Voice API key is not valid.' }));
      return;
    }

    try {
      // Reset state
      setState(prev => ({
        ...prev,
        isRecording: true,
        recordingTime: 0,
        recordingError: null,
        transcribedText: '',
        audioData: null,
        summary: '',
        isSummarizing: false,
        detectedLocation: null,
        detectedAttendees: null,
        audioStoragePath: null
      }));

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Set up audio context for silence detection if enabled
      if (autoSilenceDetection) {
        audioContextRef.current = new AudioContext();
        silenceDetectorRef.current = createSilenceDetector(
          audioContextRef.current,
          stream,
          silenceThreshold
        );
      }

      // Initialize MediaRecorder
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      // Set up event handlers
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        try {
          // Create audio blob from chunks
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          setState(prev => ({ ...prev, audioData: audioBlob }));

          // Stop streams
          if (streamRef.current) {
            stopMediaTracks(streamRef.current);
          }
          
          // Close audio context
          if (audioContextRef.current) {
            audioContextRef.current.close();
          }

          // Prepare audio for transcription
          const base64Audio = await blobToBase64(audioBlob);

          // Call voice transcription API
          try {
            const response = await fetch('/api/ping', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                audio: base64Audio,
                language: selectedLanguage
              })
            });

            if (response.ok) {
              const data = await response.json();
              if (data.text) {
                // Post-process the transcription text
                const improvedText = improveTranscriptionAccuracy(data.text);
                setState(prev => ({ ...prev, transcribedText: improvedText }));
              } else {
                throw new Error('No transcription received');
              }
            } else {
              throw new Error('Error in voice processing');
            }
          } catch (error) {
            console.error('Transcription error:', error);
            setState(prev => ({ ...prev, recordingError: 'Error processing voice recording' }));
          }
        } catch (error) {
          console.error('Error processing recording:', error);
          setState(prev => ({ ...prev, recordingError: 'Error processing recording' }));
        }
      };

      // Start recording
      mediaRecorderRef.current.start();

      // Set up timer to track recording duration
      timerRef.current = window.setInterval(() => {
        setState(prev => {
          const newTime = prev.recordingTime + 1;
          
          // Check silence if enabled
          if (autoSilenceDetection && silenceDetectorRef.current && newTime > 3) {
            const isSilent = silenceDetectorRef.current.checkIfSilent();
            if (isSilent) {
              if (mediaRecorderRef.current) {
                mediaRecorderRef.current.stop();
                window.clearInterval(timerRef.current!);
              }
              return { ...prev, isRecording: false, recordingTime: newTime };
            }
          }
          
          // Check max duration
          if (maxRecordingDuration > 0 && newTime >= maxRecordingDuration) {
            if (mediaRecorderRef.current) {
              mediaRecorderRef.current.stop();
              window.clearInterval(timerRef.current!);
            }
            return { ...prev, isRecording: false, recordingTime: newTime };
          }
          
          return { ...prev, recordingTime: newTime };
        });
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      setState(prev => ({ 
        ...prev, 
        isRecording: false,
        recordingError: 'Could not access microphone. Please check permissions.' 
      }));
    }
  };

  // Stop recording function
  const stopRecording = () => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop();
      setState(prev => ({ ...prev, isRecording: false }));
      
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      
      if (streamRef.current) {
        stopMediaTracks(streamRef.current);
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    }
  };

  // Generate summary function
  const generateSummary = async () => {
    if (!state.transcribedText) {
      toast({
        title: 'No transcription available',
        description: 'Please record a meeting first.',
        variant: 'destructive',
      });
      return;
    }

    setState(prev => ({ ...prev, isSummarizing: true }));

    try {
      const response = await fetch('/api/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: state.transcribedText,
          type: 'summary'
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.summary) {
          // Detect location and attendees from the transcribed text
          const detectedLocation = detectLocationFromText(state.transcribedText);
          const detectedAttendees = detectAttendeesFromText(state.transcribedText);
          
          setState(prev => ({
            ...prev,
            summary: data.summary,
            detectedLocation,
            detectedAttendees,
            isSummarizing: false
          }));
        } else {
          throw new Error('No summary received');
        }
      } else {
        throw new Error('Error generating summary');
      }
    } catch (error) {
      console.error('Summary error:', error);
      setState(prev => ({ ...prev, isSummarizing: false }));
      toast({
        title: 'Error',
        description: 'Failed to generate meeting summary.',
        variant: 'destructive',
      });
    }
  };

  // Copy summary function
  const copySummary = () => {
    if (state.summary) {
      navigator.clipboard.writeText(state.summary).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        
        toast({
          title: 'Copied',
          description: 'Meeting summary copied to clipboard.',
        });
      }).catch(err => {
        console.error('Failed to copy:', err);
        toast({
          title: 'Copy Failed',
          description: 'Could not copy to clipboard.',
          variant: 'destructive',
        });
      });
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
