
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useVoiceSettings } from '@/store/voiceSettings';

interface VoiceInteractionOptions {
  onTranscriptComplete?: (transcript: string) => void;
  continuousListening?: boolean;
}

interface VoiceInteractionState {
  isLoading: boolean;
  error: Error | null;
  apiKeyStatus: 'unknown' | 'valid' | 'invalid' | 'checking';
  apiKeyErrorDetails: string | null;
  isListening: boolean;
  isProcessing: boolean;
  transcript: string;
  lastTranscript: string;
  supportsVoice: boolean;
}

export const useVoiceInteraction = (options: VoiceInteractionOptions = {}) => {
  const { onTranscriptComplete, continuousListening = false } = options;
  const { autoSilenceDetection } = useVoiceSettings();
  
  const [state, setState] = useState<VoiceInteractionState>({
    isLoading: false,
    error: null,
    apiKeyStatus: 'unknown',
    apiKeyErrorDetails: null,
    isListening: false,
    isProcessing: false,
    transcript: '',
    lastTranscript: '',
    supportsVoice: typeof navigator !== 'undefined' && 'mediaDevices' in navigator
  });
  
  useEffect(() => {
    checkApiKeyValidity();
  }, []);
  
  const checkApiKeyValidity = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, apiKeyStatus: 'checking' }));
      
      // Get API key from environment or settings
      // For testing, we'll use a dummy key or fetch from settings later
      const apiKey = process.env.OPENAI_API_KEY || 'dummy-key';
      
      const { data, error } = await supabase.functions.invoke('test-openai-connection', {
        body: { apiKey }
      });
      
      if (error) throw error;
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: null,
        apiKeyStatus: data.valid ? 'valid' : 'invalid',
        apiKeyErrorDetails: data.valid ? null : data.details || data.message
      }));
      
      return data.valid;
    } catch (error) {
      console.error('Error testing OpenAI API connection:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error,
        apiKeyStatus: 'invalid',
        apiKeyErrorDetails: error.message
      }));
      return false;
    }
  };
  
  const retryApiKeyValidation = async () => {
    return await checkApiKeyValidity();
  };

  const startListening = useCallback(() => {
    setState(prev => ({ ...prev, isListening: true, transcript: '' }));
    console.log('Voice listening started');
    // In a real implementation, this would connect to the OpenAI API
    // or browser's SpeechRecognition API
  }, []);

  const stopListening = useCallback(() => {
    setState(prev => ({ ...prev, isListening: false }));
    
    // If there's a transcript, send it to the callback
    if (onTranscriptComplete && state.transcript) {
      onTranscriptComplete(state.transcript);
    }
    
    // Store the last transcript
    setState(prev => ({ ...prev, lastTranscript: prev.transcript }));
    
    console.log('Voice listening stopped');
  }, [onTranscriptComplete, state.transcript]);
  
  return {
    ...state,
    retryApiKeyValidation,
    startListening,
    stopListening
  };
};
