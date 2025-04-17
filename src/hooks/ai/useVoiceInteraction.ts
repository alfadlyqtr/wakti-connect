
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface VoiceInteractionOptions {
  onTranscriptComplete?: (transcript: string) => void;
  continuousListening?: boolean;
  autoStopAfterSilence?: boolean;
  maxDuration?: number; // in seconds
}

export const useVoiceInteraction = (options: VoiceInteractionOptions = {}) => {
  const { 
    onTranscriptComplete, 
    continuousListening = false,
    autoStopAfterSilence = false, 
    maxDuration = 60 
  } = options;
  
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastTranscript, setLastTranscript] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Reference to the MediaRecorder and audio chunks
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Check if browser supports speech recognition
  const supportsVoice = typeof window !== 'undefined' && 
    ('MediaRecorder' in window);
  
  // Start recording audio
  const startListening = useCallback(async () => {
    if (!supportsVoice) {
      setError(new Error('Your browser does not support audio recording'));
      return;
    }
    
    try {
      // Reset state
      setTranscript('');
      setError(null);
      audioChunksRef.current = [];
      
      console.log("Starting voice recording...");
      
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Create MediaRecorder for audio capture
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      // Setup recording complete handler
      mediaRecorder.onstop = async () => {
        try {
          // Process the audio data
          if (audioChunksRef.current.length > 0) {
            await processRecording();
          }
        } catch (err) {
          console.error('Error processing recording:', err);
          setError(err instanceof Error ? err : new Error('Unknown recording error'));
        } finally {
          // Clean up resources
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
          }
        }
      };
      
      // Start recording
      mediaRecorder.start(100); // Collect chunks every 100ms
      setIsListening(true);
      
      // Start duration timer
      setRecordingStartTime(Date.now());
      setRecordingDuration(0);
      
      const interval = setInterval(() => {
        const now = Date.now();
        const startTime = recordingStartTime || now;
        const duration = Math.floor((now - startTime) / 1000);
        
        setRecordingDuration(duration);
        
        // Auto-stop if reached max duration
        if (duration >= maxDuration) {
          stopListening();
        }
      }, 1000);
      
      setTimerInterval(interval);
      
      // Show visual feedback
      toast({
        title: "Voice Recording Active",
        description: "Press the button again when you're done speaking.",
        duration: 3000,
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setIsListening(false);
      toast({
        title: "Microphone Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  }, [maxDuration, recordingStartTime, supportsVoice]);
  
  // Process the recorded audio
  const processRecording = async () => {
    if (audioChunksRef.current.length === 0) {
      console.log("No audio chunks recorded");
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Create audio blob
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      // Show feedback
      toast({
        title: "Processing Speech",
        description: "Converting your audio to text...",
        duration: 3000,
      });
      
      // Convert to base64
      const reader = new FileReader();
      
      return new Promise<void>((resolve, reject) => {
        reader.onloadend = async () => {
          try {
            const base64Audio = reader.result?.toString().split(',')[1];
            
            if (!base64Audio) {
              throw new Error("Failed to convert audio to base64");
            }
            
            console.log("Audio data converted to base64, calling edge function...");
            
            // Call voice-transcription edge function
            const { data, error } = await supabase.functions.invoke('voice-transcription', {
              body: { audio: base64Audio }
            });
            
            console.log("Edge function response:", data, error);
            
            if (error) {
              throw new Error(`Transcription error: ${error.message}`);
            }
            
            if (!data || !data.text) {
              // If the edge function succeeded but returned no text
              if (data && data.fallback) {
                throw new Error(data.message || "No transcription available");
              } else {
                throw new Error("No transcription received");
              }
            }
            
            // Success! Set transcript and notify
            const finalTranscript = data.text;
            console.log("Received transcript:", finalTranscript);
            
            setTranscript(finalTranscript);
            setLastTranscript(finalTranscript);
            
            if (onTranscriptComplete) {
              console.log("Calling onTranscriptComplete with:", finalTranscript);
              onTranscriptComplete(finalTranscript);
            }
            
            toast({
              title: "Transcription Complete",
              description: "Your speech has been converted to text",
              duration: 3000,
            });
            
            resolve();
          } catch (err) {
            console.error("Error processing audio:", err);
            setError(err instanceof Error ? err : new Error('Unknown error'));
            
            toast({
              title: "Transcription Error",
              description: err instanceof Error ? err.message : "Failed to transcribe audio",
              variant: "destructive",
            });
            
            reject(err);
          } finally {
            setIsProcessing(false);
            setIsListening(false);
          }
        };
        
        reader.onerror = (err) => {
          console.error("FileReader error:", err);
          setError(new Error('Failed to read audio file'));
          setIsProcessing(false);
          setIsListening(false);
          reject(err);
        };
        
        // Start reading the blob as data URL
        reader.readAsDataURL(audioBlob);
      });
    } catch (err) {
      console.error("Error in processRecording:", err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setIsProcessing(false);
      setIsListening(false);
      throw err;
    }
  };
  
  // Stop recording
  const stopListening = useCallback(() => {
    console.log("Stopping voice recording...");
    
    // Clear timers
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    // Stop the MediaRecorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      // Clean up if MediaRecorder wasn't started properly
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      setIsListening(false);
    }
  }, [timerInterval]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Clear any timers
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      
      // Stop recording if active
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      
      // Release media stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [timerInterval]);
  
  return {
    isListening,
    transcript,
    lastTranscript,
    supportsVoice,
    error,
    isProcessing,
    startListening,
    stopListening,
    recordingDuration
  };
};
