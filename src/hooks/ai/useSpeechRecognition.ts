
import { useState, useEffect, useCallback, useRef } from 'react';
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
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();
  
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
  
  // Initialize recognition instance with event handlers
  const initializeRecognition = useCallback(() => {
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
    
    // Set up event handlers
    recognition.onstart = () => {
      console.log("Browser speech recognition started");
      setIsListening(true);
    };
    
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const current = event.resultIndex;
      
      if (current < event.results.length) {
        const result = event.results[current];
        const transcriptText = result[0].transcript;
        
        console.log("Speech recognition result:", { 
          text: transcriptText,
          confidence: result[0].confidence,
          isFinal: result.isFinal
        });
        
        if (result.isFinal || !options?.interimResults) {
          setTranscript(transcriptText);
        } else if (options?.interimResults) {
          setTranscript(prev => transcriptText);
        }
      }
    };
    
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error, event.message);
      setIsListening(false);
      
      if (event.error === 'not-allowed') {
        toast({
          title: "Microphone Access Denied",
          description: "Please allow microphone access to use voice input.",
          variant: "destructive",
        });
      } else if (event.error === 'network') {
        toast({
          title: "Network Error",
          description: "Check your internet connection.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Speech Recognition Error",
          description: `Error: ${event.error}`,
          variant: "destructive",
        });
      }
    };
    
    recognition.onend = () => {
      console.log("Browser speech recognition ended");
      setIsListening(false);
      
      // If continuous is enabled and we're still supposed to be listening, restart
      if (options?.continuous && isListening) {
        try {
          recognition.start();
        } catch (error) {
          console.error("Failed to restart continuous recognition:", error);
        }
      }
    };
    
    return recognition;
  }, [options?.language, options?.continuous, options?.interimResults, toast, isListening]);
  
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
    
    try {
      // Clear previous transcript when starting fresh
      setTranscript('');
      
      // Create a new recognition instance or reuse existing
      if (!recognitionRef.current) {
        recognitionRef.current = initializeRecognition();
      }
      
      if (!recognitionRef.current) {
        throw new Error("Could not initialize speech recognition");
      }
      
      // Start listening
      recognitionRef.current.start();
      console.log("Started browser speech recognition");
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      toast({
        title: "Error",
        description: "Failed to start speech recognition. Try refreshing the page.",
        variant: "destructive",
      });
    }
  }, [supported, initializeRecognition, toast]);
  
  // Function to stop listening
  const stopListening = useCallback(() => {
    if (!supported || !recognitionRef.current) return;
    
    try {
      recognitionRef.current.stop();
      console.log("Stopped browser speech recognition");
    } catch (error) {
      console.error("Error stopping speech recognition:", error);
    }
  }, [supported]);
  
  // Function to reset transcript
  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (supported && recognitionRef.current && isListening) {
        try {
          recognitionRef.current.stop();
          console.log("Cleaned up browser speech recognition on unmount");
        } catch (error) {
          console.error("Error cleaning up speech recognition:", error);
        }
      }
    };
  }, [supported, isListening]);
  
  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    supported
  };
};
