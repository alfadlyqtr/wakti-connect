
import { useState, useRef, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface SpeechRecognitionOptions {
  silenceThreshold?: number;
  silenceTimeout?: number; 
  language?: string;
  continuous?: boolean;
}

export const useSpeechRecognition = (options: SpeechRecognitionOptions = {}) => {
  const {
    silenceThreshold = 0.02,
    silenceTimeout = 1500,
    language = 'en-US',
    continuous = false,
  } = options;

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [temporaryTranscript, setTemporaryTranscript] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [supported, setSupported] = useState(true);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioDataRef = useRef<Uint8Array | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const silenceTimerRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Check if browser supports necessary APIs
  useEffect(() => {
    const isSupported = 
      typeof window !== 'undefined' && 
      navigator.mediaDevices &&
      window.AudioContext !== undefined;
    
    setSupported(isSupported);
  }, []);

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      stopRecording();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, []);

  // Process audio levels for visualization
  const processAudioLevel = useCallback(() => {
    if (!analyserRef.current || !audioDataRef.current || !isRecording) return;

    analyserRef.current.getByteFrequencyData(audioDataRef.current);
    
    // Calculate average level from frequency data
    let sum = 0;
    for (let i = 0; i < audioDataRef.current.length; i++) {
      sum += audioDataRef.current[i];
    }
    const avgLevel = sum / audioDataRef.current.length / 255;
    setAudioLevel(avgLevel);

    // Detect silence for auto-stop if not in continuous mode
    if (!continuous && silenceThreshold && silenceTimeout) {
      if (avgLevel < silenceThreshold) {
        if (silenceTimerRef.current === null) {
          silenceTimerRef.current = window.setTimeout(() => {
            console.log("Silence detected, stopping recording");
            stopRecording();
          }, silenceTimeout);
        }
      } else {
        if (silenceTimerRef.current !== null) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }
      }
    }

    // Continue monitoring audio levels
    animationFrameRef.current = requestAnimationFrame(processAudioLevel);
  }, [isRecording, continuous, silenceThreshold, silenceTimeout]);

  const startRecording = useCallback(async () => {
    if (!supported) {
      setError(new Error('Speech recognition not supported in this browser'));
      return;
    }

    try {
      // Reset state
      setError(null);
      setTranscript('');
      setTemporaryTranscript('');
      audioChunksRef.current = [];

      // Initialize audio context for level monitoring
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      audioDataRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);

      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      // Connect to analyser for audio level visualization
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      // Set up recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Start recording
      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);

      // Start monitoring audio levels
      animationFrameRef.current = requestAnimationFrame(processAudioLevel);

    } catch (err) {
      console.error('Error starting speech recognition:', err);
      setError(err instanceof Error ? err : new Error('Unknown recording error'));
    }
  }, [supported, processAudioLevel]);

  const stopRecording = useCallback(async () => {
    // Clear any silence detection timer
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    // Stop animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
      return;
    }

    try {
      // Set recording state to false and show processing state
      setIsRecording(false);
      setIsProcessing(true);
      
      // Get final chunks and stop recorder
      mediaRecorderRef.current.stop();
      
      // Stop all tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      // Wait a moment for ondataavailable to fire
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Process audio if we have chunks
      if (audioChunksRef.current.length > 0) {
        // Create a blob from all chunks
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        // Temp transcript for immediate feedback
        setTemporaryTranscript("Processing your voice...");
        
        // Convert to base64 for the edge function
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          try {
            // Extract base64 data
            const base64data = reader.result?.toString().split(',')[1];
            
            if (!base64data) {
              throw new Error('Failed to convert audio to base64');
            }
            
            console.log('Sending audio to Edge Function for transcription...');
            
            // Call the Edge Function
            const { data, error } = await supabase.functions.invoke('ai-voice-to-text', {
              body: { audio: base64data }
            });
            
            if (error) {
              throw new Error(`Edge function error: ${error.message}`);
            }
            
            if (!data.text) {
              throw new Error('No transcription returned');
            }
            
            console.log('Transcription received:', data.text);
            setTemporaryTranscript(data.text);
            
            // If we're not waiting for confirmation, set transcript directly
            if (!continuous) {
              setTranscript(data.text);
            }
          } catch (err) {
            console.error('Transcription error:', err);
            setError(err instanceof Error ? err : new Error('Failed to transcribe audio'));
            setTemporaryTranscript('');
          } finally {
            setIsProcessing(false);
          }
        };
      } else {
        setIsProcessing(false);
        setTemporaryTranscript('');
      }
    } catch (err) {
      console.error('Error stopping recording:', err);
      setError(err instanceof Error ? err : new Error('Error stopping recording'));
      setIsProcessing(false);
    }
  }, [continuous]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setTemporaryTranscript('');
  }, []);

  const confirmTranscript = useCallback(() => {
    if (temporaryTranscript) {
      setTranscript(temporaryTranscript);
      setTemporaryTranscript('');
    }
  }, [temporaryTranscript]);

  return {
    startRecording,
    stopRecording,
    resetTranscript,
    confirmTranscript,
    transcript,
    temporaryTranscript,
    isRecording,
    isProcessing,
    audioLevel,
    error,
    supported
  };
};
