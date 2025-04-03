
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface SpeechRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
}

export const useSpeechRecognition = (options?: SpeechRecognitionOptions) => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [supported, setSupported] = useState(false);
  const { toast } = useToast();

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window['webkitSpeechRecognition'];
    
    if (SpeechRecognition) {
      setSupported(true);
      const recognitionInstance = new SpeechRecognition();
      
      // Apply options
      recognitionInstance.continuous = options?.continuous ?? true;
      recognitionInstance.interimResults = options?.interimResults ?? true;
      recognitionInstance.lang = options?.language ?? 'en-US';
      recognitionInstance.maxAlternatives = options?.maxAlternatives ?? 1;
      
      setRecognition(recognitionInstance);
    } else {
      console.warn('Speech recognition not supported in this browser');
      setSupported(false);
    }
    
    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch (e) {
          // Ignore errors when stopping non-started recognition
        }
      }
    };
  }, [options]);

  // Setup recognition event handlers
  useEffect(() => {
    if (!recognition) return;
    
    const handleResult = (event: any) => {
      let currentTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setTranscript(currentTranscript);
    };

    const handleEnd = () => {
      if (isListening) {
        try {
          recognition.start();
        } catch (e) {
          console.error('Error restarting speech recognition:', e);
          setIsListening(false);
        }
      }
    };

    const handleError = (event: any) => {
      console.error('Speech recognition error:', event.error);
      
      if (event.error === 'not-allowed') {
        toast({
          title: "Microphone access denied",
          description: "Please allow microphone access to use voice recognition.",
          variant: "destructive",
        });
      }
      
      setIsListening(false);
    };

    recognition.onresult = handleResult;
    recognition.onend = handleEnd;
    recognition.onerror = handleError;

    return () => {
      recognition.onresult = null;
      recognition.onend = null;
      recognition.onerror = null;
    };
  }, [recognition, isListening, toast]);

  // Start listening
  const startListening = useCallback(() => {
    if (!recognition || !supported) {
      if (!supported) {
        toast({
          title: "Not supported",
          description: "Speech recognition is not supported in your browser.",
          variant: "destructive",
        });
      }
      return;
    }
    
    setTranscript('');
    setIsListening(true);
    
    try {
      recognition.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setIsListening(false);
    }
  }, [recognition, supported, toast]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (!recognition || !supported) return;
    
    setIsListening(false);
    
    try {
      recognition.stop();
    } catch (error) {
      console.error('Failed to stop speech recognition:', error);
    }
  }, [recognition, supported]);

  // Reset transcript
  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    supported
  };
};
