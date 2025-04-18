
import { useState, useCallback, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from '@/components/ui/use-toast';
import { useVoiceSettings } from '@/store/voiceSettings';
import { useVoiceInteraction } from './useVoiceInteraction';
import { addDays } from 'date-fns';

interface MeetingSummaryState {
  isRecording: boolean;
  transcribedText: string;
  isSummarizing: boolean;
  summary: string;
  recordingTime: number;
  recordingError: string | null;
  audioData: Blob | null;
  detectedLocation: string | null;
  detectedAttendees: string[] | null;
}

export const useMeetingSummary = () => {
  const [state, setState] = useState<MeetingSummaryState>({
    isRecording: false,
    transcribedText: '',
    isSummarizing: false,
    summary: '',
    recordingTime: 0,
    recordingError: null,
    audioData: null,
    detectedLocation: null,
    detectedAttendees: null
  });

  const [isExporting, setIsExporting] = useState(false);
  const [isDownloadingAudio, setIsDownloadingAudio] = useState(false);
  const [savedMeetings, setSavedMeetings] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [copied, setCopied] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  const loadSavedMeetings = async () => {
    try {
      setIsLoadingHistory(true);
      const { data: meetings, error } = await supabase
        .from('meetings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Process the meetings to add expiration date (30 days from creation)
      const processedMeetings = meetings?.map(meeting => ({
        ...meeting,
        expiresAt: addDays(new Date(meeting.created_at), 30).toISOString()
      })) || [];
      
      setSavedMeetings(processedMeetings);
    } catch (error) {
      console.error('Error loading meetings:', error);
      toast({
        title: 'Error loading meetings',
        description: 'Could not load your meeting history',
        variant: 'destructive'
      });
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const deleteMeeting = async (id: string) => {
    try {
      const { error } = await supabase
        .from('meetings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setSavedMeetings(prev => prev.filter(meeting => meeting.id !== id));
      
      toast({
        title: 'Meeting deleted',
        description: 'The meeting summary has been removed',
      });
    } catch (error) {
      console.error('Error deleting meeting:', error);
      toast({
        title: 'Error',
        description: 'Could not delete the meeting',
        variant: 'destructive'
      });
    }
  };

  const updateMeetingTitle = async (id: string, newTitle: string) => {
    try {
      const { error } = await supabase
        .from('meetings')
        .update({ title: newTitle })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setSavedMeetings(prev => prev.map(meeting => 
        meeting.id === id ? { ...meeting, title: newTitle } : meeting
      ));

      toast({
        title: 'Title updated',
        description: 'Meeting title has been updated successfully',
      });
    } catch (error) {
      console.error('Error updating title:', error);
      toast({
        title: 'Error',
        description: 'Could not update the meeting title',
        variant: 'destructive'
      });
    }
  };

  const saveMeeting = async () => {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .insert({
          title: `Meeting ${new Date().toLocaleString()}`,
          summary: state.summary,
          date: new Date().toISOString(),
          duration: state.recordingTime,
          has_audio: !!state.audioData,
          language: selectedLanguage,
          location: state.detectedLocation || null,
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;

      // If there's audio data, upload it to storage
      if (state.audioData && data.id) {
        const audioPath = `recordings/${data.id}.webm`;
        const { error: uploadError } = await supabase.storage
          .from('meeting_recordings')
          .upload(audioPath, state.audioData);

        if (uploadError) throw uploadError;
      }

      // Add the new meeting to local state with expiration date
      const newMeeting = {
        ...data,
        expiresAt: addDays(new Date(), 30).toISOString()
      };
      
      setSavedMeetings(prev => [newMeeting, ...prev]);

      toast({
        title: 'Meeting saved',
        description: 'The meeting summary has been saved successfully',
      });
    } catch (error) {
      console.error('Error saving meeting:', error);
      toast({
        title: 'Error',
        description: 'Could not save the meeting summary',
        variant: 'destructive'
      });
    }
  };

  const { 
    autoSilenceDetection, 
    silenceThreshold,
    maxRecordingDuration
  } = useVoiceSettings();
  
  const { 
    supportsVoice,
    apiKeyStatus,
    apiKeyErrorDetails,
    startListening,
    stopListening
  } = useVoiceInteraction({
    continuousListening: false,
    onTranscriptComplete: (finalTranscript) => {
      setState(prevState => ({
        ...prevState,
        transcribedText: prevState.transcribedText + ' ' + finalTranscript
      }));
    }
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startRecordingHook = useCallback(async () => {
    if (!supportsVoice) {
      toast({
        title: 'Error',
        description: 'Voice recording is not supported in your browser.',
        variant: 'destructive',
      });
      return;
    }

    if (apiKeyStatus !== 'valid') {
      toast({
        title: 'Error',
        description: apiKeyErrorDetails || 'Invalid API key. Please check your settings.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);

        setState(prevState => ({
          ...prevState,
          audioData: audioBlob
        }));

        URL.revokeObjectURL(audioUrl);
      };

      recorder.start();
      setState(prevState => ({ ...prevState, isRecording: true, recordingError: null }));
      startListening();

      // Start the timer
      let startTime = Date.now();
      timerRef.current = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const recordingTimeInSeconds = Math.floor(elapsedTime / 1000);
        setState(prevState => ({ ...prevState, recordingTime: recordingTimeInSeconds }));

        if (recordingTimeInSeconds >= maxRecordingDuration) {
          stopRecording();
          toast({
            title: 'Recording stopped',
            description: 'Maximum recording duration reached.',
          });
        }
      }, 1000);

    } catch (err: any) {
      console.error("Error starting recording:", err);
      setState(prevState => ({ ...prevState, recordingError: err.message, isRecording: false }));
      toast({
        title: 'Error',
        description: 'Failed to start recording. Please check your microphone permissions.',
        variant: 'destructive',
      });
    }
  }, [apiKeyErrorDetails, apiKeyStatus, maxRecordingDuration, startListening, supportsVoice]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    stopListening();
    clearInterval(timerRef.current as NodeJS.Timeout);
    timerRef.current = null;
    setState(prevState => ({ ...prevState, isRecording: false }));
  }, [stopListening]);

  const generateSummary = useCallback(async () => {
    if (!state.transcribedText) {
      toast({
        title: 'Error',
        description: 'No text to summarize. Please record a meeting first.',
        variant: 'destructive',
      });
      return;
    }

    setState(prevState => ({ ...prevState, isSummarizing: true, summary: '' }));

    try {
      const { data, error } = await supabase.functions.invoke('ai-summarize-text', {
        body: { text: state.transcribedText, language: selectedLanguage }
      });

      if (error) {
        throw error;
      }

      setState(prevState => ({
        ...prevState,
        summary: data.summary,
        detectedLocation: data.location,
        detectedAttendees: data.attendees
      }));
      saveMeeting();
    } catch (err: any) {
      console.error("Error generating summary:", err);
      toast({
        title: 'Error',
        description: 'Failed to generate summary. Please try again.',
        variant: 'destructive',
      });
      setState(prevState => ({ ...prevState, summary: 'Failed to generate summary.' }));
    } finally {
      setState(prevState => ({ ...prevState, isSummarizing: false }));
    }
  }, [selectedLanguage, state.transcribedText]);

  const copySummary = useCallback(() => {
    if (state.summary) {
      navigator.clipboard.writeText(state.summary)
        .then(() => {
          setCopied(true);
          toast({
            title: 'Summary copied',
            description: 'The summary has been copied to your clipboard.',
          });
          setTimeout(() => setCopied(false), 3000);
        })
        .catch(err => {
          console.error("Failed to copy summary:", err);
          toast({
            title: 'Error',
            description: 'Failed to copy summary to clipboard.',
            variant: 'destructive',
          });
        });
    }
  }, [state.summary]);

  const downloadAudio = useCallback(async () => {
    if (!state.audioData) {
      toast({
        title: 'Error',
        description: 'No audio available to download.',
        variant: 'destructive',
      });
      return;
    }

    setIsDownloadingAudio(true);
    try {
      const url = URL.createObjectURL(state.audioData);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'meeting_recording.webm';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading audio:', error);
      toast({
        title: 'Error',
        description: 'Failed to download audio.',
        variant: 'destructive',
      });
    } finally {
      setIsDownloadingAudio(false);
    }
  }, [state.audioData]);

  const downloadSavedAudio = useCallback(async (meetingId: string) => {
    try {
      setIsDownloadingAudio(true);
      
      // Get the audio file from storage
      const { data, error } = await supabase.storage
        .from('meeting_recordings')
        .download(`recordings/${meetingId}.webm`);
        
      if (error) throw error;
      
      // Create a download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `meeting_recording_${meetingId}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Download complete',
        description: 'The meeting audio has been downloaded.',
      });
    } catch (error) {
      console.error('Error downloading saved audio:', error);
      toast({
        title: 'Error',
        description: 'Failed to download saved audio.',
        variant: 'destructive',
      });
    } finally {
      setIsDownloadingAudio(false);
    }
  }, []);

  const selectMeeting = useCallback((meeting: any) => {
    setState(prevState => ({
      ...prevState,
      summary: meeting.summary,
      recordingTime: meeting.duration,
      detectedLocation: meeting.location,
      detectedAttendees: meeting.attendees,
      transcribedText: '', // Clear previous transcriptions
      audioData: null // Clear previous audio data
    }));
  }, []);

  return {
    state,
    setState,
    isExporting,
    setIsExporting,
    isDownloadingAudio,
    setIsDownloadingAudio,
    savedMeetings,
    setSavedMeetings,
    isLoadingHistory,
    setIsLoadingHistory,
    selectedLanguage,
    setSelectedLanguage,
    copied,
    setCopied,
    summaryRef,
    deleteMeeting,
    loadSavedMeetings,
    updateMeetingTitle,
    startRecording: startRecordingHook,
    stopRecording,
    generateSummary,
    copySummary,
    downloadAudio,
    downloadSavedAudio,
    selectMeeting
  };
};
