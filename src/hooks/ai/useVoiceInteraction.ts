
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
  const { autoSilenceDetection, language } = useVoiceSettings();
  
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
      
      const { data, error } = await supabase.functions.invoke('test-openai-connection', {});
      
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
    
    // If we have a valid API key, use OpenAI's speech recognition
    if (state.apiKeyStatus === 'valid') {
      startOpenAIVoiceRecognition();
    } else {
      console.log('Using browser speech recognition as fallback');
      // Fallback to browser's speech recognition
      // This is a placeholder - in a real implementation, you would 
      // integrate with the browser's SpeechRecognition API
    }
  }, [state.apiKeyStatus]);
  
  const stopListening = useCallback(() => {
    setState(prev => ({ ...prev, isListening: false, isProcessing: true }));
    
    // If we were using OpenAI API, process the recorded audio
    if (state.apiKeyStatus === 'valid') {
      processRecordedAudio();
    } else {
      // Stop the browser's speech recognition
      setState(prev => ({ ...prev, isProcessing: false }));
    }
  }, [state.apiKeyStatus]);
  
  // Function to record audio and send to OpenAI
  const startOpenAIVoiceRecognition = async () => {
    // This would be the actual implementation to start recording
    // For now, this is just a placeholder
    console.log('Starting OpenAI voice recognition');
    
    // After a few seconds, simulate getting a transcript (for demo only)
    if (continuousListening) {
      setTimeout(() => {
        if (state.isListening) {
          setState(prev => ({ 
            ...prev, 
            transcript: 'This is a simulated transcript from OpenAI voice recognition.'
          }));
        }
      }, 3000);
    }
  };
  
  // Function to process recorded audio with OpenAI
  const processRecordedAudio = async () => {
    try {
      // In a real implementation, this would send the recorded audio to our Edge Function
      console.log('Processing audio with OpenAI API');
      
      setState(prev => ({ 
        ...prev, 
        isProcessing: false,
        lastTranscript: 'This is a simulated processed transcript from OpenAI.'
      }));
      
      // Call the onTranscriptComplete callback if provided
      if (onTranscriptComplete) {
        onTranscriptComplete('This is a simulated processed transcript from OpenAI.');
      }
    } catch (error) {
      console.error('Error processing audio:', error);
      setState(prev => ({ 
        ...prev, 
        isProcessing: false,
        error: error instanceof Error ? error : new Error('Unknown error processing audio')
      }));
    }
  };
  
  return {
    ...state,
    retryApiKeyValidation,
    startListening,
    stopListening
  };
};
