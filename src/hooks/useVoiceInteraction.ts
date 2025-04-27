
import { useState, useCallback, useEffect } from 'react';

export interface VoiceInteractionOptions {
  onTranscript?: (transcript: string) => void;
  onTranscriptComplete?: (transcript: string) => void;
  continuous?: boolean;
  language?: string;
  continuousListening?: boolean;
}

export interface VoiceInteractionResult {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  supportsVoice: boolean;
  isProcessing?: boolean;
  error?: Error;
  apiKeyStatus?: 'valid' | 'invalid' | 'checking' | 'not_set';
  apiKeyErrorDetails?: string;
  retryApiKeyValidation?: () => void;
}

export const useVoiceInteraction = (options?: VoiceInteractionOptions): VoiceInteractionResult => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supportsVoice, setSupportsVoice] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<'valid' | 'invalid' | 'checking' | 'not_set'>('not_set');
  const [apiKeyErrorDetails, setApiKeyErrorDetails] = useState('');

  useEffect(() => {
    // Check if browser supports speech recognition
    setSupportsVoice('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  }, []);

  const startListening = useCallback(() => {
    if (!supportsVoice) {
      setError(new Error('Speech recognition not supported in this browser.'));
      return;
    }

    try {
      setIsListening(true);
      setTranscript('');
      setIsProcessing(true);
      
      // In a real implementation, we would start the speech recognition here
      // For now, we'll simulate it with a timeout
      setTimeout(() => {
        setIsProcessing(false);
      }, 1000);
      
    } catch (err) {
      setError(err as Error);
      setIsListening(false);
    }
  }, [supportsVoice]);

  const stopListening = useCallback(() => {
    setIsListening(false);
    // In a real implementation, we would stop the speech recognition here
  }, []);

  const retryApiKeyValidation = useCallback(() => {
    setApiKeyStatus('checking');
    // Simulate API key validation
    setTimeout(() => {
      setApiKeyStatus('valid');
    }, 1000);
  }, []);

  // Handle transcript completion
  useEffect(() => {
    if (transcript && options?.onTranscriptComplete) {
      options.onTranscriptComplete(transcript);
    }
  }, [transcript, options]);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    supportsVoice,
    isProcessing,
    error,
    apiKeyStatus,
    apiKeyErrorDetails,
    retryApiKeyValidation
  };
};

export default useVoiceInteraction;
