
import { useState, useEffect, useCallback, useRef } from 'react';
import { useSpeechRecognition } from './useSpeechRecognition';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useVoiceSettings } from '@/store/voiceSettings';

interface UseVoiceInteractionOptions {
  autoResumeListening?: boolean;
  continuousListening?: boolean;
  autoSilenceDetection?: boolean;
  silenceTime?: number;
  onTranscriptComplete?: (transcript: string) => void;
}

export const useVoiceInteraction = (options: UseVoiceInteractionOptions = {}) => {
  const { 
    autoResumeListening = true, 
    continuousListening = true,
    autoSilenceDetection: optionAutoSilenceDetection,
    silenceTime = 2000,
    onTranscriptComplete 
  } = options;
  
  const { autoSilenceDetection: storeAutoSilenceDetection } = useVoiceSettings();
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastTranscript, setLastTranscript] = useState('');
  const [temporaryTranscript, setTemporaryTranscript] = useState('');
  const [apiKeyStatus, setApiKeyStatus] = useState<'valid' | 'invalid' | 'unknown' | 'checking'>('unknown');
  const [apiKeyErrorDetails, setApiKeyErrorDetails] = useState<string | null>(null);
  const [isSilent, setIsSilent] = useState(false);
  const [averageVolume, setAverageVolume] = useState(0);
  const { toast } = useToast();
  
  // Use the passed autoSilenceDetection or fall back to the store value
  const effectiveAutoSilenceDetection = optionAutoSilenceDetection !== undefined 
    ? optionAutoSilenceDetection 
    : storeAutoSilenceDetection;
  
  // Speech recognition setup
  const {
    transcript,
    isListening,
    startListening: startSpeechRecognition,
    stopListening: stopSpeechRecognition,
    resetTranscript,
    supported: recognitionSupported
  } = useSpeechRecognition({
    continuous: continuousListening,
    interimResults: true,
  });

  // We'll expose these derived capabilities for components to check
  const supportsVoice = recognitionSupported;
  
  // Update temporary transcript when speech is being recognized
  useEffect(() => {
    if (isListening && transcript) {
      setTemporaryTranscript(transcript);
    }
  }, [isListening, transcript]);

  // Check if the OpenAI API key is valid for voice features
  const checkApiKeyValidity = useCallback(async () => {
    setApiKeyStatus('checking');
    try {
      const { data, error } = await supabase.functions.invoke('test-openai-connection', {
        body: { test: 'whisper' }
      });
      
      if (error) {
        console.error("Error checking OpenAI API key:", error);
        setApiKeyStatus('invalid');
        setApiKeyErrorDetails(error.message);
        return false;
      }
      
      if (data?.valid) {
        setApiKeyStatus('valid');
        setApiKeyErrorDetails(null);
        return true;
      } else {
        setApiKeyStatus('invalid');
        setApiKeyErrorDetails(data?.message || 'Unknown error validating API key');
        return false;
      }
    } catch (error) {
      console.error("Exception checking OpenAI API key:", error);
      setApiKeyStatus('invalid');
      setApiKeyErrorDetails(error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  }, []);

  // Initialize API key check
  useEffect(() => {
    checkApiKeyValidity();
  }, [checkApiKeyValidity]);
  
  // Handle transcript completion
  useEffect(() => {
    if (!isListening && transcript && onTranscriptComplete) {
      setLastTranscript(transcript);
      onTranscriptComplete(transcript);
      resetTranscript();
      setTemporaryTranscript('');
    }
  }, [isListening, transcript, onTranscriptComplete, resetTranscript]);
  
  // Start listening wrapper function
  const startListening = useCallback(() => {
    if (startSpeechRecognition) {
      startSpeechRecognition();
    }
  }, [startSpeechRecognition]);

  // Stop listening wrapper function
  const stopListening = useCallback(() => {
    if (stopSpeechRecognition) {
      stopSpeechRecognition();
    }
  }, [stopSpeechRecognition]);
  
  // Simulate silence detection (every 500ms check if there's been speech)
  useEffect(() => {
    if (isListening && effectiveAutoSilenceDetection) {
      const lastTranscriptRef = useRef(temporaryTranscript);
      const timer = setInterval(() => {
        if (temporaryTranscript === lastTranscriptRef.current) {
          // No change in transcript, might be silent
          setIsSilent(true);
        } else {
          // Transcript changed, not silent
          setIsSilent(false);
          lastTranscriptRef.current = temporaryTranscript;
        }
      }, silenceTime);
      
      return () => clearInterval(timer);
    }
    
    return () => {};
  }, [isListening, temporaryTranscript, effectiveAutoSilenceDetection, silenceTime]);
  
  // Reset silence state when not listening
  useEffect(() => {
    if (!isListening) {
      setIsSilent(false);
    }
  }, [isListening]);

  // For compatibility with components that expect these methods (even though they don't do anything now)
  const speakText = useCallback((text: string) => {
    toast({
      title: "Text-to-Speech Disabled",
      description: "This feature has been temporarily disabled.",
    });
    return Promise.resolve();
  }, [toast]);
  
  const stopSpeaking = useCallback(() => {
    // This is a no-op since we've removed TTS
    return Promise.resolve();
  }, []);
  
  return {
    isListening,
    transcript,
    temporaryTranscript,
    lastTranscript,
    startListening,
    stopListening,
    resetTranscript,
    isProcessing,
    supportsVoice,
    apiKeyStatus,
    apiKeyErrorDetails,
    retryApiKeyValidation: checkApiKeyValidity,
    isSilent,
    averageVolume,
    // Adding these for compatibility with existing components
    isSpeaking: false, 
    speakText,
    stopSpeaking
  };
};
