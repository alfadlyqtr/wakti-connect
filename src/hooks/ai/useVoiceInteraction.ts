
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
    
    return () => {
      // Cleanup
      if (audioRef.current) {
        audioRef.current.onended = null;
      }
    };
  }, []);

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
          
          // Convert to base64 for processing
          const base64Audio = await blobToBase64(audioBlob);
          
          // Call the voice-to-text function
          const response = await supabase.functions.invoke("ai-voice-to-text", {
            body: { audio: base64Audio }
          });
          
          if (response.error) {
            throw new Error(response.error.message || "Error processing speech");
          }
          
          const text = response.data.text || "";
          setLastTranscript(text);
          resolve(text);
          
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
  }, [toast]);

  // Convert text to speech
  const speakText = useCallback(async (text: string, options: { voice?: string; addToQueue?: boolean } = {}) => {
    try {
      const response = await supabase.functions.invoke("ai-text-to-voice", {
        body: { 
          text, 
          voice: options.voice || "alloy" 
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message || "Error generating speech");
      }
      
      const audioContent = response.data.audioContent;
      
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
        description: error instanceof Error ? error.message : "Failed to generate speech",
        variant: "destructive",
      });
      return false;
    }
  }, [isSpeaking, toast]);

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
    startListening,
    stopListening,
    speakText,
    stopSpeaking,
    clearTranscript
  };
};
