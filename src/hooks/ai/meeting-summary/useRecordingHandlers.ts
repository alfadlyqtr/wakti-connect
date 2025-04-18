
import { useCallback, useRef } from 'react';
import { toast } from "sonner";
import { MeetingSummaryState } from './types';

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
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onerror = () => {
        setState(prev => ({ 
          ...prev, 
          recordingError: "Error occurred during recording. Please try again.",
          isRecording: false 
        }));
        
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
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

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop();
      
      const partNumber = state.meetingParts.length + 1;
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      setState(prev => ({
        ...prev,
        isRecording: false,
        meetingParts: [
          ...prev.meetingParts,
          {
            partNumber,
            duration: prev.recordingTime,
            audioBlob
          }
        ],
        audioBlobs: [...(prev.audioBlobs || []), audioBlob]
      }));
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      processRecording(audioBlob);
    }
  }, [state.isRecording, state.meetingParts, state.recordingTime, setState]);

  const processRecording = useCallback(async (audioBlob: Blob) => {
    try {
      // For now, using mock transcription
      const mockTranscription = "This is a placeholder transcription. In a real application, this text would come from processing the audio through a transcription service.";
      
      setState(prev => ({
        ...prev,
        transcribedText: prev.transcribedText 
          ? `${prev.transcribedText}\n\n${mockTranscription}`
          : mockTranscription
      }));
      
      toast.success("Recording processed successfully");
      
    } catch (error) {
      console.error("Error processing recording:", error);
      toast.error("Failed to process the recording. Please try again.");
    }
  }, [setState]);

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
