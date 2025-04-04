
import { useState, useEffect, useCallback, useRef } from 'react';
import { useSpeechRecognition } from './useSpeechRecognition';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useVoiceSettings } from '@/store/voiceSettings';

interface UseVoiceInteractionOptions {
  autoResumeListening?: boolean;
  continuousListening?: boolean;
  onTranscriptComplete?: (transcript: string) => void;
}

export const useVoiceInteraction = (options: UseVoiceInteractionOptions = {}) => {
  const { 
    autoResumeListening = true, 
    continuousListening = true,
    onTranscriptComplete 
  } = options;
  
  const { voice, autoSilenceDetection } = useVoiceSettings();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastTranscript, setLastTranscript] = useState('');
  const [apiKeyStatus, setApiKeyStatus] = useState<'valid' | 'invalid' | 'unknown'>('unknown');
  const [apiKeyErrorDetails, setApiKeyErrorDetails] = useState<string | null>(null);
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Speech recognition setup
  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    supported: recognitionSupported
  } = useSpeechRecognition({
    continuous: continuousListening,
    interimResults: true,
  });

  // Check if the OpenAI API key is valid for voice features
  const checkApiKeyValidity = useCallback(async () => {
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
  }, [voice, autoResumeListening, startListening, apiKeyStatus, toast]);
  
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
  
  return {
    isListening,
    transcript,
    lastTranscript,
    startListening: recognitionSupported ? startListening : undefined,
    stopListening: recognitionSupported ? stopListening : undefined,
    resetTranscript: recognitionSupported ? resetTranscript : undefined,
    speakText,
    stopSpeaking,
    isSpeaking,
    isProcessing,
    supportsVoice: recognitionSupported,
    apiKeyStatus,
    apiKeyErrorDetails,
    retryApiKeyValidation
  };
};
