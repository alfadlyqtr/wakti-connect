import { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useVoiceInteraction } from './useVoiceInteraction';
import { MeetingContext, extractMeetingContext } from '@/utils/text/transcriptionUtils';

export interface SavedMeeting {
  id: string;
  date: string;
  summary: string;
  duration: number;
  title: string;
  location?: string;
}

export interface MeetingSummaryState {
  isRecording: boolean;
  recordingTime: number;
  recordingError: string | null;
  transcribedText: string;
  isSummarizing: boolean;
  summary: string;
  detectedLocation: string | null;
  audioData: Blob | null;
}

export const useMeetingSummary = () => {
  const [state, setState] = useState<MeetingSummaryState>({
    isRecording: false,
    recordingTime: 0,
    recordingError: null,
    transcribedText: '',
    isSummarizing: false,
    summary: '',
    detectedLocation: null,
    audioData: null,
  });

  const [savedMeetings, setSavedMeetings] = useState<SavedMeeting[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDownloadingAudio, setIsDownloadingAudio] = useState(false);
  const [copied, setCopied] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  const {
    startRecording: startVoiceRecording,
    stopRecording: stopVoiceRecording,
    transcribe,
    clearTranscript,
    recordingError,
    isTranscribing,
    audioData,
    supportsVoice,
    selectedLanguage,
    setSelectedLanguage
  } = useVoiceInteraction();

  useEffect(() => {
    if (recordingError) {
      setState(prevState => ({ ...prevState, recordingError }));
    }
  }, [recordingError]);

  useEffect(() => {
    if (audioData) {
      setState(prevState => ({ ...prevState, audioData }));
    }
  }, [audioData]);

  const startRecording = () => {
    setState(prevState => ({ ...prevState, isRecording: true, recordingTime: 0, recordingError: null }));
    startVoiceRecording();
  };

  const stopRecording = () => {
    setState(prevState => ({ ...prevState, isRecording: false }));
    stopVoiceRecording();
  };

  const generateSummary = useCallback(async () => {
    if (!state.transcribedText) {
      toast({
        title: "Nothing to summarize",
        description: "Please record a meeting or transcribe some text first.",
      });
      return;
    }

    setState(prevState => ({ ...prevState, isSummarizing: true }));

    try {
      const response = await fetch('/api/ai/meeting-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript: state.transcribedText, language: selectedLanguage }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setState(prevState => ({
        ...prevState,
        summary: data.summary,
        detectedLocation: data.location || null,
      }));
    } catch (error) {
      console.error("Error generating summary:", error);
      toast({
        title: "Summary failed",
        description: error instanceof Error ? error.message : "Failed to generate meeting summary.",
        variant: "destructive"
      });
    } finally {
      setState(prevState => ({ ...prevState, isSummarizing: false }));
    }
  }, [state.transcribedText, selectedLanguage]);

  const saveMeetingToSupabase = useCallback(async (title?: string) => {
    try {
      if (!state.summary) {
        return;
      }

      // Extract location from transcript if available
      const meetingContext = extractMeetingContext(state.transcribedText);
      
      // Determine title - use provided title, extract from transcript, or use default
      const meetingTitle = title || 
        (meetingContext?.title || 'Meeting Summary');

      // Save to Supabase
      const { data, error } = await supabase.from('meetings').insert({
        summary: state.summary,
        duration: state.recordingTime,
        date: new Date().toISOString(),
        location: meetingContext?.location || null,
        language: selectedLanguage,
        title: meetingTitle
      }).select();

      if (error) {
        throw new Error(error.message);
      }

      // Save audio data if available
      if (state.audioData) {
        const audioFile = new File(
          [state.audioData], 
          `meeting_${data[0].id}.webm`, 
          { type: 'audio/webm' }
        );

        const { error: uploadError } = await supabase.storage
          .from('meeting-recordings')
          .upload(`${data[0].id}.webm`, audioFile);

        if (uploadError) {
          console.error('Error uploading audio:', uploadError);
        }
      }

      toast({
        title: "Meeting saved",
        description: "Your meeting summary has been saved successfully.",
      });

      // Refresh the list of saved meetings
      loadSavedMeetings();
    } catch (error) {
      console.error('Error saving meeting:', error);
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Failed to save meeting summary.",
        variant: "destructive"
      });
    }
  }, [state.summary, state.transcribedText, state.recordingTime, state.audioData, selectedLanguage]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (state.isRecording) {
      intervalId = setInterval(() => {
        setState(prevState => ({ ...prevState, recordingTime: prevState.recordingTime + 1 }));
      }, 1000);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [state.isRecording]);

  useEffect(() => {
    if (isTranscribing && transcribe) {
      setState(prevState => ({ ...prevState, isSummarizing: true }));
      transcribe()
        .then(transcription => {
          setState(prevState => ({
            ...prevState,
            transcribedText: transcription,
          }));
        })
        .catch(error => {
          console.error("Transcription error:", error);
          toast({
            title: "Transcription failed",
            description: error instanceof Error ? error.message : "Failed to transcribe audio.",
            variant: "destructive"
          });
        })
        .finally(() => {
          setState(prevState => ({ ...prevState, isSummarizing: false }));
        });
    }
  }, [isTranscribing, transcribe]);

  const deleteMeeting = async (id: string) => {
    try {
      const { error } = await supabase
        .from('meetings')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      // Also remove the audio recording if it exists
      await supabase.storage
        .from('meeting-recordings')
        .remove([`${id}.webm`]);

      // Update local state
      setSavedMeetings(prevMeetings => 
        prevMeetings.filter(meeting => meeting.id !== id)
      );

      toast({
        title: "Meeting deleted",
        description: "The meeting has been removed successfully.",
      });
    } catch (error) {
      console.error('Error deleting meeting:', error);
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Failed to delete the meeting.",
        variant: "destructive"
      });
    }
  };

  const updateMeetingTitle = async (id: string, newTitle: string) => {
    try {
      const { error } = await supabase
        .from('meetings')
        .update({ title: newTitle })
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      // Update local state
      setSavedMeetings(prevMeetings => 
        prevMeetings.map(meeting => 
          meeting.id === id ? { ...meeting, title: newTitle } : meeting
        )
      );

      toast({
        title: "Title updated",
        description: "The meeting title has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating title:', error);
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update the meeting title.",
        variant: "destructive"
      });
    }
  };

  const copySummary = () => {
    if (state.summary && summaryRef.current) {
      navigator.clipboard.writeText(state.summary)
        .then(() => {
          setCopied(true);
          toast({
            title: "Summary copied",
            description: "The meeting summary has been copied to your clipboard.",
          });
          setTimeout(() => {
            setCopied(false);
          }, 2000);
        })
        .catch(err => {
          console.error("Failed to copy summary:", err);
          toast({
            title: "Copy failed",
            description: "Failed to copy the meeting summary to your clipboard.",
            variant: "destructive"
          });
        });
    }
  };

  const loadSavedMeetings = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        throw new Error(error.message);
      }

      setSavedMeetings(data.map(meeting => ({
        id: meeting.id,
        date: meeting.date,
        summary: meeting.summary,
        duration: meeting.duration,
        title: meeting.title || 'Untitled Meeting',
        location: meeting.location
      })));
    } catch (error) {
      console.error('Error loading meetings:', error);
      toast({
        title: "Error loading history",
        description: error instanceof Error ? error.message : "Failed to load meeting history.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  const downloadAudio = async (meetingId?: string) => {
    try {
      setIsDownloadingAudio(true);
      
      if (meetingId) {
        // Download from storage
        const { data, error } = await supabase.storage
          .from('meeting-recordings')
          .download(`${meetingId}.webm`);
        
        if (error) {
          throw new Error('Audio recording not found or could not be downloaded.');
        }
        
        // Create download link
        if (data) {
          const url = URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = url;
          a.download = `meeting_recording_${meetingId}.webm`;
          document.body.appendChild(a);
          a.click();
          URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }
      } else if (state.audioData) {
        // Download current meeting audio
        const url = URL.createObjectURL(state.audioData);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'meeting_recording.webm';
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error('No audio recording available to download.');
      }
      
      toast({
        title: "Download complete",
        description: "Audio recording has been downloaded.",
      });
    } catch (error) {
      console.error('Error downloading audio:', error);
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : "Failed to download audio recording.",
        variant: "destructive"
      });
    } finally {
      setIsDownloadingAudio(false);
    }
  };

  return {
    state,
    isExporting,
    setIsExporting,
    isDownloadingAudio,
    selectedLanguage,
    setSelectedLanguage,
    copied,
    summaryRef,
    savedMeetings,
    isLoadingHistory,
    loadSavedMeetings,
    startRecording,
    stopRecording,
    generateSummary,
    saveMeetingToSupabase,
    deleteMeeting,
    updateMeetingTitle,
    downloadAudio,
    copySummary,
    supportsVoice
  };
};
