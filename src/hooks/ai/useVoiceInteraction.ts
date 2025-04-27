
import { useState, useEffect, useRef, useCallback } from 'react';

interface VoiceInteractionOptions {
  language?: string;
  onTranscriptUpdate?: (text: string) => void;
  onTranscriptComplete?: (text: string) => void;
  continuousListening?: boolean;
}

export function useVoiceInteraction(options: VoiceInteractionOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyStatus, setApiKeyStatus] = useState<'valid' | 'invalid' | 'checking'>('checking');
  const [apiKeyErrorDetails, setApiKeyErrorDetails] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const supportsVoice = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  
  // Initialize speech recognition
  useEffect(() => {
    if (!supportsVoice) {
      setError('Speech recognition is not supported in this browser');
      return;
    }
    
    // Create recognition object
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = options.continuousListening || false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = options.language || 'en-US';
    
    // Set up event handlers
    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setError(null);
    };
    
    recognitionRef.current.onend = () => {
      if (options.onTranscriptComplete && transcript) {
        options.onTranscriptComplete(transcript);
      }
      setIsListening(false);
    };
    
    recognitionRef.current.onresult = (event: any) => {
      const current = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');
      
      setTranscript(current);
      
      if (options.onTranscriptUpdate) {
        options.onTranscriptUpdate(current);
      }
    };
    
    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setError(event.error);
      setIsListening(false);
    };
    
    setApiKeyStatus('valid'); // Just assume it's valid for now
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        recognitionRef.current.onstart = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        
        if (isListening) {
          try {
            recognitionRef.current.stop();
          } catch (err) {
            console.error('Error stopping recognition:', err);
          }
        }
      }
    };
  }, [supportsVoice, options.language, options.onTranscriptUpdate, options.onTranscriptComplete, options.continuousListening, transcript]);
  
  // Start listening
  const startListening = useCallback(() => {
    if (!supportsVoice || !recognitionRef.current) {
      setError('Speech recognition is not available');
      return;
    }
    
    setTranscript('');
    setError(null);
    setIsProcessing(true);
    
    try {
      recognitionRef.current.start();
    } catch (err) {
      console.error('Error starting speech recognition:', err);
      setError('Failed to start speech recognition');
      setIsProcessing(false);
    }
  }, [supportsVoice]);
  
  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
        setIsProcessing(false);
      } catch (err) {
        console.error('Error stopping speech recognition:', err);
        setError('Failed to stop speech recognition');
      }
    }
  }, [isListening]);
  
  // Retry API key validation
  const retryApiKeyValidation = useCallback(() => {
    setApiKeyStatus('checking');
    // Simulate API check
    setTimeout(() => {
      setApiKeyStatus('valid');
      setApiKeyErrorDetails(null);
    }, 1000);
  }, []);
  
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
}
