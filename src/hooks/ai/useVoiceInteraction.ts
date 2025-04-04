
import { useState, useEffect, useCallback, useRef } from 'react';
import { useSpeechSynthesis } from './useSpeechSynthesis';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

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
        console.log("Checking OpenAI API key validation...");
        setApiKeyStatus('checking');
        const { data, error } = await supabase.functions.invoke('ai-voice-to-text', {
          body: { test: true }
        });
        
        console.log("API key check response:", { data, error });
        
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
      console.log("Retrying OpenAI API key validation...");
      setApiKeyStatus('checking');
      const { data, error } = await supabase.functions.invoke('ai-voice-to-text', {
        body: { test: true }
      });
      
      console.log("API key retry response:", { data, error });
      
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
        try {
          mediaRecorderRef.current.stop();
        } catch (e) {
          console.error("Error stopping media recorder:", e);
        }
      }
      if (silenceTimeoutRef.current) {
        window.clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, []);
  
  // Handle automatic resume after speaking completes
  useEffect(() => {
    if (autoResumeListening && !isSpeaking && shouldResumeRef.current) {
      console.log("Auto-resuming listening after speaking");
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
      console.log("Sending audio to voice-to-text function...");
      const { data, error } = await supabase.functions.invoke('ai-voice-to-text', {
        body: { audio: base64Data }
      });
      
      console.log("Voice-to-text response:", { data, error });
      
      if (error) {
        throw new Error(error.message || 'Failed to convert speech to text');
      }
      
      if (!data?.text) {
        // No text was returned, likely silence
        console.log("No text was returned from voice-to-text function");
        if (continuousListening) {
          startListening();
        }
        return;
      }
      
      console.log("Received transcript:", data.text);
      
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
      console.log("Already listening or processing, ignoring startListening call");
      return;
    }
    
    try {
      console.log("Starting voice recording...");
      setError(null);
      audioChunksRef.current = [];
      
      // Request microphone access
      console.log("Requesting microphone access...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone access granted");
      
      // Try with mp3 format first (which is better supported by OpenAI), then fall back to webm
      let options;
      try {
        options = { mimeType: 'audio/mp3' };
        // Test if this format is supported
        new MediaRecorder(stream, options);
        console.log("Using MP3 format for recording");
      } catch (e) {
        console.log("MP3 format not supported, trying webm");
        try {
          options = { mimeType: 'audio/webm' };
          // Test if this format is supported
          new MediaRecorder(stream, options);
          console.log("Using WebM format for recording");
        } catch (e2) {
          console.log("WebM format not supported, using default format");
          options = {};
        }
      }
      
      // Create media recorder with the determined options
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      
      console.log("Created MediaRecorder with MIME type:", mediaRecorder.mimeType);
      
      // Set up recorder event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.log(`Received audio chunk: ${event.data.size} bytes`);
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstart = () => {
        console.log("MediaRecorder started");
        setIsListening(true);
        setTemporaryTranscript('Listening...');
        
        // Set a maximum recording time (30 seconds to capture more content)
        if (silenceTimeoutRef.current) {
          window.clearTimeout(silenceTimeoutRef.current);
        }
        silenceTimeoutRef.current = window.setTimeout(() => {
          console.log("Maximum recording time reached (30s)");
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            stopListening();
          }
        }, 30000);
      };
      
      mediaRecorder.onerror = (event) => {
        console.error("MediaRecorder error:", event);
        setError("Media recorder error");
        stopListening();
      };
      
      mediaRecorder.onstop = async () => {
        console.log("MediaRecorder stopped");
        setIsListening(false);
        
        if (!audioChunksRef.current.length) {
          console.log("No audio chunks recorded");
          if (continuousListening) {
            startListening();
          }
          return;
        }
        
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType });
        console.log(`Audio blob created: ${audioBlob.size} bytes with type ${audioBlob.type}`);
        
        // Only process if we have a significant amount of audio data
        if (audioBlob.size > 1000) {
          await processSpeech(audioBlob);
        } else if (continuousListening) {
          console.log("Audio too short, restarting listening");
          startListening();
        }
        
        // Clean up
        if (mediaRecorderRef.current) {
          const tracks = mediaRecorderRef.current.stream.getTracks();
          tracks.forEach(track => track.stop());
        }
      };
      
      // Start recording
      console.log("Starting MediaRecorder...");
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
    console.log("Stopping voice recording...");
    if (silenceTimeoutRef.current) {
      window.clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
        setTemporaryTranscript('Processing...');
      } catch (e) {
        console.error("Error stopping MediaRecorder:", e);
        setIsListening(false);
        setTemporaryTranscript('');
      }
    } else {
      console.log("MediaRecorder not active, just updating state");
      setIsListening(false);
      setTemporaryTranscript('');
    }
  }, []);
  
  const speakText = useCallback((text: string) => {
    // If we're listening, stop and flag for resumption
    if (isListening && autoResumeListening) {
      console.log("Pausing listening to speak");
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
