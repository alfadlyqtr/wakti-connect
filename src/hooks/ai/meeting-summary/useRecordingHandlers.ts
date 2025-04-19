import { useCallback, useRef } from 'react';
import { toast } from "sonner";
import { MeetingSummaryState } from './types';
import { supabase } from '@/integrations/supabase/client';

export const useRecordingHandlers = (
  setState: React.Dispatch<React.SetStateAction<MeetingSummaryState>>,
  state: MeetingSummaryState
) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, recordingError: null }));
      
      audioChunksRef.current = [];
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.start();
      
      setState(prev => ({ ...prev, isRecording: true }));
      
      let seconds = 0;
      timerRef.current = window.setInterval(() => {
        seconds += 1;
        setState(prev => ({ ...prev, recordingTime: seconds }));
      }, 1000);
      
    } catch (err) {
      console.error('Error starting recording:', err);
      setState(prev => ({ 
        ...prev, 
        recordingError: "Microphone access denied. Please allow microphone access and try again."
      }));
    }
  }, [setState]);

  const stopRecording = useCallback(async () => {
    if (mediaRecorderRef.current && state.isRecording) {
      setState(prev => ({ 
        ...prev, 
        isRecording: false,
        isProcessing: true 
      }));
      
      mediaRecorderRef.current.stop();
      cleanup();
      
      const partNumber = state.meetingParts.length + 1;
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      try {
        const fileName = `meeting_${Date.now()}_part${partNumber}.webm`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('meeting-recordings')
          .upload(`recordings/${fileName}`, audioBlob);

        if (uploadError) throw new Error('Failed to upload audio file');

        const { data: { publicUrl } } = supabase.storage
          .from('meeting-recordings')
          .getPublicUrl(`recordings/${fileName}`);

        console.log("Attempting transcription with voice-transcription...");
        
        const { data: transcriptionData, error: transcriptionError } = await supabase.functions.invoke(
          'voice-transcription',
          { body: { fileUrl: publicUrl } }
        );
        
        if (transcriptionError) throw transcriptionError;
        
        if (transcriptionData?.text) {
          processTranscription(transcriptionData.text, audioBlob, partNumber);
          return;
        }
        
        throw new Error('No transcription generated');
        
      } catch (error) {
        console.error("Error processing recording:", error);
        toast.error("Failed to process recording. Please try again.");
        setState(prev => ({ ...prev, isProcessing: false }));
      }
    }
  }, [state.isRecording, state.meetingParts.length, cleanup]);

  const processTranscription = (text: string, audioBlob: Blob, partNumber: number) => {
    setState(prev => ({
      ...prev,
      isRecording: false,
      isProcessing: false,
      meetingParts: [
        ...prev.meetingParts,
        {
          partNumber,
          duration: prev.recordingTime,
          audioBlob
        }
      ],
      audioBlobs: [...(prev.audioBlobs || []), audioBlob],
      transcribedText: prev.transcribedText 
        ? `${prev.transcribedText}\n\nPart ${partNumber}:\n${text}`
        : `Part ${partNumber}:\n${text}`
    }));
    
    cleanup();
    toast.success("Recording transcribed successfully!");
  };

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  return {
    startRecording,
    stopRecording,
    cleanup,
    mediaRecorderRef,
    streamRef,
    timerRef
  };
};
