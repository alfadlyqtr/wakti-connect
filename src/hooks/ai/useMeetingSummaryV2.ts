import { useState, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useUser } from '@supabase/auth-helpers-react';
import { useVoiceSettings } from '@/store/voiceSettings';
import { useSettings } from '@/store/settings';
import { RecordingState } from '@/types/meeting-summary.types';
import { MeetingPart } from '@/types/meeting-summary.types';
import { AudioSettings } from '@/types/voice-settings.types';

export interface IntakeFormData {
  sessionType: string;
  hostedBy?: string;
  location?: string;
  attendees?: string;
  agenda?: string;
}

const initialState: RecordingState = {
  isRecording: false,
  isSummarizing: false,
  recordingTime: 0,
  transcribedText: '',
  summary: '',
  detectedLocation: '',
  detectedAttendees: '',
  meetingParts: [],
  audioBlobs: [],
  recordingError: null,
};

export const useMeetingSummaryV2 = () => {
  const [state, setRecordingState] = useState<RecordingState>(initialState);
  const [intakeData, setIntakeDataState] = useState<IntakeFormData>({
    sessionType: '',
    hostedBy: '',
    location: '',
    attendees: '',
    agenda: '',
  });
  const { toast } = useToast();
	const supabase = useSupabaseClient();
	const user = useUser();
  const userId = user?.id;
  const { selectedLanguage } = useVoiceSettings();
  const { openAIApiKey } = useSettings();
  const maxRecordingDuration = 60 * 60; // 60 minutes
  const warnBeforeEndSeconds = 30;
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const startTime = useRef<number>(0);
  const meetingIdRef = useRef<string | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isDownloadingAudio, setIsDownloadingAudio] = useState(false);

  // Function to set intake data
  const setIntakeData = (data: IntakeFormData) => {
    setIntakeDataState(data);
  };

  // Function to reset the session
  const resetSession = () => {
    setRecordingState(initialState);
    audioChunks.current = [];
    meetingIdRef.current = null;
  };

  // Load saved meetings
  const loadSavedMeetings = useCallback(async () => {
    if (!userId) {
      console.warn('User ID is not available. Cannot load saved meetings.');
      return [];
    }

    try {
      const { data: meetings, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching meetings:', error);
        toast({
          title: "Error loading meetings",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

      return meetings || [];
    } catch (error) {
      console.error('Exception while loading saved meetings:', error);
      toast({
        title: "Error loading meetings",
        description: 'Failed to load saved meetings.',
        variant: "destructive",
      });
      return [];
    }
  }, [supabase, userId, toast]);

  // Delete meeting
  const deleteMeeting = async (meetingId: string) => {
    try {
      const { error } = await supabase
        .from('meetings')
        .delete()
        .eq('id', meetingId);

      if (error) {
        console.error('Error deleting meeting:', error);
        toast({
          title: "Error deleting meeting",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Meeting deleted",
        description: 'Meeting was successfully deleted.',
      });
      return true;
    } catch (error) {
      console.error('Exception while deleting meeting:', error);
      toast({
        title: "Error deleting meeting",
        description: 'Failed to delete the meeting.',
        variant: "destructive",
      });
      return false;
    }
  };

  // Start recording
  const startRecording = async (audioSettings: AudioSettings) => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('getUserMedia not supported on your browser');
      toast({
        title: "Error",
        description: 'getUserMedia not supported on your browser.',
        variant: "destructive",
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: audioSettings });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event: BlobEvent) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        const duration = (Date.now() - startTime.current) / 1000;
        const partNumber = state.meetingParts.length + 1;

        setRecordingState(prevState => ({
          ...prevState,
          meetingParts: [
            ...prevState.meetingParts,
            {
              partNumber: partNumber,
              startTime: startTime.current,
              duration: duration,
              audioBlob: audioBlob,
            }
          ],
          audioBlobs: [...prevState.audioBlobs, audioBlob],
        }));
      };

      mediaRecorder.current.onerror = (event: Event) => {
        handleRecordingError(event);
      };

      startTime.current = Date.now();
      mediaRecorder.current.start();

      setRecordingState(prevState => ({
        ...prevState,
        isRecording: true,
        recordingTime: 0,
        recordingError: null,
      }));

      // Start timer
      const intervalId = setInterval(() => {
        setRecordingState(prevState => {
          const newRecordingTime = Date.now() - startTime.current;
          if (newRecordingTime / 1000 >= maxRecordingDuration) {
            clearInterval(intervalId);
            stopRecording();
            return { ...prevState, recordingTime: maxRecordingDuration };
          }
          return { ...prevState, recordingTime: newRecordingTime / 1000 };
        });
      }, 100); // Update every 100ms

    } catch (error: any) {
      console.error('Error starting recording:', error);
      toast({
        title: "Error starting recording",
        description: error.message || 'Failed to start recording.',
        variant: "destructive",
      });
      setRecordingState(prevState => ({
        ...prevState,
        isRecording: false,
        recordingError: error.message || 'Failed to start recording.',
      }));
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
      setRecordingState(prevState => ({ ...prevState, isRecording: false }));
    }
  };

  // Start next part
  const startNextPart = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      stopRecording();
    }
    startRecording({
      echoCancellation: true,
      noiseSuppression: true,
      sampleRate: 48000,
    });
  };

  // Handle recording error
  const handleRecordingError = (event: Event) => {
    // Since Event doesn't have an 'error' property directly, check if it's an ErrorEvent
    const errorEvent = event as ErrorEvent;
    const errorMessage = errorEvent.message || 'Unknown recording error occurred';
    
    toast({
      title: "Recording Error",
      description: errorMessage,
      variant: "destructive", // Changed from "warning" to "destructive" as per bug fix request
      duration: 5000,
    });
    
    setRecordingState(prev => ({
      ...prev,
      isRecording: false,
      recordingError: errorMessage,
    }));
  };

  // Generate summary
  const generateSummary = async () => {
    if (!openAIApiKey) {
      toast({
        title: "Missing OpenAI API Key",
        description: "Please set your OpenAI API key in the settings.",
        variant: "destructive",
      });
      return;
    }

    if (state.isSummarizing) {
      toast({
        title: "Summarization in progress",
        description: "Please wait for the current summarization to complete.",
        variant: "warning",
      });
      return;
    }

    if (state.meetingParts.length === 0) {
      toast({
        title: "No audio recorded",
        description: "Please record a meeting before generating a summary.",
        variant: "warning",
      });
      return;
    }

    setRecordingState(prevState => ({ ...prevState, isSummarizing: true }));

    try {
      // 1. Upload audio files to Supabase storage and get URLs
      const audioUrls = await Promise.all(
        state.meetingParts.map(async (part) => {
          const fileName = `meeting-${meetingIdRef.current}-${part.partNumber}.webm`;
          const filePath = `audio/${userId}/${fileName}`;

          const { data, error } = await supabase.storage
            .from('meeting-recordings')
            .upload(filePath, part.audioBlob, {
              contentType: 'audio/webm',
              upsert: false,
            });

          if (error) {
            console.error('Error uploading audio:', error);
            toast({
              title: "Error uploading audio",
              description: error.message,
              variant: "destructive",
            });
            return null;
          }

          const url = `${supabase.storageUrl}/object/public/${data.Key}`;
          return url;
        })
      );

      // Check if all audio files were uploaded successfully
      if (audioUrls.some(url => url === null)) {
        console.error('Failed to upload all audio files.');
        toast({
          title: "Error uploading audio",
          description: "Failed to upload all audio files.",
          variant: "destructive",
        });
        setRecordingState(prevState => ({ ...prevState, isSummarizing: false }));
        return;
      }

      // 2. Transcribe audio using OpenAI Whisper API
      const transcriptionPromises = audioUrls.map(async (audioUrl) => {
        const response = await fetch('/api/ai/transcribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ audioUrl: audioUrl, openAIApiKey: openAIApiKey, language: selectedLanguage }),
        });

        if (!response.ok) {
          console.error('Transcription failed:', response.statusText);
          toast({
            title: "Transcription failed",
            description: response.statusText,
            variant: "destructive",
          });
          return null;
        }

        const data = await response.json();
        return data.transcription;
      });

      const transcriptions = await Promise.all(transcriptionPromises);

      // Check if all transcriptions were successful
      if (transcriptions.some(transcription => transcription === null)) {
        console.error('Failed to transcribe all audio files.');
        toast({
          title: "Transcription failed",
          description: "Failed to transcribe all audio files.",
          variant: "destructive",
        });
        setRecordingState(prevState => ({ ...prevState, isSummarizing: false }));
          return;
      }

      const fullTranscription = transcriptions.join('\n');
      setRecordingState(prevState => ({ ...prevState, transcribedText: fullTranscription }));

      // 3. Generate summary using OpenAI
      const summaryResponse = await fetch('/api/ai/summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: fullTranscription, openAIApiKey: openAIApiKey, language: selectedLanguage }),
      });

      if (!summaryResponse.ok) {
        console.error('Summary generation failed:', summaryResponse.statusText);
        toast({
          title: "Summary generation failed",
          description: summaryResponse.statusText,
          variant: "destructive",
        });
        setRecordingState(prevState => ({ ...prevState, isSummarizing: false }));
        return;
      }

      const summaryData = await summaryResponse.json();
      const summary = summaryData.summary;
      const detectedLocation = summaryData.location;
      const detectedAttendees = summaryData.attendees;

      setRecordingState(prevState => ({
        ...prevState,
        summary: summary,
        detectedLocation: detectedLocation,
        detectedAttendees: detectedAttendees,
      }));

      // 4. Update meeting in Supabase
      try {
        const { error } = await supabase
          .from('meetings')
          .update({
            summary: summary,
            location: detectedLocation,
            attendees: detectedAttendees,
          })
          .eq('id', meetingIdRef.current);

        if (error) {
          console.error('Error updating meeting:', error);
          toast({
            title: "Error updating meeting",
            description: error.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Exception while updating meeting:', error);
        toast({
          title: "Error updating meeting",
          description: 'Failed to update meeting details.',
          variant: "destructive",
        });
      }

    } catch (error: any) {
      console.error('Error during summary generation:', error);
      toast({
        title: "Error during summary generation",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setRecordingState(prevState => ({ ...prevState, isSummarizing: false }));
    }
  };

  // Copy summary
  const copySummary = () => {
    if (state.summary) {
      navigator.clipboard.writeText(state.summary)
        .then(() => {
          toast({
            title: "Summary copied",
            description: "Summary copied to clipboard.",
          });
        })
        .catch(error => {
          console.error('Error copying summary:', error);
          toast({
            title: "Error copying summary",
            description: "Failed to copy summary to clipboard.",
            variant: "destructive",
          });
        });
    }
  };

  // Download audio
  const downloadAudio = async () => {
    setIsDownloadingAudio(true);
    try {
      // Create a single Blob from all audio chunks
      const completeBlob = new Blob(state.audioBlobs, { type: 'audio/webm' });

      // Create a download link
      const url = window.URL.createObjectURL(completeBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${intakeData.sessionType || 'meeting'}-summary.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast({
        title: "Download started",
        description: "Audio download started.",
      });
    } catch (error) {
      console.error('Error downloading audio:', error);
      toast({
        title: "Error downloading audio",
        description: "Failed to download audio.",
        variant: "destructive",
      });
    } finally {
      setIsDownloadingAudio(false);
    }
  };

  // Create meeting
  const createMeeting = async (intakeData: IntakeFormData) => {
    const meetingId = uuidv4();
    const formattedDate = format(new Date(), 'yyyy-MM-dd');
    
    try {
      // Fixed insert operation with all required fields
      const { data, error } = await supabase
        .from('meetings')
        .insert({
          id: meetingId,
          user_id: userId,
          title: intakeData.sessionType || 'Untitled Meeting',
          date: formattedDate,
          location: intakeData.location || '',
          duration: 0, // Required field, will be updated later
          summary: '', // Required field, will be updated after transcription
          language: selectedLanguage
        });

      if (error) {
        console.error('Error creating meeting:', error);
        return null;
      }
      
      return meetingId;
    } catch (error) {
      console.error('Exception creating meeting:', error);
      return null;
    }
  };

  // Start new meeting
  const startNewMeeting = async (intakeData: IntakeFormData) => {
    const meetingId = await createMeeting(intakeData);
    if (meetingId) {
      meetingIdRef.current = meetingId;
      toast({
        title: "Meeting started",
        description: "A new meeting has been started.",
      });
    } else {
      toast({
        title: "Error starting meeting",
        description: "Failed to start a new meeting.",
        variant: "destructive",
      });
    }
  };

  return {
    state,
    startRecording,
    stopRecording,
    startNextPart,
    generateSummary,
    copySummary,
    downloadAudio,
    setIntakeData,
    resetSession,
    loadSavedMeetings,
    deleteMeeting,
    maxRecordingDuration,
    warnBeforeEndSeconds,
    summaryRef,
    isExporting,
    isDownloadingAudio,
    startNewMeeting,
  };
};
