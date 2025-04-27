import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

interface VoiceInteractionOptions {
  onTranscriptComplete?: (transcript: string) => void;
  continuousListening?: boolean;
}

export const useVoiceInteraction = (options: VoiceInteractionOptions = {}) => {
  const { onTranscriptComplete, continuousListening = false } = options;
  
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastTranscript, setLastTranscript] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<'valid' | 'invalid' | 'unknown'>('unknown');
  const [apiKeyErrorDetails, setApiKeyErrorDetails] = useState<string | null>(null);
  
  const supportsVoice = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  
  const SpeechRecognition = typeof window !== 'undefined' 
    ? window.SpeechRecognition || (window as any).webkitSpeechRecognition 
    : null;
  
  let recognition: any = null;
  
  const processAudioWithElevenLabs = async (audioData: string): Promise<string> => {
    try {
      setIsProcessing(true);
      console.log("Processing audio with ElevenLabs...");
      
      const { data, error } = await supabase.functions.invoke('elevenlabs-speech-to-text', {
        body: { audio: audioData }
      });
      
      if (error) {
        console.error("Error from ElevenLabs edge function:", error);
        throw new Error(`ElevenLabs API error: ${error.message}`);
      }
      
      if (!data || !data.text) {
        throw new Error("No transcript received from ElevenLabs");
      }
      
      console.log("Received transcript from ElevenLabs:", data.text);
      return data.text;
    } catch (err) {
      console.error("Failed to process audio with ElevenLabs:", err);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };
  
  const processAudioWithOpenAI = async (audioData: string): Promise<string> => {
    try {
      setIsProcessing(true);
      console.log("Falling back to OpenAI for audio processing...");
      
      const { data, error } = await supabase.functions.invoke('ai-voice-to-text', {
        body: { audio: audioData }
      });
      
      if (error) {
        console.error("Error from OpenAI edge function:", error);
        throw new Error(`OpenAI API error: ${error.message}`);
      }
      
      if (!data || !data.text) {
        throw new Error("No transcript received from OpenAI");
      }
      
      console.log("Received transcript from OpenAI:", data.text);
      return data.text;
    } catch (err) {
      console.error("Failed to process audio with OpenAI:", err);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };
  
  const processAudioWithBrowser = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        if (!supportsVoice) {
          reject(new Error("Browser does not support speech recognition"));
          return;
        }
        
        console.log("Using browser's built-in speech recognition");
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          console.log("Browser recognized:", transcript);
          resolve(transcript);
        };
        
        recognition.onerror = (event: any) => {
          console.error("Browser recognition error:", event.error);
          reject(new Error(`Browser recognition error: ${event.error}`));
        };
        
        recognition.start();
      } catch (err) {
        console.error("Failed to initialize browser speech recognition:", err);
        reject(err);
      }
    });
  };
  
  const startListening = useCallback(() => {
    if (!supportsVoice) {
      setError(new Error('Speech recognition not supported'));
      return;
    }
    
    try {
      recognition = new SpeechRecognition();
      recognition.continuous = continuousListening;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };
      
      recognition.onresult = (event: any) => {
        const currentTranscript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        
        setTranscript(currentTranscript);
      };
      
      recognition.onerror = (event: any) => {
        setError(new Error(event.error));
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
        
        if (onTranscriptComplete && transcript) {
          onTranscriptComplete(transcript);
          setLastTranscript(transcript);
        }
      };
      
      recognition.start();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setIsListening(false);
    }
  }, [continuousListening, onTranscriptComplete, supportsVoice, transcript]);
  
  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
    }
    setIsListening(false);
  }, []);
  
  const retryApiKeyValidation = async (): Promise<boolean> => {
    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('test-elevenlabs-connection', {
        body: {}
      });
      
      if (error || !data || !data.success) {
        console.error('Error validating API key:', error || 'Unknown error');
        setApiKeyStatus('invalid');
        setApiKeyErrorDetails(error?.message || 'Failed to validate API key');
        setIsProcessing(false);
        return false;
      }
      
      setApiKeyStatus('valid');
      setApiKeyErrorDetails(null);
      setIsProcessing(false);
      return true;
    } catch (err) {
      console.error('Error validating API key:', err);
      setApiKeyStatus('invalid');
      setApiKeyErrorDetails(err instanceof Error ? err.message : 'Unknown error');
      setIsProcessing(false);
      return false;
    }
  };
  
  const processAudioWithFallbacks = async (audioData: string): Promise<string> => {
    try {
      return await processAudioWithElevenLabs(audioData);
    } catch (elevenLabsError) {
      console.warn("ElevenLabs failed, trying OpenAI fallback...");
      toast({
        title: "Speech recognition fallback",
        description: "Using alternative service for voice recognition...",
        duration: 3000,
      });
      
      try {
        return await processAudioWithOpenAI(audioData);
      } catch (openaiError) {
        console.warn("OpenAI fallback failed, trying browser recognition...");
        toast({
          title: "Using browser recognition",
          description: "External services unavailable, using browser capabilities...",
          duration: 3000,
        });
        
        return await processAudioWithBrowser();
      }
    }
  };
  
  useEffect(() => {
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);
  
  return {
    isListening,
    transcript,
    lastTranscript,
    supportsVoice,
    error,
    isProcessing,
    startListening,
    stopListening,
    apiKeyStatus,
    apiKeyErrorDetails,
    retryApiKeyValidation,
    processAudioWithFallbacks
  };
};
