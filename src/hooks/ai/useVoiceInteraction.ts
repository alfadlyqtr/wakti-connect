
import { useState, useCallback, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useVoiceInteraction = () => {
  const [isListening, setIsListening] = useState(false);
  const [supportsVoice, setSupportsVoice] = useState(false);
  const [lastTranscript, setLastTranscript] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioQueue, setAudioQueue] = useState<string[]>([]);
  const [openAIVoiceSupported, setOpenAIVoiceSupported] = useState<boolean | null>(null);
  const [apiKeyStatus, setApiKeyStatus] = useState<'untested' | 'valid' | 'invalid' | 'error'>('untested');
  const [apiKeyErrorDetails, setApiKeyErrorDetails] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  // Check if browser supports Speech Recognition
  useEffect(() => {
    const checkVoiceSupport = () => {
      const supportsMediaDevices = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      setSupportsVoice(supportsMediaDevices);
    };
    
    checkVoiceSupport();
    
    // Initialize audio element
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.onended = () => {
        setIsSpeaking(false);
        // Play next audio in queue if any
        if (audioQueue.length > 0) {
          const nextAudio = audioQueue[0];
          setAudioQueue(prevQueue => prevQueue.slice(1));
          playAudio(nextAudio);
        }
      };
    }

    // Check if OpenAI voice functions are configured
    const checkOpenAIConfig = async () => {
      try {
        console.log("Testing OpenAI API key for voice functionality...");
        
        // First, try the voice-to-text endpoint
        const testResponse = await supabase.functions.invoke("ai-voice-to-text", {
          body: { test: true }
        });
        
        if (testResponse.error) {
          console.warn("OpenAI voice features API key test failed:", testResponse.error);
          setOpenAIVoiceSupported(false);
          setApiKeyStatus('invalid');
          setApiKeyErrorDetails(testResponse.error.message || "OpenAI API key validation failed");
          throw new Error(testResponse.error.message || "OpenAI API key validation failed");
        }
        
        // If that succeeds, try the text-to-voice endpoint
        const ttsTestResponse = await supabase.functions.invoke("ai-text-to-voice", {
          body: { test: true }
        });
        
        if (ttsTestResponse.error) {
          console.warn("OpenAI text-to-speech API key test failed:", ttsTestResponse.error);
          setOpenAIVoiceSupported(false);
          setApiKeyStatus('invalid');
          setApiKeyErrorDetails(ttsTestResponse.error.message || "OpenAI API key validation failed for text-to-speech");
          throw new Error(ttsTestResponse.error.message || "OpenAI API key validation failed for text-to-speech");
        }
        
        // Both tests passed
        console.log("OpenAI voice features API key validated successfully");
        setOpenAIVoiceSupported(true);
        setApiKeyStatus('valid');
        setApiKeyErrorDetails(null);
      } catch (error) {
        console.warn("OpenAI voice features unavailable:", error);
        setOpenAIVoiceSupported(false);
        setApiKeyStatus('error');
        setApiKeyErrorDetails(error instanceof Error ? error.message : "Unknown error validating OpenAI API key");
        
        // Display toast notification only once
        toast({
          title: "Voice Features Unavailable",
          description: "OpenAI API key verification failed. Voice features will be limited.",
          variant: "destructive",
        });
      }
    };
    
    // Run the API key check
    checkOpenAIConfig();
    
    return () => {
      // Cleanup
      if (audioRef.current) {
        audioRef.current.onended = null;
      }
    };
  }, [toast]);

  // Process audio queue
  useEffect(() => {
    if (!isSpeaking && audioQueue.length > 0) {
      const audio = audioQueue[0];
      setAudioQueue(prevQueue => prevQueue.slice(1));
      playAudio(audio);
    }
  }, [isSpeaking, audioQueue]);

  // Convert speech to text
  const startListening = useCallback(async () => {
    if (!supportsVoice) {
      toast({
        title: "Voice Input Not Supported",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Reset state
      audioChunksRef.current = [];
      setLastTranscript("");
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create a new MediaRecorder instance
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      // Add event listeners
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      // Start recording
      mediaRecorder.start();
      setIsListening(true);
      
      toast({
        title: "Listening...",
        description: "Speak clearly into your microphone.",
      });
    } catch (error) {
      console.error("Error starting voice recording:", error);
      toast({
        title: "Voice Input Error",
        description: error instanceof Error ? error.message : "Could not access microphone",
        variant: "destructive",
      });
    }
  }, [supportsVoice, toast]);

  // Stop listening and process the audio
  const stopListening = useCallback(async () => {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === "inactive") {
      return "";
    }
    
    setIsListening(false);
    setIsProcessing(true);
    
    // Stop the recorder
    mediaRecorderRef.current.stop();
    
    // Process the recorded audio after a short delay to ensure all data is collected
    return new Promise<string>((resolve, reject) => {
      setTimeout(async () => {
        try {
          // Create a blob from the audio chunks
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          
          // Try OpenAI transcription if available
          if (openAIVoiceSupported) {
            try {
              // Convert to base64 for processing
              const base64Audio = await blobToBase64(audioBlob);
              
              // Call the voice-to-text function
              const response = await supabase.functions.invoke("ai-voice-to-text", {
                body: { audio: base64Audio }
              });
              
              if (response.error) {
                console.warn("OpenAI transcription failed, falling back to browser:", response.error);
                setApiKeyStatus('error');
                setApiKeyErrorDetails(response.error.message);
                setOpenAIVoiceSupported(false);
                throw new Error(response.error.message || "Error processing speech");
              }
              
              const text = response.data.text || "";
              setLastTranscript(text);
              resolve(text);
              return;
            } catch (error) {
              console.warn("OpenAI transcription failed, falling back to browser:", error);
              setOpenAIVoiceSupported(false);
              // Continue to browser-based transcription as fallback
            }
          }
          
          // If OpenAI transcription is not available or failed, fall back to browser-based transcription
          // Note: This would require implementing a browser-based speech recognition as fallback
          // For now, just show a message that OpenAI transcription failed
          toast({
            title: "Voice Processing",
            description: "OpenAI voice processing is currently unavailable.",
          });
          
          setLastTranscript("Voice processing unavailable. Please ensure OpenAI API key is set in Supabase secrets.");
          resolve("");
          
        } catch (error) {
          console.error("Error processing voice:", error);
          toast({
            title: "Voice Processing Error",
            description: error instanceof Error ? error.message : "An error occurred while processing your voice",
            variant: "destructive",
          });
          reject(error);
        } finally {
          setIsProcessing(false);
          
          // Stop all audio tracks in the stream
          if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            mediaRecorderRef.current = null;
          }
        }
      }, 500);
    });
  }, [toast, openAIVoiceSupported]);

  // Convert text to speech
  const speakText = useCallback(async (text: string, options: { voice?: string; addToQueue?: boolean } = {}) => {
    try {
      // First check if OpenAI voice is supported
      if (!openAIVoiceSupported) {
        // If OpenAI voice is explicitly not supported (not null), show a toast
        if (openAIVoiceSupported === false) {
          toast({
            title: "Text-to-Speech Unavailable",
            description: "OpenAI API key required for voice features.",
            variant: "destructive",
          });
          return false;
        }
      }

      console.log("Attempting to generate speech with text:", text.substring(0, 30) + "...");
      
      const response = await supabase.functions.invoke("ai-text-to-voice", {
        body: { 
          text, 
          voice: options.voice || "alloy" 
        }
      });
      
      if (response.error) {
        console.error("Text-to-voice error:", response.error);
        
        // Update our state to reflect the API key issue
        setOpenAIVoiceSupported(false);
        setApiKeyStatus('error');
        setApiKeyErrorDetails(response.error.message);
        
        throw new Error(response.error.message || "Error generating speech");
      }
      
      const audioContent = response.data.audioContent;
      
      if (!audioContent) {
        throw new Error("No audio content returned from the API");
      }
      
      if (options.addToQueue || isSpeaking) {
        // Add to queue if already speaking or requested to queue
        setAudioQueue(prevQueue => [...prevQueue, audioContent]);
      } else {
        // Play immediately
        playAudio(audioContent);
      }
      
      return true;
    } catch (error) {
      console.error("Error generating speech:", error);
      toast({
        title: "Text-to-Speech Error",
        description: "OpenAI API key required for voice features.",
        variant: "destructive",
      });
      return false;
    }
  }, [isSpeaking, toast, openAIVoiceSupported]);

  // Play audio from base64
  const playAudio = useCallback((base64Audio: string) => {
    if (!audioRef.current) return;
    
    try {
      // Convert base64 to blob URL
      const byteCharacters = atob(base64Audio);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'audio/mp3' });
      const url = URL.createObjectURL(blob);
      
      // Set the source and play
      audioRef.current.src = url;
      audioRef.current.play()
        .then(() => {
          setIsSpeaking(true);
        })
        .catch(err => {
          console.error("Error playing audio:", err);
          setIsSpeaking(false);
        });
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsSpeaking(false);
    }
  }, []);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (!audioRef.current) return;
    
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsSpeaking(false);
    setAudioQueue([]);
  }, []);

  // Convert blob to base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          // Remove the data URL prefix (e.g., "data:audio/webm;base64,")
          const base64 = reader.result.split(",")[1];
          resolve(base64);
        } else {
          reject(new Error("Failed to convert blob to base64"));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Clear the transcript
  const clearTranscript = useCallback(() => {
    setLastTranscript("");
  }, []);

  // Retry OpenAI API key validation
  const retryApiKeyValidation = useCallback(async () => {
    setApiKeyStatus('untested');
    setApiKeyErrorDetails(null);
    
    try {
      console.log("Retrying OpenAI API key validation...");
      
      // Try both endpoints
      const [sttResponse, ttsResponse] = await Promise.all([
        supabase.functions.invoke("ai-voice-to-text", { body: { test: true } }),
        supabase.functions.invoke("ai-text-to-voice", { body: { test: true } })
      ]);
      
      if (sttResponse.error || ttsResponse.error) {
        const errorMsg = sttResponse.error?.message || ttsResponse.error?.message || "API key validation failed";
        setApiKeyStatus('invalid');
        setApiKeyErrorDetails(errorMsg);
        setOpenAIVoiceSupported(false);
        
        toast({
          title: "API Key Validation Failed",
          description: errorMsg,
          variant: "destructive",
        });
        
        return false;
      }
      
      // Both tests passed
      setApiKeyStatus('valid');
      setApiKeyErrorDetails(null);
      setOpenAIVoiceSupported(true);
      
      toast({
        title: "API Key Validation Successful",
        description: "OpenAI voice features are now available.",
      });
      
      return true;
    } catch (error) {
      console.error("Error validating API key:", error);
      
      setApiKeyStatus('error');
      setApiKeyErrorDetails(error instanceof Error ? error.message : "Unknown error");
      setOpenAIVoiceSupported(false);
      
      toast({
        title: "API Key Validation Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      
      return false;
    }
  }, [toast]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Stop recording if component unmounts while recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      
      // Stop any playing audio
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return {
    isListening,
    supportsVoice,
    lastTranscript,
    isProcessing,
    isSpeaking,
    openAIVoiceSupported,
    apiKeyStatus,
    apiKeyErrorDetails,
    startListening,
    stopListening,
    speakText,
    stopSpeaking,
    clearTranscript,
    retryApiKeyValidation
  };
};
