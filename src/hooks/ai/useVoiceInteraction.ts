
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface VoiceInteractionState {
  isLoading: boolean;
  error: Error | null;
  apiKeyStatus: 'unknown' | 'valid' | 'invalid';
  apiKeyErrorDetails: string | null;
}

export const useVoiceInteraction = () => {
  const [state, setState] = useState<VoiceInteractionState>({
    isLoading: false,
    error: null,
    apiKeyStatus: 'unknown',
    apiKeyErrorDetails: null,
  });

  useEffect(() => {
    checkApiKeyValidity();
  }, []);
  
  const checkApiKeyValidity = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // Get API key from environment or settings
      // For testing, we'll use a dummy key or fetch from settings later
      const apiKey = process.env.OPENAI_API_KEY || 'dummy-key';
      
      const { data, error } = await supabase.functions.invoke('test-openai-connection', {
        body: { apiKey }
      });
      
      if (error) throw error;
      
      setState({
        isLoading: false,
        error: null,
        apiKeyStatus: data.valid ? 'valid' : 'invalid',
        apiKeyErrorDetails: data.valid ? null : data.details || data.message
      });
      
      return data.valid;
    } catch (error) {
      console.error('Error testing OpenAI API connection:', error);
      setState({
        isLoading: false,
        error,
        apiKeyStatus: 'invalid',
        apiKeyErrorDetails: error.message
      });
      return false;
    }
  };
  
  const retryApiKeyValidation = async () => {
    return await checkApiKeyValidity();
  };
  
  return {
    ...state,
    retryApiKeyValidation
  };
};
