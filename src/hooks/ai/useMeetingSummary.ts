import { useState, useRef, useEffect } from 'react';
import { useVoiceSettings } from '@/store/voiceSettings';
import { improveTranscriptionAccuracy, detectLocationFromText, detectAttendeesFromText } from '@/utils/text/transcriptionUtils';
import { blobToBase64, createSilenceDetector, stopMediaTracks } from '@/utils/audio/audioProcessing';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { v4 as uuidv4 } from 'uuid';
import { SavedMeeting } from '@/components/ai/tools/meeting-summary/SavedMeetingsList';
import { useSession } from 'next-auth/react';

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
  const { data: session } = useSession();
  const auth = {
    uid: () => session?.user?.email || 'default-user'
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
        const filePath = `${auth.uid()}/meeting-recordings/${fileName}`;

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
