
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

  const stopRecording = useCallback(async () => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop();
      
      const partNumber = state.meetingParts.length + 1;
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      try {
        // Upload the audio file to Supabase storage
        const fileName = `meeting_${Date.now()}_part${partNumber}.webm`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('meeting-recordings')
          .upload(`recordings/${fileName}`, audioBlob);

        if (uploadError) {
          throw new Error('Failed to upload audio file');
        }

        // Get the public URL for the uploaded file
        const { data: { publicUrl } } = supabase.storage
          .from('meeting-recordings')
          .getPublicUrl(`recordings/${fileName}`);

        console.log("Attempting transcription with ElevenLabs...");
        const { data: elevenLabsData, error: elevenLabsError } = await supabase.functions.invoke(
          'voice-transcription',
          { body: { fileUrl: publicUrl } }
        );
        
        if (!elevenLabsError && elevenLabsData?.text) {
          processTranscription(elevenLabsData.text, audioBlob, partNumber);
          return;
        }
        
        console.log("ElevenLabs transcription failed, trying OpenAI...");
        
        // If ElevenLabs fails, try OpenAI Whisper
        const formData = new FormData();
        formData.append('file', audioBlob);
        formData.append('model', 'whisper-1');
        
        const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: formData,
        });

        if (!whisperResponse.ok) {
          throw new Error('OpenAI transcription failed');
        }

        const whisperData = await whisperResponse.json();
        processTranscription(whisperData.text, audioBlob, partNumber);

      } catch (error) {
        console.error("Error processing recording:", error);
        toast.error("Failed to process recording. Please try again.");
        cleanup();
      }
    }
  }, [state.isRecording, state.meetingParts.length]);

  const processTranscription = (text: string, audioBlob: Blob, partNumber: number) => {
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
      audioBlobs: [...(prev.audioBlobs || []), audioBlob],
      transcribedText: prev.transcribedText 
        ? `${prev.transcribedText}\n\nPart ${partNumber}:\n${text}`
        : `Part ${partNumber}:\n${text}`
    }));
    
    cleanup();
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result?.toString().split(',')[1];
        if (base64String) {
          resolve(base64String);
        } else {
          reject(new Error('Failed to convert blob to base64'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
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
