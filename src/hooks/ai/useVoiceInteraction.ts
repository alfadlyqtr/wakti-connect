
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

interface VoiceInteractionOptions {
  onTranscriptComplete?: (transcript: string) => void;
  continuousListening?: boolean;
  autoStopAfterSilence?: boolean;
  maxDuration?: number; // in seconds
}

export const useVoiceInteraction = (options: VoiceInteractionOptions = {}) => {
  const { 
    onTranscriptComplete, 
    continuousListening = false,
    autoStopAfterSilence = false, // Changed default to false
    maxDuration = 60 // 60 seconds max by default
  } = options;
  
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastTranscript, setLastTranscript] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Reference to the MediaRecorder and audio chunks
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  // Check if browser supports speech recognition
  const supportsVoice = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  
  const SpeechRecognition = typeof window !== 'undefined' 
    ? window.SpeechRecognition || (window as any).webkitSpeechRecognition 
    : null;
  
  let recognition: any = null;
  
  // Function to send audio data to ElevenLabs for processing
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
  
  // Attempt to process audio using OpenAI as a fallback
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
  
  // Process audio using browser's built-in speech recognition as last resort
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
  
  const startListening = useCallback(async () => {
    if (!supportsVoice) {
      setError(new Error('Speech recognition not supported'));
      return;
    }
    
    try {
      // Reset state
      setTranscript('');
      audioChunksRef.current = [];
      
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create MediaRecorder for audio capture
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.start(100); // Collect data every 100ms
      
      // Start the in-browser recognition
      recognition = new SpeechRecognition();
      recognition.continuous = continuousListening;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
        
        // Start duration timer
        setRecordingStartTime(Date.now());
        setRecordingDuration(0);
        
        const interval = setInterval(() => {
          const now = Date.now();
          const startTime = recordingStartTime || now;
          const duration = Math.floor((now - startTime) / 1000);
          
          setRecordingDuration(duration);
          
          // Auto-stop if reached max duration
          if (duration >= maxDuration) {
            stopListening();
          }
        }, 1000);
        
        setTimerInterval(interval);
      };
      
      recognition.onresult = (event: any) => {
        const currentTranscript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        
        setTranscript(currentTranscript);
      };
      
      recognition.onerror = (event: any) => {
        setError(new Error(event.error));
      };
      
      recognition.onend = () => {
        // Note: We don't stop listening here as we want manual control
        // The actual stop is handled in stopListening()
      };
      
      recognition.start();
      
      // Show visual feedback
      toast({
        title: "Voice Recording Active",
        description: "Recording for 60 seconds. Press the button again to stop.",
        duration: 3000,
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setIsListening(false);
    }
  }, [continuousListening, maxDuration, recordingStartTime, supportsVoice]);
  
  const stopListening = useCallback(async () => {
    // Clear any timers
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    if (recognition) {
      recognition.stop();
    }
    
    // Stop MediaRecorder and process audio
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        // Stop recording
        mediaRecorderRef.current.stop();
        
        // Stop all tracks in the stream
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        
        setIsListening(false);
        
        // Wait a moment for ondataavailable to fire
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Process audio if we have chunks
        if (audioChunksRef.current.length > 0) {
          try {
            setIsProcessing(true);
            
            // Create a blob from all chunks
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            
            // Convert to base64 for the edge function
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            
            reader.onloadend = async () => {
              try {
                // Extract base64 data
                const base64data = reader.result?.toString().split(',')[1];
                
                if (!base64data) {
                  throw new Error('Failed to convert audio to base64');
                }
                
                toast({
                  title: "Processing your speech",
                  description: "Converting your voice to text...",
                  duration: 5000,
                });
                
                // Process with fallbacks
                let finalTranscript = "";
                try {
                  // Try ElevenLabs first
                  finalTranscript = await processAudioWithElevenLabs(base64data);
                } catch (elevenLabsError) {
                  try {
                    // Try OpenAI as fallback
                    finalTranscript = await processAudioWithOpenAI(base64data);
                  } catch (openaiError) {
                    // Use browser as last resort or the existing transcript
                    finalTranscript = transcript || await processAudioWithBrowser();
                  }
                }
                
                if (finalTranscript) {
                  setTranscript(finalTranscript);
                  setLastTranscript(finalTranscript);
                  
                  if (onTranscriptComplete) {
                    onTranscriptComplete(finalTranscript);
                  }
                  
                  toast({
                    title: "Transcription complete",
                    description: "Your speech has been converted to text",
                    duration: 3000,
                  });
                } else {
                  throw new Error('No transcription generated');
                }
              } catch (err) {
                console.error('Transcription error:', err);
                
                // Use any existing transcript from browser recognition as fallback
                if (transcript && onTranscriptComplete) {
                  onTranscriptComplete(transcript);
                  setLastTranscript(transcript);
                } else {
                  toast({
                    title: "Transcription error",
                    description: "Could not transcribe audio. Please try again.",
                    variant: "destructive",
                    duration: 3000,
                  });
                }
              } finally {
                setIsProcessing(false);
              }
            };
          } catch (error) {
            console.error('Error processing audio:', error);
            setIsProcessing(false);
          }
        } else {
          // If no audio data was collected
          if (transcript && onTranscriptComplete) {
            onTranscriptComplete(transcript);
            setLastTranscript(transcript);
          }
        }
      } catch (err) {
        console.error('Error stopping recording:', err);
        setIsListening(false);
      }
    } else {
      setIsListening(false);
    }
  }, [timerInterval, transcript, onTranscriptComplete]);
  
  // Process audio with multiple fallback methods
  const processAudioWithFallbacks = async (audioData: string): Promise<string> => {
    try {
      // Try ElevenLabs first
      return await processAudioWithElevenLabs(audioData);
    } catch (elevenLabsError) {
      console.warn("ElevenLabs failed, trying OpenAI fallback...");
      toast({
        title: "Speech recognition fallback",
        description: "Using alternative service for voice recognition...",
        duration: 3000,
      });
      
      try {
        // Try OpenAI as fallback
        return await processAudioWithOpenAI(audioData);
      } catch (openaiError) {
        console.warn("OpenAI fallback failed, trying browser recognition...");
        toast({
          title: "Using browser recognition",
          description: "External services unavailable, using browser capabilities...",
          duration: 3000,
        });
        
        // Last resort: browser's built-in recognition
        return await processAudioWithBrowser();
      }
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognition) {
        recognition.stop();
      }
      
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      
      // Stop MediaRecorder if active
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [timerInterval]);
  
  return {
    isListening,
    transcript,
    lastTranscript,
    supportsVoice,
    error,
    isProcessing,
    startListening,
    stopListening,
    processAudioWithFallbacks,
    recordingDuration
  };
};
