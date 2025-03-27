import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const useVoiceInteraction = () => {
  const [isListening, setIsListening] = useState(false);
  const [supportsVoice, setSupportsVoice] = useState(false);
  const [lastTranscript, setLastTranscript] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  // Check if browser supports Speech Recognition
  useEffect(() => {
    const checkVoiceSupport = () => {
      const supportsMediaDevices = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      setSupportsVoice(supportsMediaDevices);
    };
    
    checkVoiceSupport();
  }, []);

  // Start listening using MediaRecorder
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
      setAudioChunks([]);
      setLastTranscript("");
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create a new MediaRecorder instance
      const mediaRecorder = new MediaRecorder(stream);
      setRecorder(mediaRecorder);
      
      // Add event listeners
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((chunks) => [...chunks, event.data]);
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
  }, [supportsVoice]);

  // Stop listening and process the audio
  const stopListening = useCallback(async () => {
    if (!recorder || recorder.state === "inactive") {
      return;
    }
    
    setIsListening(false);
    setIsProcessing(true);
    
    // Stop the recorder
    recorder.stop();
    
    // Process the recorded audio after a short delay to ensure all data is collected
    setTimeout(async () => {
      try {
        // Create a blob from the audio chunks
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        
        // Instead of sending to OpenAI for conversion, use a fallback browser-based solution
        // For demonstration, we'll use a simple message
        setLastTranscript("Voice input detected. Please type your question instead for now.");
        toast({
          title: "Voice Processing Limitation",
          description: "Voice-to-text with DeepSeek is currently being implemented. Please type your message for now.",
          variant: "default",
        });
      } catch (error) {
        console.error("Error processing voice:", error);
        toast({
          title: "Voice Processing Error",
          description: error instanceof Error ? error.message : "An error occurred while processing your voice",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
        
        // Stop all audio tracks in the stream
        recorder.stream.getTracks().forEach(track => track.stop());
        setRecorder(null);
      }
    }, 500);
  }, [recorder, audioChunks]);

  // Convert blob to base64 (keeping this utility function)
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Stop recording if component unmounts while recording
      if (recorder && recorder.state === "recording") {
        recorder.stop();
        recorder.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [recorder]);

  return {
    isListening,
    supportsVoice,
    lastTranscript,
    isProcessing,
    startListening,
    stopListening,
    clearTranscript
  };
};
