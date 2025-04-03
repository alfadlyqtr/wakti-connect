
import { useState, useEffect } from 'react';

interface UseSpeechRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
}

export const useSpeechRecognition = (options: UseSpeechRecognitionOptions = {}) => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    continuous = false, 
    interimResults = true, 
    lang = 'en-US'
  } = options;
  
  // Check if browser supports speech recognition
  useEffect(() => {
    // Check for the SpeechRecognition API
    const isSpeechRecognitionSupported = 
      'SpeechRecognition' in window || 
      'webkitSpeechRecognition' in window;
    
    setSupported(isSpeechRecognitionSupported);
  }, []);
  
  // Start listening for speech
  const startListening = () => {
    if (!supported) {
      setError('Speech recognition is not supported in this browser');
      return;
    }
    
    // Reset transcript
    setTranscript('');
    setError(null);
    
    // Create speech recognition instance
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    // Configure
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = lang;
    
    // Set up events
    recognition.onstart = () => {
      setIsListening(true);
    };
    
    recognition.onresult = (event) => {
      const lastResultIndex = event.results.length - 1;
      const lastResult = event.results[lastResultIndex];
      const recognizedText = lastResult[0].transcript;
      
      setTranscript(recognizedText);
    };
    
    recognition.onerror = (event) => {
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    // Start listening
    try {
      recognition.start();
      
      // Store recognition instance in window for stopping later
      (window as any).__recognitionInstance = recognition;
    } catch (err) {
      setError(`Could not start speech recognition: ${err instanceof Error ? err.message : String(err)}`);
    }
  };
  
  // Stop listening
  const stopListening = () => {
    if ((window as any).__recognitionInstance) {
      (window as any).__recognitionInstance.stop();
      (window as any).__recognitionInstance = null;
    }
    setIsListening(false);
  };
  
  // Reset transcript
  const resetTranscript = () => {
    setTranscript('');
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if ((window as any).__recognitionInstance) {
        (window as any).__recognitionInstance.stop();
        (window as any).__recognitionInstance = null;
      }
    };
  }, []);
  
  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    supported,
    error
  };
};
