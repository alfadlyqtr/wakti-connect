
import { useState, useEffect, useCallback, useRef } from 'react';

interface SpeechRecognitionOptions {
  silenceThreshold?: number;
  silenceTimeout?: number;
}

interface UseSpeechRecognitionResult {
  isRecording: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  transcript: string;
  resetTranscript: () => void;
  error: Error | null;
  isProcessing: boolean;
  supported: boolean;
  temporaryTranscript: string;
  confirmTranscript: () => void;
  audioLevel: number;
}

export const useSpeechRecognition = (options: SpeechRecognitionOptions = {}): UseSpeechRecognitionResult => {
  const { silenceThreshold = 0.01, silenceTimeout = 1500 } = options;
  
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [temporaryTranscript, setTemporaryTranscript] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneStreamRef = useRef<MediaStream | null>(null);
  const silenceTimerRef = useRef<number | null>(null);
  
  // Check if browser supports speech recognition
  const supported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  
  const SpeechRecognition = typeof window !== 'undefined' 
    ? window.SpeechRecognition || (window as any).webkitSpeechRecognition 
    : null;
  
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
  
  const setupAudioAnalysis = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('MediaDevices API not supported');
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      microphoneStreamRef.current = stream;
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const checkAudioLevel = () => {
        if (!analyserRef.current) return;
        
        analyserRef.current.getByteFrequencyData(dataArray);
        
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        
        const average = sum / bufferLength / 255; // Normalize to 0-1
        setAudioLevel(average);
        
        // Check for silence
        if (average < silenceThreshold) {
          if (silenceTimerRef.current === null) {
            silenceTimerRef.current = window.setTimeout(() => {
              if (isRecording) {
                stopRecording();
              }
            }, silenceTimeout);
          }
        } else {
          if (silenceTimerRef.current !== null) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
          }
        }
        
        if (isRecording) {
          requestAnimationFrame(checkAudioLevel);
        }
      };
      
      requestAnimationFrame(checkAudioLevel);
    } catch (err) {
      console.error('Error setting up audio analysis:', err);
      setError(err instanceof Error ? err : new Error('Failed to access microphone'));
    }
  }, [isRecording, silenceThreshold, silenceTimeout]);
  
  const startRecording = useCallback(async () => {
    if (!supported) {
      setError(new Error('Speech recognition not supported in this browser'));
      return;
    }
    
    try {
      resetTranscript();
      setIsProcessing(true);
      setError(null);
      
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onstart = () => {
        setIsRecording(true);
        setIsProcessing(false);
      };
      
      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        
        setTemporaryTranscript(transcript);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setError(new Error(event.error));
        setIsRecording(false);
        setIsProcessing(false);
      };
      
      recognitionRef.current.onend = () => {
        if (temporaryTranscript) {
          setTranscript(temporaryTranscript);
        }
        
        setIsRecording(false);
        setIsProcessing(false);
        setTemporaryTranscript('');
      };
      
      await setupAudioAnalysis();
      recognitionRef.current.start();
    } catch (err) {
      console.error('Error starting speech recognition:', err);
      setError(err instanceof Error ? err : new Error('Failed to start speech recognition'));
      setIsRecording(false);
      setIsProcessing(false);
    }
  }, [resetTranscript, setupAudioAnalysis, supported, temporaryTranscript]);
  
  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error('Error stopping recognition:', err);
      }
    }
    
    // Clean up audio analysis
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    
    if (microphoneStreamRef.current) {
      microphoneStreamRef.current.getTracks().forEach(track => track.stop());
      microphoneStreamRef.current = null;
    }
    
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(console.error);
    }
    
    setIsRecording(false);
  }, []);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopRecording();
      
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      
      if (microphoneStreamRef.current) {
        microphoneStreamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(console.error);
      }
    };
  }, [stopRecording]);
  
  return {
    isRecording,
    startRecording,
    stopRecording,
    transcript,
    resetTranscript,
    error,
    isProcessing,
    supported,
    temporaryTranscript,
    confirmTranscript,
    audioLevel
  };
};
