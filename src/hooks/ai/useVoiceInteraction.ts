
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'valid' | 'invalid' | 'unknown'>('checking');
  const [apiKeyErrorDetails, setApiKeyErrorDetails] = useState<string | null>(null);
  const [isSilent, setIsSilent] = useState(true);
  const [averageVolume, setAverageVolume] = useState<number>(0);
  
  // Hooks
  const { toast } = useToast();
  
  // Refs for stateful values
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const silenceTimeoutRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const silenceStartTimeRef = useRef<number | null>(null);
  const shouldResumeRef = useRef(false);
  const apiTestInProgressRef = useRef(false);
  
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
        console.warn('OpenAI API key validation failed');
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
        setApiKeyStatus('valid');
        setApiKeyErrorDetails(null);
        return true;
      }
    } catch (err) {
      console.error('Error checking OpenAI API key:', err);
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
            console.log("Silence detected for threshold period");
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
  
  // Start listening for speech
  const startListening = useCallback(async () => {
    if (!supportsVoice) {
      setError('Voice recognition not supported in this browser');
      return;
    }
    
    if (isListening) {
      console.log("Already listening, ignoring start request");
      return;
    }
    
    try {
      console.log("Starting listening...");
      
      // Clear any previous audio data
      audioChunksRef.current = [];
      setTemporaryTranscript('');
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Set up volume monitoring if auto silence detection is enabled
      const cleanupVolumeMonitoring = setupVolumeMonitoring(stream);
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        try {
          console.log("Media recorder stopped, processing audio...");
          
          // Create a single blob from all audio chunks
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          
          // Only process if we have actual audio data
          if (audioBlob.size > 0) {
            processSpeech(audioBlob);
          } else {
            console.log("No audio data collected");
            if (continuousListening) {
              startListening();
            }
          }
        } catch (error) {
          console.error("Error processing audio on stop:", error);
        }
      };
      
      // Start recording
      mediaRecorder.start();
      setIsListening(true);
      setIsSilent(false);
      
      // Clean up on unmount
      return () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          try {
            mediaRecorderRef.current.stop();
          } catch (e) {
            console.error("Error stopping media recorder during cleanup:", e);
          }
        }
        
        // Clean up volume monitoring
        if (cleanupVolumeMonitoring) {
          cleanupVolumeMonitoring();
        }
        
        // Stop all tracks in the stream
        stream.getTracks().forEach(track => track.stop());
      };
      
    } catch (error) {
      console.error("Error starting voice recognition:", error);
      setError(error instanceof Error ? error.message : 'Failed to start voice recognition');
      toast({
        title: "Voice Recognition Error",
        description: error instanceof Error ? error.message : 'Failed to start voice recognition',
        variant: "destructive"
      });
    }
  }, [supportsVoice, isListening, setupVolumeMonitoring, continuousListening, toast]);
  
  // Stop listening
  const stopListening = useCallback(() => {
    if (!isListening || !mediaRecorderRef.current) {
      console.log("Not listening or no media recorder, ignoring stop request");
      return;
    }
    
    try {
      console.log("Stopping listening...");
      // Only stop if currently recording
      if (mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      
      // Stop all microphone tracks
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      
      // Clean up audio context if it exists
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
          audioContextRef.current = null;
        } catch (e) {
          console.error("Error closing audio context:", e);
        }
      }
      
      setIsListening(false);
    } catch (error) {
      console.error("Error stopping voice recognition:", error);
    }
  }, [isListening]);
  
  // Process speech using OpenAI
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
      
      // Send to our Supabase Edge Function
      console.log("Sending audio to voice-to-text function...");
      const { data, error } = await supabase.functions.invoke('ai-voice-to-text', {
        body: { audio: base64Data }
      });
      
      console.log("Voice-to-text response:", { data, error });
      
      if (error) {
        throw new Error(error.message || 'Failed to convert speech to text');
      }
      
      // If no text was returned (usually means silence or very short audio)
      if (!data?.text || data.text.trim() === "") {
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
  }, [continuousListening, isListening, startListening, onTranscriptComplete, toast]);
  
  // Function to speak text
  const speakText = useCallback(async (text: string) => {
    if (!text) return;
    
    try {
      setIsSpeaking(true);
      console.log("Speaking text:", text.substring(0, 50) + "...");
      
      // Store that we should resume listening after speaking
      if (autoResumeListening && isListening) {
        shouldResumeRef.current = true;
        stopListening();
      }
      
      // Send text to the text-to-speech edge function
      const { data, error } = await supabase.functions.invoke('ai-text-to-voice', {
        body: { 
          text, 
          voice: voiceSettings.voice 
        }
      });
      
      if (error) {
        throw new Error(error.message || 'Failed to generate speech');
      }
      
      if (!data?.audioContent) {
        throw new Error('No audio content returned');
      }
      
      // Play the returned audio
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Convert base64 to array buffer
      const base64 = data.audioContent;
      const binaryString = window.atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Decode audio data and play
      const audioBuffer = await audioContext.decodeAudioData(bytes.buffer);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      
      // Set up events
      source.onended = () => {
        console.log("Speech playback ended");
        setIsSpeaking(false);
        
        // Resume listening if needed
        if (autoResumeListening && shouldResumeRef.current) {
          console.log("Auto-resuming listening after speaking");
          shouldResumeRef.current = false;
          setTimeout(() => {
            startListening();
          }, 300);
        }
      };
      
      // Start playback
      source.start();
      
    } catch (e) {
      console.error("Error speaking text:", e);
      setIsSpeaking(false);
      toast({
        title: "Text-to-Speech Error",
        description: e instanceof Error ? e.message : "Failed to generate speech",
        variant: "destructive"
      });
    }
  }, [voiceSettings.voice, autoResumeListening, isListening, stopListening, startListening, toast]);
  
  // Function to stop speaking
  const stopSpeaking = useCallback(() => {
    // Can't directly stop the audio context, but we can set the state
    setIsSpeaking(false);
    shouldResumeRef.current = false;
    
    // Attempt to resume listening if that was the previous state
    if (autoResumeListening && !isListening) {
      startListening();
    }
  }, [autoResumeListening, isListening, startListening]);
  
  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.stop();
        } catch (e) {
          console.error("Error stopping media recorder:", e);
        }
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
  
  return {
    isListening,
    startListening,
    stopListening,
    lastTranscript,
    temporaryTranscript,
    error,
    isProcessing,
    supportsVoice,
    isSpeaking,
    speakText,
    stopSpeaking,
    isSilent,
    averageVolume,
    apiKeyStatus,
    apiKeyErrorDetails,
    retryApiKeyValidation
  };
};
