
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

interface VoiceInteractionOptions {
  onTranscriptComplete?: (transcript: string) => void;
  continuousListening?: boolean;
}

export const useVoiceInteraction = (options: VoiceInteractionOptions = {}) => {
  const { onTranscriptComplete, continuousListening = false } = options;
  const { toast } = useToast();
  
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastTranscript, setLastTranscript] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<'valid' | 'invalid' | 'unknown'>('unknown');
  const [apiKeyErrorDetails, setApiKeyErrorDetails] = useState<string | null>(null);
  
  // For audio recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Check if browser supports speech recognition
  const supportsVoice = typeof window !== 'undefined' && 
    'mediaDevices' in navigator && 
    typeof navigator.mediaDevices.getUserMedia === 'function';
  
  const startListening = useCallback(async () => {
    if (!supportsVoice) {
      setError(new Error('Speech recognition not supported'));
      toast({
        title: "Feature not supported",
        description: "Your browser doesn't support voice recording.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Reset state
      setIsListening(true);
      setTranscript('');
      setError(null);
      audioChunksRef.current = [];
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      streamRef.current = stream;
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm' // Specify WebM format explicitly
      });
      mediaRecorderRef.current = mediaRecorder;
      
      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.start(100); // Collect data every 100ms
      
    } catch (err) {
      console.error('Error starting recording:', err);
      setError(err instanceof Error ? err : new Error('Unknown error starting recording'));
      setIsListening(false);
      toast({
        title: "Microphone Error",
        description: "Please check your microphone permissions and try again.",
        variant: "destructive"
      });
    }
  }, [supportsVoice, toast]);
  
  const stopListening = useCallback(async () => {
    if (!mediaRecorderRef.current || !streamRef.current) {
      setIsListening(false);
      return;
    }
    
    try {
      // Stop recording
      if (mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      
      // Stop all audio tracks
      streamRef.current.getTracks().forEach(track => track.stop());
      
      setIsListening(false);
      setIsProcessing(true);
      
      // Wait for the last ondataavailable event
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Process the audio data
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      await processAudioWithWhisper(audioBlob);
      
    } catch (err) {
      console.error('Error stopping recording:', err);
      setError(err instanceof Error ? err : new Error('Unknown error stopping recording'));
      setIsProcessing(false);
      toast({
        title: "Processing Error",
        description: "Failed to process the recording.",
        variant: "destructive"
      });
    } finally {
      // Reset state
      mediaRecorderRef.current = null;
      streamRef.current = null;
    }
  }, [toast]);
  
  const processAudioWithWhisper = async (audioBlob: Blob) => {
    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      const base64Audio = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          if (reader.result && typeof reader.result === 'string') {
            // Extract the base64 data part (remove the "data:audio/webm;base64," prefix)
            const base64String = reader.result.split(',')[1];
            resolve(base64String);
          } else {
            reject(new Error('Failed to convert audio to base64'));
          }
        };
        reader.onerror = reject;
      });
      
      // Send to Supabase Edge Function
      console.log('Sending audio to Supabase Edge Function...');
      const { data, error } = await supabase.functions.invoke('ai-voice-to-text', {
        body: { audio: base64Audio }
      });
      
      if (error) {
        throw new Error(`Edge function error: ${error.message}`);
      }
      
      if (!data || !data.text) {
        throw new Error('No transcription returned');
      }
      
      console.log('Transcription received:', data.text);
      
      // Set transcript and callback
      setTranscript(data.text);
      setLastTranscript(data.text);
      
      if (onTranscriptComplete) {
        onTranscriptComplete(data.text);
      }
      
    } catch (err) {
      console.error('Whisper API error:', err);
      setError(err instanceof Error ? err : new Error('Transcription failed'));
      setApiKeyErrorDetails(err instanceof Error ? err.message : 'Transcription failed');
      toast({
        title: "Transcription Error",
        description: err instanceof Error ? err.message : "Failed to transcribe audio",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Check API key validity on mount
  useEffect(() => {
    const checkApiKey = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('test-openai-connection', {});
        
        if (error) {
          throw error;
        }
        
        setApiKeyStatus(data?.valid ? 'valid' : 'invalid');
        if (!data?.valid && data?.details) {
          setApiKeyErrorDetails(data.details);
        } else {
          setApiKeyErrorDetails(null);
        }
      } catch (err) {
        console.error('Error checking OpenAI API key:', err);
        setApiKeyStatus('invalid');
        setApiKeyErrorDetails(err instanceof Error ? err.message : 'Connection error');
      }
    };
    
    checkApiKey();
  }, []);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  const retryApiKeyValidation = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('test-openai-connection', {});
      
      if (error) throw error;
      
      setApiKeyStatus(data?.valid ? 'valid' : 'invalid');
      if (!data?.valid && data?.details) {
        setApiKeyErrorDetails(data.details);
      } else {
        setApiKeyErrorDetails(null);
      }
      
      return data?.valid || false;
    } catch (err) {
      console.error('Error validating API key:', err);
      setApiKeyStatus('invalid');
      setApiKeyErrorDetails(err instanceof Error ? err.message : 'Connection error');
      return false;
    }
  };
  
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
    retryApiKeyValidation
  };
};
