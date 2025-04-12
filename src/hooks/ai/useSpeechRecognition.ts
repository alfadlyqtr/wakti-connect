
import { useState, useEffect, useCallback } from 'react';
import { useVoiceSettings } from '@/store/voiceSettings';

interface SpeechRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
}

export const useSpeechRecognition = (options: SpeechRecognitionOptions = {}) => {
  const { continuous = false, interimResults = true } = options;
  const { language } = useVoiceSettings();
  
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Check browser support
  const supported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  
  // Get SpeechRecognition constructor
  const SpeechRecognition = typeof window !== 'undefined' 
    ? window.SpeechRecognition || (window as any).webkitSpeechRecognition 
    : null;
  
  // Reset transcript
  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);
  
  // Start listening
  const startListening = useCallback(() => {
    if (!supported) {
      setError('Your browser does not support speech recognition');
      return;
    }
    
    setError(null);
    setIsListening(true);
    
    try {
      const recognition = new SpeechRecognition();
      
      // Set options
      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      recognition.lang = options.lang || (language === 'en' ? 'en-US' : language === 'ar' ? 'ar-SA' : 'en-US');
      
      // Event handlers
      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };
      
      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          currentTranscript += result[0].transcript;
        }
        
        setTranscript(currentTranscript);
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event);
        setError(event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      // Start recognition
      recognition.start();
      
      // Store recognition instance for cleanup
      (window as any).__waktiSpeechRecognition = recognition;
      
    } catch (error) {
      console.error('Speech recognition error', error);
      setError('Failed to start speech recognition');
      setIsListening(false);
    }
  }, [continuous, interimResults, options.lang, supported, language]);
  
  // Stop listening
  const stopListening = useCallback(() => {
    if ((window as any).__waktiSpeechRecognition) {
      (window as any).__waktiSpeechRecognition.stop();
      delete (window as any).__waktiSpeechRecognition;
    }
    
    setIsListening(false);
  }, []);
  
  // Cleanup
  useEffect(() => {
    return () => {
      if ((window as any).__waktiSpeechRecognition) {
        (window as any).__waktiSpeechRecognition.stop();
        delete (window as any).__waktiSpeechRecognition;
      }
    };
  }, []);
  
  return {
    transcript,
    isListening,
    error,
    supported,
    startListening,
    stopListening,
    resetTranscript
  };
};
