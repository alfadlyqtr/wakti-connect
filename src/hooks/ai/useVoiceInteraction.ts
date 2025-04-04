
import { useState, useEffect, useCallback, useRef } from 'react';
import { useSpeechSynthesis } from './useSpeechSynthesis';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UseVoiceInteractionOptions {
  continuousListening?: boolean;
  autoResumeListening?: boolean;
  onTranscriptComplete?: (transcript: string) => void;
}

export const useVoiceInteraction = (options: UseVoiceInteractionOptions = {}) => {
  const { 
    continuousListening = false,
    autoResumeListening = false,
    onTranscriptComplete 
  } = options;
  
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastTranscript, setLastTranscript] = useState('');
  const [temporaryTranscript, setTemporaryTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [supportsVoice, setSupportsVoice] = useState(false);
  const [openAIVoiceSupported, setOpenAIVoiceSupported] = useState<boolean>(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'valid' | 'invalid' | 'unknown'>('checking');
  const [apiKeyErrorDetails, setApiKeyErrorDetails] = useState<string | null>(null);
  
  const { toast } = useToast();
  const { speak, cancel: stopSpeaking, speaking: isSpeaking, supported: synthesisSupported } = useSpeechSynthesis();
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const silenceTimeoutRef = useRef<number | null>(null);
  const processingTimeoutRef = useRef<number | null>(null);
  const shouldResumeRef = useRef(false);
  
  // Check if browser supports voice recognition
  useEffect(() => {
    const checkSupport = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          console.log('Media devices API not supported in this browser');
          return false;
        }
        
        // Just check if we can access the microphone
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setSupportsVoice(true);
        return true;
      } catch (err) {
        console.error('Error checking microphone access:', err);
        setSupportsVoice(false);
        return false;
      }
    };
    
    checkSupport();
  }, []);
  
  // Check if OpenAI voice-to-text is supported (API key is valid)
  useEffect(() => {
    const checkApiKey = async () => {
      try {
        setApiKeyStatus('checking');
        const { data, error } = await supabase.functions.invoke('ai-voice-to-text', {
          body: { test: true }
        });
        
        if (error || (data && data.error)) {
          console.warn('OpenAI API key validation failed:', error || data.error);
          setOpenAIVoiceSupported(false);
          setApiKeyStatus('invalid');
          setApiKeyErrorDetails(
            (error && error.message) || 
            (data && data.error) || 
            'API key validation failed'
          );
        } else {
          console.log('OpenAI API key is valid');
          setOpenAIVoiceSupported(true);
          setApiKeyStatus('valid');
          setApiKeyErrorDetails(null);
        }
      } catch (err) {
        console.error('Error checking OpenAI API key:', err);
        setOpenAIVoiceSupported(false);
        setApiKeyStatus('unknown');
        setApiKeyErrorDetails('Connection error');
      }
    };
    
    if (supportsVoice) {
      checkApiKey();
    }
  }, [supportsVoice]);
  
  // Retry API key validation
  const retryApiKeyValidation = useCallback(async () => {
    try {
      setApiKeyStatus('checking');
      const { data, error } = await supabase.functions.invoke('ai-voice-to-text', {
        body: { test: true }
      });
      
      if (error || (data && data.error)) {
        setOpenAIVoiceSupported(false);
        setApiKeyStatus('invalid');
        setApiKeyErrorDetails(
          (error && error.message) || 
          (data && data.error) || 
          'API key validation failed'
        );
        return false;
      } else {
        setOpenAIVoiceSupported(true);
        setApiKeyStatus('valid');
        setApiKeyErrorDetails(null);
        toast({
          title: 'API Key Valid',
          description: 'OpenAI API key is valid for voice recognition',
          variant: 'success'
        });
        return true;
      }
    } catch (err) {
      console.error('Error checking OpenAI API key:', err);
      setOpenAIVoiceSupported(false);
      setApiKeyStatus('unknown');
      setApiKeyErrorDetails('Connection error');
      return false;
    }
  }, [toast]);
  
  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      if (silenceTimeoutRef.current) {
        window.clearTimeout(silenceTimeoutRef.current);
      }
      if (processingTimeoutRef.current) {
        window.clearTimeout(processingTimeoutRef.current);
      }
    };
  }, []);
  
  // Handle automatic resume after speaking completes
  useEffect(() => {
    if (autoResumeListening && !isSpeaking && shouldResumeRef.current) {
      startListening();
      shouldResumeRef.current = false;
    }
  }, [isSpeaking, autoResumeListening]);
  
  const processSpeech = useCallback(async (audioBlob: Blob) => {
    try {
      setIsProcessing(true);
      
      // Convert blob to base64
      const reader = new FileReader();
      
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64 = reader.result as string;
          const base64Data = base64.split(',')[1]; // Remove the data URL prefix
          resolve(base64Data);
        };
      });
      
      reader.readAsDataURL(audioBlob);
      const base64Data = await base64Promise;
      
      // Send to our Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('ai-voice-to-text', {
        body: { audio: base64Data }
      });
      
      if (error) {
        throw new Error(error.message || 'Failed to convert speech to text');
      }
      
      if (!data?.text) {
        // No text was returned, likely silence
        if (continuousListening) {
          startListening();
        }
        return;
      }
      
      // Set the transcript
      setLastTranscript(data.text);
      setTemporaryTranscript('');
      
      // Call the callback if provided
      if (onTranscriptComplete) {
        onTranscriptComplete(data.text);
      }
      
    } catch (e) {
      console.error('Error processing speech:', e);
      setError(e instanceof Error ? e.message : 'An error occurred during speech processing');
      toast({
        title: 'Speech Processing Error',
        description: e instanceof Error ? e.message : 'Failed to process your speech',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
      // If continuous listening is enabled, restart listening
      if (continuousListening && !isListening) {
        setTimeout(startListening, 500);
      }
    }
  }, [onTranscriptComplete, continuousListening, toast, isListening]);
  
  const startListening = useCallback(async () => {
    if (isListening || isProcessing) {
      return;
    }
    
    try {
      setError(null);
      audioChunksRef.current = [];
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      // Set up recorder event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstart = () => {
        setIsListening(true);
        setTemporaryTranscript('Listening...');
        
        // Set a maximum recording time (30 seconds to capture more content)
        if (silenceTimeoutRef.current) {
          window.clearTimeout(silenceTimeoutRef.current);
        }
        silenceTimeoutRef.current = window.setTimeout(() => {
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            stopListening();
          }
        }, 30000);
      };
      
      mediaRecorder.onstop = async () => {
        setIsListening(false);
        
        if (!audioChunksRef.current.length) {
          if (continuousListening) {
            startListening();
          }
          return;
        }
        
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        // Only process if we have a significant amount of audio data
        if (audioBlob.size > 1000) {
          await processSpeech(audioBlob);
        } else if (continuousListening) {
          startListening();
        }
        
        // Clean up
        if (mediaRecorderRef.current) {
          const tracks = mediaRecorderRef.current.stream.getTracks();
          tracks.forEach(track => track.stop());
        }
      };
      
      // Start recording
      mediaRecorder.start(100); // Collect data in 100ms chunks for more responsive transcription
      
    } catch (e) {
      console.error('Error starting voice recognition:', e);
      setError(e instanceof Error ? e.message : 'Could not access microphone');
      setIsListening(false);
      setTemporaryTranscript('');
      
      toast({
        title: 'Microphone Access Error',
        description: e instanceof Error ? e.message : 'Could not access your microphone',
        variant: 'destructive'
      });
    }
  }, [isListening, isProcessing, processSpeech, continuousListening, toast]);
  
  const stopListening = useCallback(() => {
    if (silenceTimeoutRef.current) {
      window.clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setTemporaryTranscript('Processing...');
    } else {
      setIsListening(false);
      setTemporaryTranscript('');
    }
  }, []);
  
  const speakText = useCallback((text: string) => {
    // If we're listening, stop and flag for resumption
    if (isListening && autoResumeListening) {
      shouldResumeRef.current = true;
      stopListening();
    }
    
    speak(text);
  }, [speak, stopListening, isListening, autoResumeListening]);
  
  return {
    isListening,
    isProcessing,
    supportsVoice,
    lastTranscript,
    temporaryTranscript,
    error,
    startListening,
    stopListening,
    speakText,
    stopSpeaking,
    isSpeaking,
    resetTranscript: () => setLastTranscript(''),
    canUseSpeechSynthesis: synthesisSupported,
    openAIVoiceSupported,
    apiKeyStatus,
    apiKeyErrorDetails,
    retryApiKeyValidation
  };
};
