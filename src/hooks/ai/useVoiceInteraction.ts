
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useVoiceSettings } from '@/store/voiceSettings';

interface UseVoiceInteractionOptions {
  onTranscriptComplete?: (text: string) => void;
}

export const useVoiceInteraction = (options?: UseVoiceInteractionOptions) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [apiKeyStatus, setApiKeyStatus] = useState<'valid' | 'invalid' | 'unknown' | 'checking'>('unknown');
  const [apiKeyErrorDetails, setApiKeyErrorDetails] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { autoSilenceDetection, language } = useVoiceSettings();
  
  // Flag to check if browser supports speech recognition
  const supportsVoice = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  
  const startListening = () => {
    setIsListening(true);
    setTranscript('');
    // In a real implementation, this would start the speech recognition
  };
  
  const stopListening = () => {
    setIsListening(false);
    
    // In a real implementation, this would stop the speech recognition
    // and process the final transcript
    
    if (options?.onTranscriptComplete && transcript) {
      options.onTranscriptComplete(transcript);
    }
  };
  
  const retryApiKeyValidation = async () => {
    setApiKeyStatus('checking');
    setApiKeyErrorDetails(null);
    
    try {
      // Simulate API check
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, just assume it's valid
      setApiKeyStatus('valid');
      return true;
    } catch (error) {
      setApiKeyStatus('invalid');
      setApiKeyErrorDetails(error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  };
  
  useEffect(() => {
    // Check API key status on mount
    retryApiKeyValidation();
    
    return () => {
      // Cleanup speech recognition if needed
      if (isListening) {
        stopListening();
      }
    };
  }, []);
  
  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    supportsVoice,
    apiKeyStatus,
    apiKeyErrorDetails,
    retryApiKeyValidation,
    isLoading,
    error
  };
};
