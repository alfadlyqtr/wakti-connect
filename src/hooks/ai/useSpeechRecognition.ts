
import { useState, useEffect, useCallback } from 'react';

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
    const isSpeechRecognitionSupported = typeof window !== 'undefined' && (
      'SpeechRecognition' in window || 
      'webkitSpeechRecognition' in window
    );
    
    setSupported(isSpeechRecognitionSupported);
  }, []);
  
  // Start listening for speech
  const startListening = useCallback(() => {
    if (!supported) {
      setError('Speech recognition is not supported in this browser');
      return;
    }
    
    try {
      // Reset transcript
      setTranscript('');
      setError(null);
      
      // Create speech recognition instance
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        throw new Error("Speech recognition not available in this browser");
      }
      
      const recognition = new SpeechRecognition();
      
      // Configure
      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      recognition.lang = lang;
      
      // Set up events
      recognition.onstart = () => {
        console.log("Speech recognition started");
        setIsListening(true);
      };
      
      recognition.onresult = (event) => {
        const lastResultIndex = event.results.length - 1;
        const lastResult = event.results[lastResultIndex];
        const recognizedText = lastResult[0].transcript;
        
        setTranscript(recognizedText);
        console.log("Recognized:", recognizedText);
      };
      
      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        console.log("Speech recognition ended");
        setIsListening(false);
      };
      
      // Start listening
      recognition.start();
      
      // Store recognition instance in window for stopping later
      (window as any).__recognitionInstance = recognition;
    } catch (err) {
      console.error("Could not start speech recognition:", err);
      setError(`Could not start speech recognition: ${err instanceof Error ? err.message : String(err)}`);
      setIsListening(false);
    }
  }, [supported, continuous, interimResults, lang]);
  
  // Stop listening
  const stopListening = useCallback(() => {
    console.log("Attempting to stop speech recognition");
    try {
      if ((window as any).__recognitionInstance) {
        (window as any).__recognitionInstance.stop();
        (window as any).__recognitionInstance = null;
      }
      setIsListening(false);
    } catch (err) {
      console.error("Error stopping speech recognition:", err);
      // Force the listening state to false even if there was an error
      setIsListening(false);
    }
  }, []);
  
  // Reset transcript
  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      try {
        if ((window as any).__recognitionInstance) {
          (window as any).__recognitionInstance.stop();
          (window as any).__recognitionInstance = null;
        }
        setIsListening(false);
      } catch (err) {
        console.error("Error cleaning up speech recognition:", err);
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
