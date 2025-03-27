
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const useVoiceInteraction = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
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
        
        // Convert Blob to base64
        const base64Audio = await blobToBase64(audioBlob);
        
        // Call the Supabase edge function to convert speech to text
        const { data, error } = await supabase.functions.invoke("ai-voice-to-text", {
          body: { audio: base64Audio }
        });
        
        if (error) {
          console.error("Voice-to-text error:", error);
          toast({
            title: "Voice Processing Failed",
            description: "Could not convert your speech to text. Please try again.",
            variant: "destructive",
          });
          setIsProcessing(false);
          return;
        }
        
        if (data.text) {
          setLastTranscript(data.text);
          console.log("Transcription:", data.text);
        } else if (data.error) {
          console.error("Voice-to-text API error:", data.error);
          toast({
            title: "Voice Processing Failed",
            description: data.error || "Could not convert your speech to text",
            variant: "destructive",
          });
        }
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

  // Text-to-speech function
  const speak = useCallback(async (text: string) => {
    if (isSpeaking) {
      stopSpeaking();
    }
    
    try {
      // Call the Supabase edge function to convert text to speech
      const { data, error } = await supabase.functions.invoke("ai-text-to-voice", {
        body: { text, voice: "nova" }
      });
      
      if (error) {
        console.error("Text-to-speech error:", error);
        toast({
          title: "Speech Generation Failed",
          description: "Could not generate speech from text. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      if (data.error) {
        console.error("Text-to-speech API error:", data.error);
        toast({
          title: "Speech Generation Failed",
          description: data.error || "Could not generate speech from text",
          variant: "destructive",
        });
        return;
      }
      
      // Convert base64 audio to ArrayBuffer
      const binaryString = atob(data.audioContent);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Create an AudioContext and play the audio
      const audioContext = new AudioContext();
      const audioBuffer = await audioContext.decodeAudioData(bytes.buffer);
      
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      
      // Set speaking state
      setIsSpeaking(true);
      
      // Handle when audio stops playing
      source.onended = () => {
        setIsSpeaking(false);
      };
      
      // Store reference to source for stopping
      (window as any).__audioSource = source;
      
      // Start playing
      source.start(0);
    } catch (error) {
      console.error("Error playing speech:", error);
      setIsSpeaking(false);
      toast({
        title: "Speech Playback Error",
        description: error instanceof Error ? error.message : "Failed to play speech",
        variant: "destructive",
      });
    }
  }, [isSpeaking]);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    try {
      if ((window as any).__audioSource) {
        (window as any).__audioSource.stop();
        delete (window as any).__audioSource;
      }
      setIsSpeaking(false);
    } catch (error) {
      console.error("Error stopping speech:", error);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Stop recording if component unmounts while recording
      if (recorder && recorder.state === "recording") {
        recorder.stop();
        recorder.stream.getTracks().forEach(track => track.stop());
      }
      
      // Stop speaking if component unmounts while speaking
      if (isSpeaking) {
        stopSpeaking();
      }
    };
  }, [recorder, isSpeaking, stopSpeaking]);

  return {
    isListening,
    isSpeaking,
    supportsVoice,
    lastTranscript,
    isProcessing,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    clearTranscript
  };
};
