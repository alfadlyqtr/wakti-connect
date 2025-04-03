
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface SpeechRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

export const useSpeechRecognition = (options?: SpeechRecognitionOptions) => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const { toast } = useToast();
  
  // Reference to the SpeechRecognition instance
  const recognitionRef = useCallback(() => {
    if (typeof window === 'undefined') return null;
    
    // Check for browser support (different implementations)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      return null;
    }
    
    const recognition = new SpeechRecognition();
    
    // Set options
    recognition.lang = options?.language || 'en-US';
    recognition.continuous = options?.continuous ?? false;
    recognition.interimResults = options?.interimResults ?? true;
    
    return recognition;
  }, [options?.language, options?.continuous, options?.interimResults]);
  
  // Check for browser support on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Test if SpeechRecognition is available
    const isSupported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    setSupported(isSupported);
    
    if (!isSupported) {
      console.warn('Speech recognition is not supported in this browser');
    }
  }, []);
  
  // Function to start listening
  const startListening = useCallback(() => {
    if (!supported) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }
    
    const recognition = recognitionRef();
    if (!recognition) return;
    
    // Clear previous transcript
    setTranscript('');
    
    // Set up event handlers
    recognition.onstart = () => {
      setIsListening(true);
    };
    
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const current = event.resultIndex;
      const result = event.results[current];
      const transcript = result[0].transcript;
      
      setTranscript(prev => {
        // If this is a final result or we're not using interim results, replace the transcript
        if (result.isFinal || !options?.interimResults) {
          return transcript;
        }
        // Otherwise, keep updating the interim results
        return prev + ' ' + transcript;
      });
    };
    
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      if (event.error === 'not-allowed') {
        toast({
          title: "Microphone Access Denied",
          description: "Please allow microphone access to use voice input.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: `Speech recognition error: ${event.error}`,
          variant: "destructive",
        });
      }
    };
    
    recognition.onend = () => {
      setIsListening(false);
      
      // If continuous is enabled, restart listening
      if (options?.continuous && isListening) {
        recognition.start();
      }
    };
    
    // Start listening
    try {
      recognition.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      toast({
        title: "Error",
        description: "Failed to start speech recognition.",
        variant: "destructive",
      });
    }
  }, [supported, recognitionRef, options?.continuous, options?.interimResults, toast, isListening]);
  
  // Function to stop listening
  const stopListening = useCallback(() => {
    if (!supported) return;
    
    const recognition = recognitionRef();
    if (!recognition) return;
    
    recognition.stop();
    setIsListening(false);
  }, [supported, recognitionRef]);
  
  // Function to reset transcript
  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (supported && isListening) {
        const recognition = recognitionRef();
        if (recognition) {
          recognition.stop();
        }
      }
    };
  }, [supported, isListening, recognitionRef]);
  
  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    supported
  };
};
