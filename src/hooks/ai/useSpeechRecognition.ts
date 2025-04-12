
import { useState, useEffect, useCallback, useRef } from 'react';
import { useVoiceSettings } from '@/store/voiceSettings';
import { supabase } from '@/integrations/supabase/client';

interface SpeechRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  language?: string;
  silenceThreshold?: number;
  silenceTimeout?: number;
}

export const useSpeechRecognition = (options: SpeechRecognitionOptions = {}) => {
  const {
    continuous = false,
    interimResults = true,
    language = 'en-US',
    silenceThreshold = 0.01,
    silenceTimeout = 1500,
  } = options;
  
  const { autoSilenceDetection, visualFeedback, voiceEnabled } = useVoiceSettings();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [processing, setProcessing] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const silenceTimerRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  const supported = typeof window !== 'undefined' && 
    (('SpeechRecognition' in window) || 
    ('webkitSpeechRecognition' in window) || 
    ('MediaRecorder' in window));
  
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
      setProcessing(false);
      return;
    }
    
    try {
      setProcessing(true);
      
      // Convert audio blob to base64
      const base64Audio = await blobToBase64(audioBlob);
      
      // Call Supabase Edge Function for transcription
      const { data, error } = await supabase.functions.invoke('ai-voice-to-text', {
        body: { audio: base64Audio }
      });
      
      if (error) {
        throw new Error(`API error: ${error.message}`);
      }
      
      if (data && data.text) {
        setFinalTranscript(data.text);
        setTranscript(data.text);
      } else {
        throw new Error('No transcription returned');
      }
    } catch (err) {
      console.error('Error processing audio:', err);
      setError(err instanceof Error ? err : new Error('Unknown error processing audio'));
    } finally {
      setProcessing(false);
    }
  }, []);
  
  // Define stopListening function first to avoid the circular reference
  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      
      // Stop all tracks from the stream
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    }
    
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    
    setIsListening(false);
    setAudioLevel(0);
  }, []);
  
  const analyzeAudioLevel = useCallback(() => {
    if (!analyserRef.current || !visualFeedback) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    // Calculate average level
    const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
    const normalizedLevel = average / 255; // Normalize to 0-1
    
    setAudioLevel(normalizedLevel);
    
    // Check for silence if autoSilenceDetection is enabled
    if (autoSilenceDetection && isListening && normalizedLevel < silenceThreshold) {
      if (silenceTimerRef.current === null) {
        silenceTimerRef.current = window.setTimeout(() => {
          stopListening();
          silenceTimerRef.current = null;
        }, silenceTimeout);
      }
    } else if (silenceTimerRef.current !== null) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    
    // Continue analyzing if still listening
    if (isListening) {
      requestAnimationFrame(analyzeAudioLevel);
    }
  }, [autoSilenceDetection, isListening, silenceThreshold, silenceTimeout, visualFeedback, stopListening]);
  
  const startListening = useCallback(async () => {
    if (!supported || !voiceEnabled) {
      setError(new Error('Speech recognition not supported or disabled'));
      return;
    }
    
    try {
      setIsListening(true);
      setTranscript('');
      setFinalTranscript('');
      setError(null);
      audioChunksRef.current = [];
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Set up audio context for level analysis
      if (visualFeedback) {
        audioContextRef.current = new AudioContext();
        const source = audioContextRef.current.createMediaStreamSource(stream);
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        source.connect(analyserRef.current);
        
        requestAnimationFrame(analyzeAudioLevel);
      }
      
      // Set up MediaRecorder
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        
        // Clean up
        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
          analyserRef.current = null;
        }
      };
      
      mediaRecorderRef.current.start();
    } catch (err) {
      console.error('Error starting speech recognition:', err);
      setError(err instanceof Error ? err : new Error('Unknown error starting recognition'));
      setIsListening(false);
    }
  }, [supported, voiceEnabled, visualFeedback, analyzeAudioLevel, processAudio]);
  
  const resetTranscript = useCallback(() => {
    setTranscript('');
    setFinalTranscript('');
  }, []);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        
        if (mediaRecorderRef.current.stream) {
          mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
      }
      
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);
  
  return {
    isListening,
    startListening,
    stopListening,
    transcript,
    finalTranscript,
    resetTranscript,
    error,
    processing,
    audioLevel,
    supported
  };
};
