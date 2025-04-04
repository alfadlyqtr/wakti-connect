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
  
  const voiceSettings = useVoiceSettings();
  const autoSilenceDetection = optionAutoSilenceDetection !== undefined 
    ? optionAutoSilenceDetection 
    : voiceSettings.autoSilenceDetection;
  
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
  const [canUseSpeechSynthesis, setCanUseSpeechSynthesis] = useState(false);
  const [openAIVoiceSupported, setOpenAIVoiceSupported] = useState(false);
  
  const { toast } = useToast();
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const silenceTimeoutRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const silenceStartTimeRef = useRef<number | null>(null);
  const shouldResumeRef = useRef(false);
  const apiTestInProgressRef = useRef(false);
  
  useEffect(() => {
    const checkSupport = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          console.log('Media devices API not supported in this browser');
          return false;
        }
        
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setSupportsVoice(true);
        
        if ('speechSynthesis' in window) {
          setCanUseSpeechSynthesis(true);
        }
        
        return true;
      } catch (err) {
        console.error('Error checking microphone access:', err);
        setSupportsVoice(false);
        return false;
      }
    };
    
    checkSupport();
  }, []);
  
  const checkApiKey = useCallback(async () => {
    if (apiTestInProgressRef.current) return null;
    
    try {
      apiTestInProgressRef.current = true;
      console.log("Checking OpenAI API key validation...");
      setApiKeyStatus('checking');
      
      const { data: textToVoiceData, error: textToVoiceError } = await supabase.functions.invoke('ai-text-to-voice', {
        body: { test: true }
      });
      
      console.log("Text-to-voice API key check response:", { data: textToVoiceData, error: textToVoiceError });
      
      const { data: voiceToTextData, error: voiceToTextError } = await supabase.functions.invoke('ai-voice-to-text', {
        body: { test: true }
      });
      
      console.log("Voice-to-text API key check response:", { data: voiceToTextData, error: voiceToTextError });
      
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
        setOpenAIVoiceSupported(false);
        return false;
      } else {
        console.log('OpenAI API key is valid for voice features');
        setApiKeyStatus('valid');
        setApiKeyErrorDetails(null);
        setOpenAIVoiceSupported(true);
        return true;
      }
    } catch (err) {
      console.error('Error checking OpenAI API key:', err);
      setApiKeyStatus('unknown');
      setApiKeyErrorDetails('Connection error');
      setOpenAIVoiceSupported(false);
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
  
  const retryApiKeyValidation = useCallback(async () => {
    const result = await checkApiKey();
    return result === true;
  }, [checkApiKey]);
  
  const calculateVolumeLevel = useCallback((audioData: Float32Array): number => {
    let sum = 0;
    for (let i = 0; i < audioData.length; i++) {
      sum += audioData[i] * audioData[i];
    }
    const rms = Math.sqrt(sum / audioData.length);
    const db = 20 * Math.log10(Math.max(rms, 0.0000001));
    return db;
  }, []);
  
  const setupVolumeMonitoring = useCallback((stream: MediaStream) => {
    if (!autoSilenceDetection) return null;
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      const analyser = audioContext.createAnalyser();
      analyserRef.current = analyser;
      analyser.fftSize = 1024;
      
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      
      const processor = audioContext.createScriptProcessor(2048, 1, 1);
      processor.connect(audioContext.destination);
      analyser.connect(processor);
      
      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const volume = calculateVolumeLevel(inputData);
        
        setAverageVolume(prev => prev * 0.8 + volume * 0.2);
        
        if (volume < silenceThreshold) {
          if (silenceStartTimeRef.current === null) {
            silenceStartTimeRef.current = Date.now();
          } else if (Date.now() - silenceStartTimeRef.current > silenceTime && !isSilent) {
            console.log("Silence detected for threshold period");
            setIsSilent(true);
            
            if (autoSilenceDetection && isListening && !isProcessing) {
              console.log("Auto-stopping listening due to silence");
              stopListening();
            }
          }
        } else {
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
      
      audioChunksRef.current = [];
      setTemporaryTranscript('');
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const cleanupVolumeMonitoring = setupVolumeMonitoring(stream);
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        try {
          console.log("Media recorder stopped, processing audio...");
          
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          
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
      
      mediaRecorder.start();
      setIsListening(true);
      setIsSilent(false);
      
      return () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          try {
            mediaRecorderRef.current.stop();
          } catch (e) {
            console.error("Error stopping media recorder during cleanup:", e);
          }
        }
        
        if (cleanupVolumeMonitoring) {
          cleanupVolumeMonitoring();
        }
        
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
  
  const stopListening = useCallback(() => {
    if (!isListening || !mediaRecorderRef.current) {
      console.log("Not listening or no media recorder, ignoring stop request");
      return;
    }
    
    try {
      console.log("Stopping listening...");
      
      if (mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      
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
  
  const processSpeech = useCallback(async (audioBlob: Blob) => {
    try {
      setIsProcessing(true);
      
      if (audioBlob.size <= 0) {
        console.warn("Empty audio blob received - ignoring");
        setIsProcessing(false);
        if (continuousListening && !isListening) {
          startListening();
        }
        return;
      }
      
      const reader = new FileReader();
      
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const base64 = reader.result as string;
          const base64Data = base64.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = () => {
          reject(new Error("Failed to read audio file"));
        };
      });
      
      reader.readAsDataURL(audioBlob);
      const base64Data = await base64Promise;
      
      console.log("Sending audio to voice-to-text function...");
      const { data, error } = await supabase.functions.invoke('ai-voice-to-text', {
        body: { audio: base64Data }
      });
      
      console.log("Voice-to-text response:", { data, error });
      
      if (error) {
        throw new Error(error.message || 'Failed to convert speech to text');
      }
      
      if (!data?.text || data.text.trim() === "") {
        console.log("No text was returned from voice-to-text function");
        
        if (continuousListening) {
          startListening();
        }
        return;
      }
      
      console.log("Received transcript:", data.text);
      
      setLastTranscript(data.text);
      setTemporaryTranscript('');
      
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
      if (continuousListening && !isListening) {
        setTimeout(startListening, 500);
      }
    }
  }, [continuousListening, isListening, startListening, onTranscriptComplete, toast]);
  
  const speakText = useCallback(async (text: string) => {
    if (!text) return;
    
    try {
      setIsSpeaking(true);
      console.log("Speaking text:", text.substring(0, 50) + "...");
      
      if (autoResumeListening && isListening) {
        shouldResumeRef.current = true;
        stopListening();
      }
      
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
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const base64 = data.audioContent;
      const binaryString = window.atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const audioBuffer = await audioContext.decodeAudioData(bytes.buffer);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      
      source.onended = () => {
        console.log("Speech playback ended");
        setIsSpeaking(false);
        
        if (autoResumeListening && shouldResumeRef.current) {
          console.log("Auto-resuming listening after speaking");
          shouldResumeRef.current = false;
          setTimeout(() => {
            startListening();
          }, 300);
        }
      };
      
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
  
  const stopSpeaking = useCallback(() => {
    setIsSpeaking(false);
    shouldResumeRef.current = false;
    
    if (autoResumeListening && !isListening) {
      startListening();
    }
  }, [autoResumeListening, isListening, startListening]);
  
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
    retryApiKeyValidation,
    canUseSpeechSynthesis,
    openAIVoiceSupported
  };
};
