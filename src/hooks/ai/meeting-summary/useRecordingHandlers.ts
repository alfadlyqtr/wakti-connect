
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

  const startRecording = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, recordingError: null }));
      
      audioChunksRef.current = [];
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
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

  // Wrap mediaRecorder.stop() in a Promise
  const stopMediaRecorder = async (): Promise<Blob> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current) {
        resolve(new Blob([]));
        return;
      }
      
      const handleStop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        mediaRecorderRef.current?.removeEventListener('stop', handleStop);
        resolve(audioBlob);
      };
      
      mediaRecorderRef.current.addEventListener('stop', handleStop);
      mediaRecorderRef.current.stop();
    });
  };

  const stopRecording = useCallback(async () => {
    console.log("Stopping recording...");
    if (mediaRecorderRef.current && state.isRecording) {
      setState(prev => ({ 
        ...prev, 
        isRecording: false,
        isProcessing: true 
      }));
      
      cleanup();
      
      try {
        // Wait for the media recorder to finish and get the blob
        console.log("Waiting for media recorder to finish...");
        const audioBlob = await stopMediaRecorder();
        console.log(`Audio blob created: ${audioBlob.size} bytes`);
        
        if (audioBlob.size === 0) {
          throw new Error('No audio data recorded');
        }
        
        const partNumber = state.meetingParts.length + 1;
        const fileName = `meeting_${Date.now()}_part${partNumber}.webm`;
        
        // Upload to Supabase Storage
        console.log("Uploading to Supabase Storage...");
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('meeting-recordings')
          .upload(`recordings/${fileName}`, audioBlob);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw new Error('Failed to upload audio file');
        }

        const { data: { publicUrl } } = supabase.storage
          .from('meeting-recordings')
          .getPublicUrl(`recordings/${fileName}`);

        console.log("File uploaded, public URL:", publicUrl);
        
        // Send to transcription service
        console.log("Starting transcription...");
        const { data: transcriptionData, error: transcriptionError } = await supabase.functions.invoke(
          'voice-transcription',
          { 
            body: { 
              fileUrl: publicUrl,
              language: 'auto'
            } 
          }
        );
        
        if (transcriptionError) {
          console.error("Transcription error:", transcriptionError);
          throw transcriptionError;
        }
        
        if (!transcriptionData?.text) {
          console.error("No transcription received");
          throw new Error('No transcription generated');
        }
        
        console.log("Transcription successful:", transcriptionData.text.substring(0, 100) + "...");
        
        // Process the transcription
        processTranscription(transcriptionData.text, audioBlob, partNumber);
        
      } catch (error) {
        console.error("Error processing recording:", error);
        toast.error(error instanceof Error ? error.message : "Failed to process recording");
        setState(prev => ({ ...prev, isProcessing: false }));
      }
    }
  }, [state.isRecording, state.meetingParts.length, setState, cleanup]);

  const processTranscription = (text: string, audioBlob: Blob, partNumber: number) => {
    console.log("Processing transcription for part", partNumber);
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

  return {
    startRecording,
    stopRecording,
    cleanup,
    mediaRecorderRef,
    streamRef,
    timerRef
  };
};
