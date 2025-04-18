
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Language } from '@/store/voiceSettings';

interface VoiceInteractionOptions {
  onTranscriptComplete?: (transcript: string, audioData?: string) => void;
  continuousListening?: boolean;
  autoStopAfterSilence?: boolean;
  maxDuration?: number; // in seconds
  language?: Language;
}

export const useVoiceInteraction = (options: VoiceInteractionOptions = {}) => {
  const { 
    onTranscriptComplete, 
    continuousListening = false,
    autoStopAfterSilence = true,
    maxDuration = 60, // 60 seconds max by default
    language = 'en'
  } = options;
  
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastTranscript, setLastTranscript] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  
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
        body: { audio: audioData, language }
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
        body: { audio: audioData, language }
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
        
        // Set the language based on the parameter or default to English
        const langCode = language === 'auto' ? 'en-US' : 
                          language === 'en' ? 'en-US' :
                          language === 'ar' ? 'ar-SA' :
                          language === 'es' ? 'es-ES' :
                          language === 'fr' ? 'fr-FR' :
                          language === 'de' ? 'de-DE' : 'en-US';
                          
        recognition.lang = langCode;
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
  
  // Function to start audio capture using MediaRecorder
  const startAudioCapture = () => {
    if (typeof window === 'undefined' || !window.MediaRecorder) {
      setError(new Error('MediaRecorder not supported'));
      return null;
    }
    
    try {
      let chunks: BlobPart[] = [];
      let mediaRecorder: MediaRecorder | null = null;
      
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          mediaRecorder = new MediaRecorder(stream);
          
          mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
              chunks.push(e.data);
            }
          };
          
          mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'audio/webm' });
            chunks = [];
            
            // Convert blob to base64
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64data = reader.result as string;
              // Remove the base64 data prefix (e.g., "data:audio/webm;base64,")
              const base64Audio = base64data.split(',')[1];
              setAudioBase64(base64Audio);
              
              if (onTranscriptComplete) {
                // Send both transcript and audio data
                onTranscriptComplete(transcript, base64Audio);
              }
            };
            reader.readAsDataURL(blob);
          };
          
          mediaRecorder.start();
        })
        .catch(err => {
          setError(new Error(`Media access error: ${err.message}`));
        });
      
      return mediaRecorder;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown media error'));
      return null;
    }
  };
  
  const startListening = useCallback(() => {
    if (!supportsVoice) {
      setError(new Error('Speech recognition not supported'));
      return;
    }
    
    try {
      recognition = new SpeechRecognition();
      recognition.continuous = continuousListening;
      recognition.interimResults = true;
      
      // Set the language based on the parameter or default to English
      const langCode = language === 'auto' ? 'en-US' : 
                        language === 'en' ? 'en-US' :
                        language === 'ar' ? 'ar-SA' :
                        language === 'es' ? 'es-ES' :
                        language === 'fr' ? 'fr-FR' :
                        language === 'de' ? 'de-DE' : 'en-US';
                        
      recognition.lang = langCode;
      
      // Also start audio capture for later processing
      const mediaRecorder = startAudioCapture();
      
      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
        
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
            if (mediaRecorder) {
              mediaRecorder.stop();
            }
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
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
        
        // Clear timer
        if (timerInterval) {
          clearInterval(timerInterval);
          setTimerInterval(null);
        }
        
        if (mediaRecorder) {
          mediaRecorder.stop();
        }
      };
      
      recognition.start();
      
      // Show visual feedback
      toast({
        title: "Voice Recognition Active",
        description: "Speak clearly, then pause when you're done.",
        duration: 3000,
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setIsListening(false);
    }
  }, [continuousListening, maxDuration, recordingStartTime, timerInterval, language]);
  
  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
    }
    
    // Clear timer
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    setIsListening(false);
  }, [timerInterval]);
  
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
    recordingDuration,
    audioBase64
  };
};
