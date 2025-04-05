
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface UseVoiceInteractionOptions {
  continuousListening?: boolean;
  language?: string;
  autoStart?: boolean;
  autoSilenceDetection?: boolean;
  autoResumeListening?: boolean;
  onTranscriptComplete?: (transcript: string) => void;
}

export function useVoiceInteraction(options: UseVoiceInteractionOptions = {}) {
  const { 
    continuousListening = false,
    language = 'en',
    autoStart = false,
    autoSilenceDetection = false,
    autoResumeListening = false,
    onTranscriptComplete
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastTranscript, setLastTranscript] = useState('');
  const [temporaryTranscript, setTemporaryTranscript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [supportsVoice, setSupportsVoice] = useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'valid' | 'invalid' | 'unknown'>('checking');
  const [apiKeyErrorDetails, setApiKeyErrorDetails] = useState<string | null>(null);
  
  // Check browser support for voice recording
  useEffect(() => {
    const checkBrowserSupport = async () => {
      if (typeof navigator !== 'undefined' && 
          navigator.mediaDevices && 
          navigator.mediaDevices.getUserMedia) {
        setSupportsVoice(true);
      } else {
        setSupportsVoice(false);
        setError('Your browser does not support voice recording');
      }
    };
    
    checkBrowserSupport();
  }, []);
  
  // Check if OpenAI API key is valid
  useEffect(() => {
    const validateApiKey = async () => {
      if (!supportsVoice) return;
      
      try {
        setApiKeyStatus('checking');
        setApiKeyErrorDetails(null);
        
        const { data, error } = await supabase.functions.invoke('ai-voice-to-text', {
          body: { test: true }
        });
        
        if (error) {
          console.error("API key validation error:", error);
          setApiKeyStatus('invalid');
          setApiKeyErrorDetails(error.message || 'Unknown error validating API key');
          return;
        }
        
        if (data?.success) {
          setApiKeyStatus('valid');
        } else if (data?.error) {
          setApiKeyStatus('invalid');
          setApiKeyErrorDetails(data.error);
        } else {
          setApiKeyStatus('unknown');
        }
      } catch (err: any) {
        console.error("Error validating API key:", err);
        setApiKeyStatus('invalid');
        setApiKeyErrorDetails(err.message || 'Unknown error checking API connection');
      }
    };
    
    validateApiKey();
  }, [supportsVoice]);
  
  // Start listening automatically if autoStart is true
  useEffect(() => {
    if (autoStart && supportsVoice && apiKeyStatus === 'valid') {
      startListening();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart, supportsVoice, apiKeyStatus]);
  
  // Start voice recording
  const startListening = useCallback(async () => {
    if (!supportsVoice) {
      setError('Voice recording is not supported on this device');
      return;
    }
    
    if (apiKeyStatus === 'invalid') {
      setError(`OpenAI API key issue: ${apiKeyErrorDetails || 'API key is not properly configured'}`);
      return;
    }
    
    setError(null);
    setTranscript('');
    setTemporaryTranscript('');
    setAudioChunks([]);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      let recorder;
      try {
        recorder = new MediaRecorder(stream, { mimeType: 'audio/mp3' });
      } catch (e) {
        console.log("MP3 format not supported, using default format");
        recorder = new MediaRecorder(stream);
      }
      
      setMediaRecorder(recorder);
      
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          setAudioChunks((chunks) => [...chunks, event.data]);
        }
      };
      
      recorder.onstop = async () => {
        // Process the audio chunks
        if (audioChunks.length > 0) {
          await processAudioToText();
        }
      };
      
      recorder.start(1000);
      setIsListening(true);
      
    } catch (err: any) {
      console.error('Error starting voice recording:', err);
      setError(`Could not access microphone: ${err.message}`);
    }
  }, [supportsVoice, apiKeyStatus, apiKeyErrorDetails, audioChunks]);
  
  // Stop voice recording
  const stopListening = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      
      // Stop all audio tracks
      if (mediaRecorder.stream) {
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
    }
    
    setIsListening(false);
  }, [mediaRecorder]);
  
  // Process audio data to text
  const processAudioToText = useCallback(async () => {
    if (audioChunks.length === 0) return;
    
    setIsLoading(true);
    setIsProcessing(true);
    setError(null);
    
    try {
      const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
      
      if (audioBlob.size < 100) {
        setError('Audio recording too short');
        setIsLoading(false);
        setIsProcessing(false);
        return;
      }
      
      // Convert blob to base64
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        try {
          const base64data = (reader.result as string).split(',')[1];
          
          // Call the Supabase Edge Function
          const { data, error } = await supabase.functions.invoke('ai-voice-to-text', {
            body: { 
              audio: base64data,
              language: language
            }
          });
          
          if (error) {
            throw new Error(error.message);
          }
          
          if (data?.text) {
            setTranscript(data.text);
            setLastTranscript(data.text);
            if (onTranscriptComplete) {
              onTranscriptComplete(data.text);
            }
          } else if (data?.warning) {
            setError(data.warning);
          } else {
            setError('No transcription returned');
          }
          
        } catch (err: any) {
          console.error('Error processing audio:', err);
          setError(err.message || 'Error processing audio');
        } finally {
          setIsLoading(false);
          setIsProcessing(false);
        }
      };
      
      reader.onerror = () => {
        setError('Error reading audio data');
        setIsLoading(false);
        setIsProcessing(false);
      };
      
      reader.readAsDataURL(audioBlob);
      
    } catch (err: any) {
      console.error('Error processing audio to text:', err);
      setError(err.message || 'Error processing audio');
      setIsLoading(false);
      setIsProcessing(false);
    }
  }, [audioChunks, language, onTranscriptComplete]);
  
  // Retry API key validation
  const retryApiKeyValidation = useCallback(async () => {
    setApiKeyStatus('checking');
    setApiKeyErrorDetails(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-voice-to-text', {
        body: { test: true }
      });
      
      if (error) {
        setApiKeyStatus('invalid');
        setApiKeyErrorDetails(error.message);
        return false;
      }
      
      if (data?.success) {
        setApiKeyStatus('valid');
        return true;
      } else {
        setApiKeyStatus('invalid');
        setApiKeyErrorDetails(data?.error || 'Unknown error');
        return false;
      }
    } catch (err: any) {
      setApiKeyStatus('invalid');
      setApiKeyErrorDetails(err.message || 'Connection error');
      return false;
    }
  }, []);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        
        if (mediaRecorder.stream) {
          mediaRecorder.stream.getTracks().forEach(track => track.stop());
        }
      }
    };
  }, [mediaRecorder]);
  
  return {
    isListening,
    transcript,
    temporaryTranscript,
    lastTranscript,
    isLoading,
    isProcessing,
    error,
    startListening,
    stopListening,
    supportsVoice,
    apiKeyStatus,
    apiKeyErrorDetails,
    retryApiKeyValidation
  };
}
