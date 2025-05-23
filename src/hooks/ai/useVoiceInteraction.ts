import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useVoiceSettings } from '@/store/voiceSettings';

interface VoiceInteractionOptions {
  onTranscriptComplete?: (transcript: string) => void;
  continuousListening?: boolean;
}

interface VoiceInteractionState {
  isLoading: boolean;
  error: Error | null;
  apiKeyStatus: 'unchecked' | 'valid' | 'invalid' | 'checking';
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
    apiKeyStatus: 'unchecked',
    apiKeyErrorDetails: null,
    isListening: false,
    isProcessing: false,
    transcript: '',
    lastTranscript: '',
    supportsVoice: typeof navigator !== 'undefined' && 'mediaDevices' in navigator
  });
  
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingStartTimeRef = useRef<number>(0);
  const { maxRecordingDuration } = useVoiceSettings();
  
  // Validate API keys on mount
  useEffect(() => {
    validateApiKeys();
  }, []);

  const validateApiKeys = async () => {
    try {
      setState(prev => ({ ...prev, apiKeyStatus: 'checking' }));
      
      // Test ElevenLabs connection first
      const { data: elevenLabsData, error: elevenLabsError } = await supabase.functions.invoke('test-elevenlabs-connection');
      
      if (!elevenLabsError && elevenLabsData?.valid) {
        console.log("ElevenLabs validation successful");
        setState(prev => ({
          ...prev,
          apiKeyStatus: 'valid',
          apiKeyErrorDetails: null
        }));
        return;
      }

      // If ElevenLabs fails, test OpenAI connection
      const { data: openaiData, error: openaiError } = await supabase.functions.invoke('test-openai-connection');
      
      if (!openaiError && openaiData?.valid) {
        console.log("OpenAI validation successful");
        setState(prev => ({
          ...prev,
          apiKeyStatus: 'valid',
          apiKeyErrorDetails: null
        }));
        return;
      }

      console.log("API validation failed:", { elevenLabsError, openaiError });
      
      setState(prev => ({
        ...prev,
        apiKeyStatus: 'invalid',
        apiKeyErrorDetails: 'Speech services unavailable. Please check API keys.'
      }));
      
    } catch (error) {
      console.error('Error validating API keys:', error);
      setState(prev => ({
        ...prev,
        apiKeyStatus: 'invalid',
        apiKeyErrorDetails: error instanceof Error ? error.message : 'Failed to validate speech services'
      }));
    }
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm' // Using WebM format for best compatibility
      });
      
      // Reset audio chunks and start time
      audioChunksRef.current = [];
      recordingStartTimeRef.current = Date.now();
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          
          // Check recording duration
          const currentDuration = (Date.now() - recordingStartTimeRef.current) / 1000;
          if (currentDuration >= maxRecordingDuration) {
            console.log(`Recording reached maximum duration of ${maxRecordingDuration} seconds`);
            stopListening();
          }
        }
      };
      
      mediaRecorder.start(1000); // Collect data every second for better handling of long recordings
      
      // Save references
      mediaRecorderRef.current = mediaRecorder;
      
    } catch (error) {
      console.error('Error starting voice recording:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error : new Error('Error starting recording'),
        isListening: false
      }));
      
      toast({
        title: "Recording Error",
        description: "Could not start recording. Please check microphone permissions.",
        variant: "destructive"
      });
    }
  };

  const retryApiKeyValidation = useCallback(async () => {
    return await validateApiKeys();
  }, []);

  const startListening = useCallback(() => {
    setState(prev => ({ ...prev, isListening: true, transcript: '' }));
    
    if (state.apiKeyStatus === 'valid') {
      // If we have a valid API key for ElevenLabs or Whisper, start recording
      startVoiceRecording();
    } else {
      console.warn('Browser fallback activated: Using browser speech recognition');
      // Fallback to browser's speech recognition
      startBrowserSpeechRecognition();
    }
  }, [state.apiKeyStatus]);
  
  const stopListening = useCallback(() => {
    setState(prev => ({ ...prev, isListening: false, isProcessing: true }));
    
    if (state.apiKeyStatus === 'valid') {
      // If we were using external API, process the recorded audio
      processRecordedAudio();
    } else {
      // Stop the browser's speech recognition
      stopBrowserSpeechRecognition();
      setState(prev => ({ ...prev, isProcessing: false }));
    }
  }, [state.apiKeyStatus]);
  
  const processRecordedAudio = async () => {
    try {
      if (!mediaRecorderRef.current || audioChunksRef.current.length === 0) {
        throw new Error("No recording data available");
      }
      
      // Stop the recorder if it's still active
      if (mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      
      // Get the audio blob
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      // Try ElevenLabs first
      try {
        console.log("Attempting transcription with ElevenLabs");
        const elevenLabsTranscript = await transcribeWithElevenLabs(audioBlob);
        if (elevenLabsTranscript) {
          console.log("Successfully transcribed with ElevenLabs:", elevenLabsTranscript);
          handleTranscriptComplete(elevenLabsTranscript);
          return;
        } else {
          console.warn("ElevenLabs returned empty transcript, falling back to Whisper");
        }
      } catch (error) {
        console.error('ElevenLabs transcription failed, falling back to Whisper:', error);
      }
      
      // If ElevenLabs fails, try Whisper
      try {
        console.log("Attempting transcription with Whisper");
        const whisperTranscript = await transcribeWithWhisper(audioBlob);
        if (whisperTranscript) {
          console.log("Successfully transcribed with Whisper:", whisperTranscript);
          handleTranscriptComplete(whisperTranscript);
          return;
        } else {
          console.warn("Whisper returned empty transcript, falling back to browser");
        }
      } catch (error) {
        console.error('Whisper transcription failed, falling back to browser:', error);
      }
      
      // If both fail, notify the user
      console.warn("Browser fallback activated: All transcription services failed");
      setState(prev => ({ 
        ...prev, 
        isProcessing: false,
        error: new Error("Speech recognition failed. Please try again or type your message.")
      }));
      
    } catch (error) {
      console.error('Error processing recorded audio:', error);
      setState(prev => ({ 
        ...prev, 
        isProcessing: false,
        error: error instanceof Error ? error : new Error('Error processing recording')
      }));
    } finally {
      // Clean up
      if (mediaRecorderRef.current) {
        const tracks = mediaRecorderRef.current.stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    }
  };
  
  const transcribeWithElevenLabs = async (audioBlob: Blob): Promise<string | null> => {
    try {
      // Convert blob to base64
      const base64Audio = await blobToBase64(audioBlob);
      
      // Call the Edge Function for ElevenLabs
      const { data, error } = await supabase.functions.invoke('elevenlabs-speech-to-text', {
        body: { audio: base64Audio }
      });
      
      if (error) {
        console.error("ElevenLabs Edge Function error:", error);
        throw error;
      }
      return data?.text || null;
    } catch (error) {
      console.error('ElevenLabs transcription error:', error);
      return null;
    }
  };
  
  const transcribeWithWhisper = async (audioBlob: Blob): Promise<string | null> => {
    try {
      // Convert blob to base64
      const base64Audio = await blobToBase64(audioBlob);
      
      // Call our Edge Function with Whisper
      const { data, error } = await supabase.functions.invoke('voice-transcription', {
        body: { audio: base64Audio }
      });
      
      if (error) {
        console.error("Whisper Edge Function error:", error);
        throw error;
      }
      return data?.text || null;
    } catch (error) {
      console.error('Whisper transcription error:', error);
      return null;
    }
  };
  
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result?.toString().split(',')[1];
        if (base64data) {
          resolve(base64data);
        } else {
          reject(new Error("Failed to convert blob to base64"));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };
  
  const startBrowserSpeechRecognition = () => {
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      setState(prev => ({
        ...prev,
        error: new Error('Speech recognition is not supported in this browser'),
        isListening: false
      }));
      return;
    }
    
    // Use the Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = continuousListening;
    recognition.interimResults = true;
    recognition.lang = language || 'en-US';
    
    recognition.onstart = () => {
      setState(prev => ({ ...prev, isListening: true }));
    };
    
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(' ');
      
      setState(prev => ({ ...prev, transcript }));
    };
    
    recognition.onerror = (event) => {
      setState(prev => ({
        ...prev,
        error: new Error(`Speech recognition error: ${event.error}`),
        isListening: false
      }));
    };
    
    recognition.onend = () => {
      setState(prev => ({
        ...prev,
        isListening: false,
        lastTranscript: state.transcript
      }));
      
      if (state.transcript && onTranscriptComplete) {
        onTranscriptComplete(state.transcript);
      }
    };
    
    recognition.start();
    
    // Store for later cleanup
    (window as any).__speechRecognition = recognition;
  };
  
  const stopBrowserSpeechRecognition = () => {
    if ((window as any).__speechRecognition) {
      (window as any).__speechRecognition.stop();
      delete (window as any).__speechRecognition;
    }
  };
  
  const handleTranscriptComplete = (text: string) => {
    setState(prev => ({
      ...prev,
      isProcessing: false,
      lastTranscript: text
    }));
    
    if (onTranscriptComplete) {
      onTranscriptComplete(text);
    }
  };
  
  return {
    ...state,
    retryApiKeyValidation,
    startListening,
    stopListening
  };
};
