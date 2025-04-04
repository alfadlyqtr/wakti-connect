
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
  
  const { voice, autoSilenceDetection: storeAutoSilenceDetection } = useVoiceSettings();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastTranscript, setLastTranscript] = useState('');
  const [temporaryTranscript, setTemporaryTranscript] = useState('');
  const [apiKeyStatus, setApiKeyStatus] = useState<'valid' | 'invalid' | 'unknown' | 'checking'>('unknown');
  const [apiKeyErrorDetails, setApiKeyErrorDetails] = useState<string | null>(null);
  const [isSilent, setIsSilent] = useState(false);
  const [averageVolume, setAverageVolume] = useState(0);
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
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
  const canUseSpeechSynthesis = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const openAIVoiceSupported = apiKeyStatus === 'valid';
  
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
        body: { test: 'tts' }
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
  
  // Stop speaking if component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Function to speak text
  const speakText = useCallback(async (text: string) => {
    if (!text || apiKeyStatus !== 'valid') {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Create audio element if it doesn't exist
      if (!audioRef.current) {
        audioRef.current = new Audio();
      } else {
        // Stop any current audio
        audioRef.current.pause();
      }
      
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text, voice }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!data || !data.audioUrl) {
        throw new Error('No audio URL returned');
      }
      
      // Set up audio event handlers
      audioRef.current.onplay = () => setIsSpeaking(true);
      audioRef.current.onended = () => {
        setIsSpeaking(false);
        if (autoResumeListening) {
          // Short delay before resuming listening
          setTimeout(() => {
            startListening();
          }, 500);
        }
      };
      audioRef.current.onerror = (e) => {
        console.error('Audio playback error:', e);
        setIsSpeaking(false);
      };
      
      // Play the audio
      audioRef.current.src = data.audioUrl;
      await audioRef.current.play();
      
    } catch (error) {
      console.error('Error in text-to-speech:', error);
      setIsSpeaking(false);
      toast({
        title: 'Speech Error',
        description: error instanceof Error ? error.message : 'Failed to speak text',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  }, [voice, autoResumeListening, apiKeyStatus, toast]);
  
  // Function to stop speaking
  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsSpeaking(false);
    }
  }, []);
  
  // Function to retry API key validation
  const retryApiKeyValidation = async () => {
    return await checkApiKeyValidity();
  };

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
  
  return {
    isListening,
    transcript,
    temporaryTranscript,
    lastTranscript,
    startListening,
    stopListening,
    resetTranscript,
    speakText,
    stopSpeaking,
    isSpeaking,
    isProcessing,
    supportsVoice,
    canUseSpeechSynthesis,
    openAIVoiceSupported,
    apiKeyStatus,
    apiKeyErrorDetails,
    retryApiKeyValidation,
    isSilent,
    averageVolume
  };
};
