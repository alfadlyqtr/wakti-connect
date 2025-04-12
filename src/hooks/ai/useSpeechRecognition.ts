
import { useState, useEffect, useCallback, useRef } from 'react';
import { useVoiceSettings } from '@/store/voiceSettings';
import { supabase } from '@/integrations/supabase/client';

interface SpeechRecognitionOptions {
  language?: string;
  silenceThreshold?: number;
  silenceTimeout?: number;
}

export const useSpeechRecognition = (options: SpeechRecognitionOptions = {}) => {
  const { language = 'en-US', silenceThreshold = 0.01, silenceTimeout = 1500 } = options;
  const { voiceEnabled } = useVoiceSettings();
  
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [temporaryTranscript, setTemporaryTranscript] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  
  const supported = typeof window !== 'undefined' && 'MediaRecorder' in window;
  
  // Alias properties to maintain compatibility with components expecting different property names
  const isListening = isRecording;
  
  // Function to stop recording
  const stopRecording = useCallback(() => {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
      return;
    }
    
    try {
      // Stop the MediaRecorder
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // We don't stop the tracks here - we'll do that after processing the audio
      console.log("Recording stopped, waiting for data to process");
    } catch (err) {
      console.error("Error stopping recording:", err);
      setError(err instanceof Error ? err : new Error('Unknown error stopping recording'));
      cleanupRecording();
    }
  }, []);
  
  // Function to cleanup recording resources
  const cleanupRecording = useCallback(() => {
    // Stop all tracks from the stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      mediaStreamRef.current = null;
    }
    
    // Reset MediaRecorder
    mediaRecorderRef.current = null;
    
    // Reset state
    setIsRecording(false);
    setIsProcessing(false);
  }, []);
  
  // Function to convert Blob to base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };
  
  // Process recorded audio with Whisper API
  const processAudio = useCallback(async (audioBlob: Blob) => {
    if (!audioBlob || audioBlob.size === 0) {
      setError(new Error('No audio data captured'));
      setIsProcessing(false);
      cleanupRecording();
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Convert audio blob to base64
      const base64Audio = await blobToBase64(audioBlob);
      
      // Set temporary transcript while processing
      setTemporaryTranscript("Processing your voice...");
      
      // Call Supabase Edge Function for transcription
      const { data, error } = await supabase.functions.invoke('ai-voice-to-text', {
        body: { 
          audio: base64Audio,
          language
        }
      });
      
      if (error) {
        throw new Error(`API error: ${error.message}`);
      }
      
      if (data && data.text) {
        setTemporaryTranscript(data.text);
      } else {
        throw new Error('No transcription returned');
      }
    } catch (err) {
      console.error('Error processing audio:', err);
      setError(err instanceof Error ? err : new Error('Unknown error processing audio'));
      setTemporaryTranscript(null);
    } finally {
      setIsProcessing(false);
      cleanupRecording();
    }
  }, [language, cleanupRecording]);
  
  // Function to start recording
  const startRecording = useCallback(async () => {
    if (!supported || !voiceEnabled) {
      setError(new Error('Voice recording not supported or disabled'));
      return;
    }
    
    try {
      // Reset state
      setTranscript('');
      setTemporaryTranscript(null);
      setError(null);
      audioChunksRef.current = [];
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      // Set up MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      // Set up audio level detection
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      // Function to update audio level
      const updateAudioLevel = () => {
        if (isRecording) {
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
          }
          const average = sum / bufferLength;
          const level = average / 128; // Normalize to 0-1
          setAudioLevel(level);
          
          requestAnimationFrame(updateAudioLevel);
        }
      };
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        console.log("MediaRecorder stopped, processing audio chunks:", audioChunksRef.current.length);
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      console.log("Recording started");
      
      // Start updating audio level
      requestAnimationFrame(updateAudioLevel);
      
    } catch (err) {
      console.error('Error starting recording:', err);
      setError(err instanceof Error ? err : new Error('Unknown error starting recording'));
      cleanupRecording();
    }
  }, [supported, voiceEnabled, processAudio, cleanupRecording, isRecording]);
  
  // Confirm the temporary transcript
  const confirmTranscript = useCallback(() => {
    if (temporaryTranscript) {
      setTranscript(temporaryTranscript);
      setTemporaryTranscript(null);
    }
  }, [temporaryTranscript]);
  
  // Reset transcript
  const resetTranscript = useCallback(() => {
    setTranscript('');
    setTemporaryTranscript(null);
  }, []);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      cleanupRecording();
    };
  }, [cleanupRecording]);
  
  // Alias methods to maintain backward compatibility
  const startListening = startRecording;
  const stopListening = stopRecording;
  const processing = isProcessing;
  
  return {
    isRecording,
    startRecording,
    stopRecording,
    transcript,
    resetTranscript,
    error,
    isProcessing,
    supported,
    // Aliases for backward compatibility
    isListening,
    startListening,
    stopListening,
    processing,
    temporaryTranscript,
    confirmTranscript,
    audioLevel
  };
};
