
import { useState, useEffect, useCallback, useRef } from 'react';
import { useSpeechSynthesis } from './useSpeechSynthesis';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useVoiceSettings } from '@/store/voiceSettings';

interface UseVoiceInteractionOptions {
  continuousListening?: boolean;
  autoResumeListening?: boolean;
  autoSilenceDetection?: boolean;
  silenceThreshold?: number; // in decibels
  silenceTime?: number; // in milliseconds
  onTranscriptComplete?: (transcript: string) => void;
}

export const useVoiceInteraction = (options: UseVoiceInteractionOptions = {}) => {
  const { 
    continuousListening = false,
    autoResumeListening = false,
    autoSilenceDetection: optionAutoSilenceDetection,
    silenceThreshold = -45, // default silence threshold in dB
    silenceTime = 1500, // default silence time in ms
    onTranscriptComplete 
  } = options;
  
  // Get voice settings from the store
  const voiceSettings = useVoiceSettings();
  const autoSilenceDetection = optionAutoSilenceDetection !== undefined 
    ? optionAutoSilenceDetection 
    : voiceSettings.autoSilenceDetection;
  
  // State management
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastTranscript, setLastTranscript] = useState('');
  const [temporaryTranscript, setTemporaryTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [supportsVoice, setSupportsVoice] = useState(false);
  const [openAIVoiceSupported, setOpenAIVoiceSupported] = useState<boolean>(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'valid' | 'invalid' | 'unknown'>('checking');
  const [apiKeyErrorDetails, setApiKeyErrorDetails] = useState<string | null>(null);
  const [isSilent, setIsSilent] = useState(true);
  const [averageVolume, setAverageVolume] = useState<number>(0);
  const [consecutiveErrors, setConsecutiveErrors] = useState(0);
  
  // Hooks
  const { toast } = useToast();
  const { speak, cancel: stopSpeaking, speaking: isSpeaking, supported: synthesisSupported } = useSpeechSynthesis({
    voice: voiceSettings.voice
  });
  
  // Refs for stateful values that don't trigger re-renders
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const silenceTimeoutRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const silenceStartTimeRef = useRef<number | null>(null);
  const shouldResumeRef = useRef(false);
  const volumeCheckIntervalRef = useRef<number | null>(null);
  const apiTestInProgressRef = useRef(false);
  const lastErrorTimeRef = useRef<number | null>(null);
  
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
  const checkApiKey = useCallback(async () => {
    if (apiTestInProgressRef.current) return null;
    
    try {
      apiTestInProgressRef.current = true;
      console.log("Checking OpenAI API key validation...");
      setApiKeyStatus('checking');
      
      // First check text-to-voice
      const { data: textToVoiceData, error: textToVoiceError } = await supabase.functions.invoke('ai-text-to-voice', {
        body: { test: true }
      });
      
      console.log("Text-to-voice API key check response:", { data: textToVoiceData, error: textToVoiceError });
      
      // Then check voice-to-text
      const { data: voiceToTextData, error: voiceToTextError } = await supabase.functions.invoke('ai-voice-to-text', {
        body: { test: true }
      });
      
      console.log("Voice-to-text API key check response:", { data: voiceToTextData, error: voiceToTextError });
      
      // If either fails, mark as invalid
      if ((textToVoiceError || (textToVoiceData && textToVoiceData.error)) || 
          (voiceToTextError || (voiceToTextData && voiceToTextData.error))) {
        console.warn('OpenAI API key validation failed:', 
          textToVoiceError || (textToVoiceData && textToVoiceData.error) || 
          voiceToTextError || (voiceToTextData && voiceToTextData.error));
        
        setOpenAIVoiceSupported(false);
        setApiKeyStatus('invalid');
        setApiKeyErrorDetails(
          (textToVoiceError && textToVoiceError.message) || 
          (textToVoiceData && textToVoiceData.error) || 
          (voiceToTextError && voiceToTextError.message) || 
          (voiceToTextData && voiceToTextData.error) || 
          'API key validation failed'
        );
        return false;
      } else {
        console.log('OpenAI API key is valid for voice features');
        setOpenAIVoiceSupported(true);
        setApiKeyStatus('valid');
        setApiKeyErrorDetails(null);
        return true;
      }
    } catch (err) {
      console.error('Error checking OpenAI API key:', err);
      setOpenAIVoiceSupported(false);
      setApiKeyStatus('unknown');
      setApiKeyErrorDetails('Connection error');
      return false;
    } finally {
      apiTestInProgressRef.current = false;
    }
  }, []);
  
  useEffect(() => {
    if (supportsVoice) {
      checkApiKey();
    }
  }, [supportsVoice, checkApiKey]);
  
  // Retry API key validation
  const retryApiKeyValidation = useCallback(async () => {
    const result = await checkApiKey();
    return result === true;
  }, [checkApiKey]);
  
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
      if (volumeCheckIntervalRef.current) {
        window.clearInterval(volumeCheckIntervalRef.current);
      }
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch (e) {
          console.error("Error closing audio context:", e);
        }
      }
    };
  }, []);
  
  // Handle automatic resume after speaking completes
  useEffect(() => {
    if (autoResumeListening && !isSpeaking && shouldResumeRef.current) {
      console.log("Auto-resuming listening after speaking");
      setTimeout(() => {
        startListening();
        shouldResumeRef.current = false;
      }, 500); // Add a small delay to ensure everything is ready
    }
  }, [isSpeaking, autoResumeListening]);
  
  // Calculate volume level from audio data
  const calculateVolumeLevel = useCallback((audioData: Float32Array): number => {
    // Calculate RMS volume
    let sum = 0;
    for (let i = 0; i < audioData.length; i++) {
      sum += audioData[i] * audioData[i];
    }
    const rms = Math.sqrt(sum / audioData.length);
    
    // Convert to dB
    const db = 20 * Math.log10(Math.max(rms, 0.0000001)); // Avoid log(0)
    return db;
  }, []);
  
  // Set up volume monitoring
  const setupVolumeMonitoring = useCallback((stream: MediaStream) => {
    if (!autoSilenceDetection) return null;
    
    try {
      // Create audio context and analyser
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      const analyser = audioContext.createAnalyser();
      analyserRef.current = analyser;
      analyser.fftSize = 1024;
      
      // Connect mic to analyser
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      
      // Create processor to get audio data
      const processor = audioContext.createScriptProcessor(2048, 1, 1);
      processor.connect(audioContext.destination);
      analyser.connect(processor);
      
      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const volume = calculateVolumeLevel(inputData);
        
        // Calculate moving average
        setAverageVolume(prev => prev * 0.8 + volume * 0.2);
        
        // Check for silence
        if (volume < silenceThreshold) {
          if (silenceStartTimeRef.current === null) {
            silenceStartTimeRef.current = Date.now();
          } else if (Date.now() - silenceStartTimeRef.current > silenceTime && !isSilent) {
            console.log("Silence detected for threshold period", {
              volume, 
              threshold: silenceThreshold,
              silenceTime
            });
            setIsSilent(true);
            
            // If automatic silence detection is enabled, stop listening and process audio
            if (autoSilenceDetection && isListening && !isProcessing) {
              console.log("Auto-stopping listening due to silence");
              stopListening();
            }
          }
        } else {
          // Reset silence timer if sound is detected
          silenceStartTimeRef.current = null;
          setIsSilent(false);
        }
      };
      
      return () => {
        try {
          processor.disconnect();
          source.disconnect();
          analyser.disconnect();
        } catch (e) {
          console.error("Error disconnecting audio processing:", e);
        }
      };
    } catch (error) {
      console.error("Error setting up volume monitoring:", error);
      return null;
    }
  }, [autoSilenceDetection, silenceThreshold, silenceTime, isListening, isProcessing, calculateVolumeLevel]);
  
  // Function to process speech using OpenAI
  const processSpeech = useCallback(async (audioBlob: Blob) => {
    try {
      setIsProcessing(true);
      
      // Guard against empty blobs
      if (audioBlob.size <= 0) {
        console.warn("Empty audio blob received - ignoring");
        setIsProcessing(false);
        if (continuousListening && !isListening) {
          startListening();
        }
        return;
      }
      
      // Convert blob to base64
      const reader = new FileReader();
      
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const base64 = reader.result as string;
          const base64Data = base64.split(',')[1]; // Remove the data URL prefix
          resolve(base64Data);
        };
        reader.onerror = () => {
          reject(new Error("Failed to read audio file"));
        };
      });
      
      reader.readAsDataURL(audioBlob);
      const base64Data = await base64Promise;
      
      // Simple validation to ensure we have valid audio data
      if (!base64Data || base64Data.length < 100) {
        console.warn("Audio data is too small:", base64Data?.length);
        setIsProcessing(false);
        if (continuousListening && !isListening) {
          startListening();
        }
        return;
      }
      
      // Send to our Supabase Edge Function
      console.log("Sending audio to voice-to-text function...");
      const { data, error } = await supabase.functions.invoke('ai-voice-to-text', {
        body: { audio: base64Data }
      });
      
      console.log("Voice-to-text response:", { data, error });
      
      if (error) {
        throw new Error(error.message || 'Failed to convert speech to text');
      }
      
      // Check for empty text in response (usually means silence or very short audio)
      if (!data?.text || data.text.trim() === "") {
        console.log("No text was returned from voice-to-text function");
        
        // Check if we got a warning about audio being too short
        if (data?.warning === "Audio is too short to transcribe") {
          console.log("Audio was too short to transcribe");
        }
        
        if (continuousListening) {
          startListening();
        }
        return;
      }
      
      console.log("Received transcript:", data.text);
      
      // Reset consecutive errors since we got a successful response
      setConsecutiveErrors(0);
      
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
      
      // Track consecutive errors
      const newErrorCount = consecutiveErrors + 1;
      setConsecutiveErrors(newErrorCount);
      
      // Only show toast for first few errors to avoid overwhelming user
      if (newErrorCount <= 2) {
        toast({
          title: 'Speech Processing Error',
          description: e instanceof Error ? e.message : 'Failed to process your speech',
          variant: 'destructive'
        });
      }
      
      // If we've had multiple errors, try to re-test the API key
      if (newErrorCount >= 3 && (lastErrorTimeRef.current === null || Date.now() - lastErrorTimeRef.current > 60000)) {
        console.log("Multiple errors detected, retrying API key validation");
        lastErrorTimeRef.current = Date.now();
        retryApiKeyValidation();
      }
      
    } finally {
      setIsProcessing(false);
      // If continuous listening is enabled, restart listening
      if (continuousListening && !isListening) {
        setTimeout(startListening, 500);
      }
    }
  }, [onTranscriptComplete, continuousListening, toast, isListening, consecutiveErrors, retryApiKeyValidation]);
  
  const startListening = useCallback(async () => {
    if (isListening || isProcessing) {
      console.log("Already listening or processing, ignoring startListening call");
      return;
    }
    
    try {
      console.log("Starting voice recording...");
      setError(null);
      audioChunksRef.current = [];
      silenceStartTimeRef.current = null;
      setIsSilent(false);
      setTemporaryTranscript('Listening...');
      
      // Request microphone access
      console.log("Requesting microphone access...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone access granted");
      
      // Setup volume monitoring if enabled
      const cleanupVolumeMonitoring = setupVolumeMonitoring(stream);
      
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
        } else {
          console.warn("Received empty audio chunk");
        }
      };
      
      mediaRecorder.onstart = () => {
        console.log("MediaRecorder started");
        setIsListening(true);
        
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
        
        // Show toast for media recorder errors
        toast({
          title: 'Recording Error',
          description: 'There was a problem with the microphone recording',
          variant: 'destructive'
        });
      };
      
      mediaRecorder.onstop = async () => {
        console.log("MediaRecorder stopped");
        setIsListening(false);
        
        // Clean up volume monitoring
        if (cleanupVolumeMonitoring) cleanupVolumeMonitoring();
        
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
        if (audioBlob.size > 100) {
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
      
      // Start recording with smaller chunks for more responsive transcription
      console.log("Starting MediaRecorder...");
      mediaRecorder.start(100);
      
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
      
      // Try testing the API key anyway in case that's the issue
      retryApiKeyValidation();
    }
  }, [isListening, isProcessing, processSpeech, continuousListening, toast, setupVolumeMonitoring, retryApiKeyValidation]);
  
  const stopListening = useCallback(() => {
    console.log("Stopping voice recording...");
    if (silenceTimeoutRef.current) {
      window.clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    
    if (volumeCheckIntervalRef.current) {
      window.clearInterval(volumeCheckIntervalRef.current);
      volumeCheckIntervalRef.current = null;
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
  
  const speakText = useCallback((text: string, voice?: string) => {
    if (!text) {
      console.warn("Empty text passed to speakText, ignoring");
      return;
    }
    
    // If we're listening, stop and flag for resumption
    if (isListening && autoResumeListening) {
      console.log("Pausing listening to speak");
      shouldResumeRef.current = true;
      stopListening();
    }
    
    // If voice is provided, use it, otherwise use the default from settings
    const voiceToUse = voice || voiceSettings.voice;
    
    // First, try to use the Edge Function for text-to-speech if OpenAI is available
    if (openAIVoiceSupported && apiKeyStatus === 'valid') {
      console.log(`Using OpenAI for speech with voice ${voiceToUse}`);
      
      // Add safe limit to prevent edge function timeout
      const maxTextLength = 4000;
      const truncatedText = text.length > maxTextLength ? text.substring(0, maxTextLength) : text;
      
      supabase.functions.invoke('ai-text-to-voice', {
        body: { text: truncatedText, voice: voiceToUse }
      }).then(({ data, error }) => {
        if (error || (data && data.error)) {
          console.error("Error using OpenAI for speech:", error || data.error);
          // Fall back to browser speech synthesis
          speak(text);
        } else if (data && data.audioContent) {
          // Play audio from base64
          const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
          audio.onplay = () => {
            console.log("AI speech started");
          };
          audio.onended = () => {
            console.log("AI speech ended");
            if (autoResumeListening && shouldResumeRef.current) {
              console.log("Auto-resuming listening after AI speech");
              setTimeout(() => {
                startListening();
                shouldResumeRef.current = false;
              }, 500);
            }
          };
          audio.onerror = (err) => {
            console.error("Error playing audio:", err);
            // Fall back to browser speech synthesis
            speak(text);
          };
          audio.play().catch(err => {
            console.error("Error playing audio:", err);
            // Fall back to browser speech synthesis
            speak(text);
          });
        }
      }).catch(err => {
        console.error("Error calling text-to-voice function:", err);
        // Fall back to browser speech synthesis
        speak(text);
      });
    } else {
      // Use browser's speech synthesis as fallback
      console.log("Using browser speech synthesis as fallback");
      speak(text);
    }
  }, [speak, stopListening, isListening, autoResumeListening, startListening, openAIVoiceSupported, apiKeyStatus, voiceSettings.voice]);
  
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
    retryApiKeyValidation,
    isSilent,
    averageVolume,
    consecutiveErrors
  };
};
