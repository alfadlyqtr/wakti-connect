import { useState, useRef, useCallback, useEffect } from 'react';
import { useUser } from '@/hooks/auth/useUser';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface MeetingPart {
  id: string;
  partNumber: number;
  transcript: string;
  audioUrl: string;
  duration: number;
}

export interface IntakeFormData {
  sessionType: string;
  hostedBy?: string;
  location?: string;
  attendees?: string;
  agenda?: string;
}

interface MeetingState {
  isRecording: boolean;
  recordingTime: number;
  meetingParts: MeetingPart[];
  transcribedText: string;
  summary: string;
  isSummarizing: boolean;
  recordingError: string | null;
  detectedLocation: string;
  detectedAttendees: string[];
}

const initialState: MeetingState = {
  isRecording: false,
  recordingTime: 0,
  meetingParts: [],
  transcribedText: '',
  summary: '',
  isSummarizing: false,
  recordingError: null,
  detectedLocation: '',
  detectedAttendees: [],
};

// Function to extract location from text using regex
const extractLocation = (text: string): string => {
  const locationRegex = /(?:at|in)\s+([A-Z][a-z]+(?: [A-Z][a-z]+)*)/g;
  const matches = [];
  let match;
  while ((match = locationRegex.exec(text)) !== null) {
    matches.push(match[1]);
  }
  return matches.length > 0 ? matches[0] : '';
};

// Function to extract attendees from text using regex
const extractAttendees = (text: string): string[] => {
  const attendeeRegex = /Attending:\s*(.+)/;
  const match = text.match(attendeeRegex);
  if (match && match[1]) {
    return match[1].split(',').map(name => name.trim());
  }
  return [];
};

export const useMeetingSummaryV2 = () => {
  const [state, setState] = useState<MeetingState>(initialState);
  const [intakeData, setIntakeData] = useState<IntakeFormData | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isDownloadingAudio, setIsDownloadingAudio] = useState(false);
  const [meetingId, setMeetingId] = useState<string | null>(null);
  const [currentPartNumber, setCurrentPartNumber] = useState(1);
  const recordingIntervalRef = useRef<number | null>(null);
  const { user } = useUser();
  const summaryRef = useRef<HTMLDivElement>(null);
  
  const maxRecordingDuration = 60 * 60; // 60 minutes
  const warnBeforeEndSeconds = 60; // 60 seconds
  
  // Fixed toast variant from "warning" to "default"
  const showTimeWarning = useCallback(() => {
    toast({
      title: "Recording time limit approaching",
      description: "You're approaching the 60-minute limit. Consider starting a new part.",
      variant: "default",
      duration: 5000,
    });
  }, []);

  const resetSession = () => {
    setState(initialState);
    setAudioChunks([]);
    setMeetingId(null);
    setCurrentPartNumber(1);
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
  };

  const startRecording = async () => {
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "Please sign in to start recording.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      let recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      
      setMediaRecorder(recorder);
      setAudioChunks([]);
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((prev) => [...prev, event.data]);
        }
      };
      
      recorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        
        if (audioChunks.length === 0) {
          console.warn("No audio data recorded.");
          return;
        }
        
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        
        if (!meetingId) {
          console.error("Meeting ID is missing.");
          return;
        }
        
        const newPart = await saveRecordingPart(
          meetingId,
          currentPartNumber,
          audioBlob,
          state.transcribedText
        );
        
        if (newPart) {
          setState(prevState => ({
            ...prevState,
            meetingParts: [...prevState.meetingParts, newPart],
          }));
        }
      };
      
      recorder.onerror = (event) => {
        console.error("MediaRecorder Error:", event);
        setState(prevState => ({
          ...prevState,
          recordingError: `MediaRecorder Error: ${event.error}`,
        }));
      };
      
      recorder.start();
      
      // Set up timer to show warning before time limit
      const startTime = Date.now();
      recordingIntervalRef.current = window.setInterval(() => {
        const elapsedTime = (Date.now() - startTime) / 1000;
        if (maxRecordingDuration - elapsedTime <= warnBeforeEndSeconds) {
          showTimeWarning();
        }
        
        setState(prevState => ({
          ...prevState,
          recordingTime: elapsedTime,
        }));
      }, 1000);
      
      setState(prevState => ({
        ...prevState,
        isRecording: true,
        recordingTime: 0,
        recordingError: null,
      }));
      
      // Create a new meeting if one doesn't exist
      if (!meetingId) {
        const newMeetingId = crypto.randomUUID();
        setMeetingId(newMeetingId);
        
        const now = new Date();
        const meetingDate = now.toISOString().split('T')[0];
        
        const { error } = await supabase
          .from('meetings')
          .insert({
            id: newMeetingId,
            user_id: user.id,
            date: meetingDate,
            title: `Meeting on ${meetingDate}`,
            location: intakeData?.location || '',
          });
        
        if (error) {
          console.error("Error creating meeting:", error);
          setState(prevState => ({
            ...prevState,
            recordingError: `Error creating meeting: ${error.message}`,
          }));
        }
      }
      
    } catch (err: any) {
      console.error("Error starting recording:", err);
      setState(prevState => ({
        ...prevState,
        recordingError: `Error starting recording: ${err.message}`,
      }));
      
      toast({
        title: "Recording Failed",
        description: `Failed to start recording: ${err.message}`,
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
      
      setState(prevState => ({
        ...prevState,
        isRecording: false,
      }));
    }
  };

  const startNextPart = () => {
    setCurrentPartNumber(prevPartNumber => prevPartNumber + 1);
    setState(prevState => ({
      ...prevState,
      transcribedText: '',
    }));
    startRecording();
  };

  // Fix the async function mismatch
  const generateSummary = async () => {
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "Please sign in to generate a summary.",
        variant: "destructive",
      });
      return;
    }
    
    if (!meetingId) {
      toast({
        title: "No meeting ID",
        description: "No meeting ID found. Please start a new recording.",
        variant: "destructive",
      });
      return;
    }
    
    setState(prevState => ({ ...prevState, isSummarizing: true }));
    
    try {
      // Fetch the audio URL and transcript for each part
      const partsData = await Promise.all(
        state.meetingParts.map(async (part) => {
          const { data, error } = await supabase.storage
            .from('meeting-recordings')
            .createSignedUrl(part.audioUrl, 60);
          
          if (error) {
            console.error(`Error getting download URL for part ${part.partNumber}:`, error);
            return { audioUrl: null, transcript: part.transcript };
          }
          
          return { audioUrl: data?.signedUrl || null, transcript: part.transcript };
        })
      );
      
      // Combine the transcripts and audio URLs
      const combinedTranscripts = partsData.map(part => part.transcript).join('\n');
      const combinedAudioUrls = partsData.map(part => part.audioUrl).filter(url => url !== null);
      
      // Call the edge function
      const { data, error } = await supabase.functions.invoke('ai-meeting-summary', {
        body: {
          meetingTitle: intakeData?.sessionType || 'Untitled Meeting',
          transcription: combinedTranscripts,
          audioUrls: combinedAudioUrls,
          language: 'en',
        },
      });
      
      if (error) {
        console.error("Edge function error:", error);
        setState(prevState => ({
          ...prevState,
          isSummarizing: false,
        }));
        toast({
          title: "Summary Failed",
          description: `Failed to generate summary: ${error.message}`,
          variant: "destructive",
        });
        return;
      }
      
      // Extract location and attendees
      const detectedLocation = extractLocation(data.summary);
      const detectedAttendees = extractAttendees(data.summary);
      
      // Update the meeting in the database
      const { error: updateError } = await supabase
        .from('meetings')
        .update({
          summary: data.summary,
          location: detectedLocation,
        })
        .eq('id', meetingId);
      
      if (updateError) {
        console.error("Error updating meeting:", updateError);
      }
      
      setState(prevState => ({
        ...prevState,
        summary: data.summary,
        isSummarizing: false,
        detectedLocation: detectedLocation,
        detectedAttendees: detectedAttendees,
      }));
      
      toast({
        title: "Summary Generated",
        description: "The meeting summary has been generated successfully.",
        variant: "success",
      });
      
    } catch (err: any) {
      console.error("Error generating summary:", err);
      setState(prevState => ({ ...prevState, isSummarizing: false }));
      toast({
        title: "Summary Failed",
        description: `Failed to generate summary: ${err.message}`,
        variant: "destructive",
      });
    }
  };

  const copySummary = () => {
    if (state.summary) {
      navigator.clipboard.writeText(state.summary)
        .then(() => {
          toast({
            title: "Summary Copied",
            description: "The meeting summary has been copied to your clipboard.",
            variant: "success",
          });
        })
        .catch(err => {
          console.error("Error copying summary:", err);
          toast({
            title: "Copy Failed",
            description: "Failed to copy the meeting summary to your clipboard.",
            variant: "destructive",
          });
        });
    }
  };

  // Fix the meeting_parts table issue by using meetings table
  const loadMeetingParts = async (meetingId: string) => {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('id', meetingId);
      
      if (error) {
        console.error("Error loading meeting parts:", error);
        return [];
      }
      
      // Handle response - since meeting_parts doesn't exist, we'll need to adapt
      // and maybe just return a single part based on the meeting data
      if (data && data.length > 0) {
        return [{
          id: data[0].id,
          partNumber: 1,
          transcript: data[0].summary || '',
          audioUrl: data[0].audio_storage_path || '',
          duration: data[0].duration || 0
        }];
      }
      
      return [];
    } catch (err) {
      console.error("Failed to load meeting parts:", err);
      return [];
    }
  };

  // Fix the meeting creation function to not use meeting_parts
  const saveRecordingPart = async (
    meetingId: string,
    partNumber: number,
    audioBlob: Blob,
    transcript: string
  ) => {
    if (!user) return null;
    
    try {
      const filePath = `${user.id}/${meetingId}/part_${partNumber}.webm`;
      
      // Upload to Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('meeting-recordings')
        .upload(filePath, audioBlob, {
          contentType: 'audio/webm',
          upsert: true
        });
      
      if (uploadError) {
        console.error("Error uploading recording:", uploadError);
        return null;
      }
      
      // Since meeting_parts doesn't exist, we'll update the main meeting record
      // or handle this differently depending on your data structure
      
      // For now, we'll just return a constructed part object
      const newPart: MeetingPart = {
        id: `${meetingId}_part${partNumber}`,
        partNumber: partNumber,
        transcript: transcript,
        audioUrl: filePath,
        duration: 0  // You'd need to calculate this from the audio blob
      };
      
      return newPart;
    } catch (err) {
      console.error("Failed to save recording part:", err);
      return null;
    }
  };

  const loadSavedMeetings = useCallback(async () => {
    if (!user) {
      console.warn("User not logged in.");
      return [];
    }
    
    try {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching meetings:", error);
        toast({
          title: "Load Failed",
          description: `Failed to load saved meetings: ${error.message}`,
          variant: "destructive",
        });
        return [];
      }
      
      return data || [];
    } catch (err) {
      console.error("Error fetching meetings:", err);
      toast({
        title: "Load Failed",
        description: `Failed to load saved meetings: ${err}`,
        variant: "destructive",
      });
      return [];
    }
  }, [user]);

  const deleteMeeting = async (meetingId: string) => {
    try {
      const { error } = await supabase
        .from('meetings')
        .delete()
        .eq('id', meetingId);
      
      if (error) {
        console.error("Error deleting meeting:", error);
        toast({
          title: "Delete Failed",
          description: `Failed to delete meeting: ${error.message}`,
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "Meeting Deleted",
        description: "The meeting has been deleted successfully.",
        variant: "success",
      });
      return true;
    } catch (err) {
      console.error("Error deleting meeting:", err);
      toast({
        title: "Delete Failed",
        description: `Failed to delete meeting: ${err}`,
        variant: "destructive",
      });
      return false;
    }
  };

  // Fix audio handling to not treat MeetingPart[] as Blob[]
  const downloadAudio = async () => {
    setIsDownloadingAudio(true);
    try {
      // Download each part's audio
      for (const part of state.meetingParts) {
        if (part.audioUrl) {
          // Get the audio URL
          const { data, error } = await supabase.storage
            .from('meeting-recordings')
            .createSignedUrl(part.audioUrl, 60);
            
          if (error) {
            console.error(`Error getting download URL for part ${part.partNumber}:`, error);
            continue;
          }
          
          if (data?.signedUrl) {
            // Create a temporary anchor and trigger download
            const a = document.createElement('a');
            a.href = data.signedUrl;
            a.download = `meeting_part_${part.partNumber}.webm`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }
        }
      }
      
      toast({
        title: "Audio Downloaded",
        description: "All meeting audio parts have been downloaded.",
        variant: "success"
      });
    } catch (err) {
      console.error("Error downloading audio:", err);
      toast({
        title: "Download Failed",
        description: "There was an error downloading the meeting audio.",
        variant: "destructive"
      });
    } finally {
      setIsDownloadingAudio(false);
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
    isDownloadingAudio
  };
};
