
import { useState, useEffect, useCallback } from 'react';

interface VoiceInteractionOptions {
  onTranscriptComplete?: (transcript: string) => void;
  continuousListening?: boolean;
}

export const useVoiceInteraction = (options: VoiceInteractionOptions = {}) => {
  const { onTranscriptComplete, continuousListening = false } = options;
  
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastTranscript, setLastTranscript] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<'valid' | 'invalid' | 'unknown'>('unknown');
  const [apiKeyErrorDetails, setApiKeyErrorDetails] = useState<string | null>(null);
  
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
        
        if (onTranscriptComplete && transcript) {
          onTranscriptComplete(transcript);
          setLastTranscript(transcript);
        }
      };
      
      recognition.start();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setIsListening(false);
    }
  }, [continuousListening, onTranscriptComplete, supportsVoice, transcript]);
  
  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
    }
    setIsListening(false);
  }, []);
  
  // Function to validate the OpenAI API key
  const retryApiKeyValidation = async (): Promise<boolean> => {
    setIsProcessing(true);
    
    try {
      // Simple validation - you would typically replace this with a real API check
      setApiKeyStatus('valid');
      setApiKeyErrorDetails(null);
      setIsProcessing(false);
      return true;
    } catch (err) {
      console.error('Error validating API key:', err);
      setApiKeyStatus('invalid');
      setApiKeyErrorDetails(err instanceof Error ? err.message : 'Unknown error');
      setIsProcessing(false);
      return false;
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);
  
  return {
    isListening,
    transcript,
    lastTranscript,
    supportsVoice,
    error,
    isProcessing,
    startListening,
    stopListening,
    apiKeyStatus,
    apiKeyErrorDetails,
    retryApiKeyValidation
  };
};
