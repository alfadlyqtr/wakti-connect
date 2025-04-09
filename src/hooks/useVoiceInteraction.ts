
import { useState, useEffect, useCallback, useRef } from 'react';

interface VoiceInteractionOptions {
  onTranscriptComplete?: (transcript: string) => void;
  continuousListening?: boolean;
  maxRecordingDuration?: number; // in seconds
}

export const useVoiceInteraction = (options: VoiceInteractionOptions = {}) => {
  const { 
    onTranscriptComplete, 
    continuousListening = false,
    maxRecordingDuration = 10 // Default to 10 seconds
  } = options;
  
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Check if browser supports speech recognition
  const supportsVoice = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  
  const SpeechRecognition = typeof window !== 'undefined' 
    ? window.SpeechRecognition || (window as any).webkitSpeechRecognition 
    : null;
  
  let recognition: any = null;
  
  const startListening = useCallback(() => {
    if (!supportsVoice) {
      setError(new Error('Speech recognition not supported'));
      return;
    }
    
    try {
      recognition = new SpeechRecognition();
      recognition.continuous = continuousListening;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
        
        // Set a timer to automatically stop recording after maxRecordingDuration
        if (maxRecordingDuration > 0) {
          timerRef.current = setTimeout(() => {
            if (recognition) {
              recognition.stop();
            }
          }, maxRecordingDuration * 1000);
        }
      };
      
      recognition.onresult = (event: any) => {
        const currentTranscript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        
        setTranscript(currentTranscript);
      };
      
      recognition.onerror = (event: any) => {
        setError(new Error(event.error));
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
        
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        
        if (onTranscriptComplete && transcript) {
          onTranscriptComplete(transcript);
        }
      };
      
      recognition.start();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setIsListening(false);
    }
  }, [continuousListening, onTranscriptComplete, supportsVoice, transcript, maxRecordingDuration]);
  
  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
    }
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    setIsListening(false);
  }, []);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognition) {
        recognition.stop();
      }
      
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
  
  return {
    isListening,
    transcript,
    supportsVoice,
    error,
    startListening,
    stopListening,
    remainingTime: maxRecordingDuration
  };
};
