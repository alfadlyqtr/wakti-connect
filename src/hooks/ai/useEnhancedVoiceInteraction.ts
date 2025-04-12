
import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface VoiceInteractionOptions {
  onTranscriptComplete?: (transcript: string) => void;
  language?: string;
  autoStop?: boolean;
  autoStopTimeout?: number;
}

export type VoiceRecordingState = 'idle' | 'recording' | 'processing' | 'completed' | 'error';

export const useEnhancedVoiceInteraction = (options: VoiceInteractionOptions = {}) => {
  const { 
    onTranscriptComplete, 
    language = 'en',
    autoStop = false,
    autoStopTimeout = 3000 // 3 seconds of silence by default
  } = options;
  
  const [recordingState, setRecordingState] = useState<VoiceRecordingState>('idle');
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const [editingTranscript, setEditingTranscript] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const silenceTimeoutRef = useRef<number | null>(null);
  const processingRef = useRef<boolean>(false);
  
  const { toast } = useToast();
  
  // Check if browser supports audio recording
  const supportsRecording = typeof navigator !== 'undefined' && 
    navigator.mediaDevices && 
    typeof navigator.mediaDevices.getUserMedia === 'function';
  
  const cleanupRecording = useCallback(() => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    
    if (mediaRecorderRef.current) {
      if (mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      mediaRecorderRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    audioChunksRef.current = [];
  }, []);
  
  const startRecording = useCallback(async () => {
    if (!supportsRecording) {
      setError(new Error('Your browser does not support audio recording'));
      return;
    }
    
    if (recordingState === 'recording' || recordingState === 'processing') {
      console.log('Already recording or processing');
      return;
    }
    
    try {
      setRecordingState('recording');
      setTranscript('');
      setError(null);
      
      // Reset recording data
      audioChunksRef.current = [];
      
      // Get audio stream
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      streamRef.current = stream;
      
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
        if (processingRef.current) return;
        processingRef.current = true;
        
        try {
          if (audioChunksRef.current.length === 0) {
            setRecordingState('idle');
            return;
          }
          
          setRecordingState('processing');
          
          // Create audio blob
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          
          // Process with Whisper API
          await processAudioWithWhisper(audioBlob);
          
        } catch (err) {
          console.error('Error processing audio:', err);
          setError(err instanceof Error ? err : new Error('Unknown error processing audio'));
          setRecordingState('error');
          toast({
            title: "Voice Recognition Error",
            description: err instanceof Error ? err.message : 'Failed to process voice recording',
            variant: "destructive"
          });
        } finally {
          processingRef.current = false;
          cleanupRecording();
        }
      };
      
      // Setup auto-stop detection if enabled
      if (autoStop) {
        setupSilenceDetection(stream);
      }
      
      // Start recording
      mediaRecorder.start(1000); // Collect data every second
      
    } catch (err) {
      console.error('Error starting recording:', err);
      setError(err instanceof Error ? err : new Error('Unknown error starting recording'));
      setRecordingState('error');
      cleanupRecording();
      
      toast({
        title: "Microphone Error",
        description: "Please check your microphone permissions and try again",
        variant: "destructive"
      });
    }
  }, [supportsRecording, recordingState, cleanupRecording, autoStop, toast]);
  
  const stopRecording = useCallback(() => {
    if (recordingState !== 'recording') return;
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    } else {
      cleanupRecording();
      setRecordingState('idle');
    }
  }, [recordingState, cleanupRecording]);
  
  const setupSilenceDetection = useCallback((stream: MediaStream) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);
      
      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 1024;
      
      microphone.connect(analyser);
      analyser.connect(javascriptNode);
      javascriptNode.connect(audioContext.destination);
      
      let silenceStart: number | null = null;
      
      javascriptNode.onaudioprocess = () => {
        const array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        const values = array.reduce((a, b) => a + b, 0);
        const average = values / array.length;
        
        // Check for silence (low volume)
        if (average < 10) { // Threshold for silence
          if (!silenceStart) {
            silenceStart = Date.now();
          } else if (Date.now() - silenceStart > autoStopTimeout) {
            // Stop after silence threshold reached
            if (silenceTimeoutRef.current) {
              clearTimeout(silenceTimeoutRef.current);
            }
            
            silenceTimeoutRef.current = window.setTimeout(() => {
              if (recordingState === 'recording') {
                stopRecording();
              }
            }, 500);
          }
        } else {
          silenceStart = null;
          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
            silenceTimeoutRef.current = null;
          }
        }
      };
      
      return () => {
        javascriptNode.disconnect();
        analyser.disconnect();
        microphone.disconnect();
        if (audioContext.state !== 'closed') {
          audioContext.close();
        }
      };
    } catch (err) {
      console.error('Error setting up silence detection:', err);
      // Continue without silence detection
      return () => {};
    }
  }, [autoStopTimeout, recordingState, stopRecording]);
  
  const processAudioWithWhisper = async (audioBlob: Blob) => {
    try {
      // Convert blob to base64
      const base64Audio = await blobToBase64(audioBlob);
      
      if (!base64Audio) {
        throw new Error('Failed to convert audio to base64');
      }
      
      // Send to Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('ai-voice-to-text', {
        body: { 
          audio: base64Audio,
          language
        }
      });
      
      if (error) {
        throw new Error(`API Error: ${error.message}`);
      }
      
      if (!data.text) {
        throw new Error('No transcript returned');
      }
      
      setTranscript(data.text);
      setRecordingState('completed');
      setEditingTranscript(true);
      
      if (onTranscriptComplete) {
        onTranscriptComplete(data.text);
      }
      
    } catch (err) {
      console.error('Whisper API error:', err);
      throw err;
    }
  };
  
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result && typeof reader.result === 'string') {
          const base64String = reader.result.split(',')[1];
          resolve(base64String);
        } else {
          reject(new Error('Failed to convert blob to base64'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };
  
  const acceptTranscript = useCallback(() => {
    setEditingTranscript(false);
    setRecordingState('idle');
    
    if (onTranscriptComplete) {
      onTranscriptComplete(transcript);
    }
  }, [transcript, onTranscriptComplete]);
  
  const updateTranscript = useCallback((newTranscript: string) => {
    setTranscript(newTranscript);
  }, []);
  
  const cancelTranscript = useCallback(() => {
    setTranscript('');
    setEditingTranscript(false);
    setRecordingState('idle');
  }, []);
  
  const retryRecording = useCallback(() => {
    setTranscript('');
    setEditingTranscript(false);
    setRecordingState('idle');
    setError(null);
    startRecording();
  }, [startRecording]);
  
  return {
    recordingState,
    transcript,
    error,
    editingTranscript,
    supportsRecording,
    startRecording,
    stopRecording,
    updateTranscript,
    acceptTranscript,
    cancelTranscript,
    retryRecording
  };
};
