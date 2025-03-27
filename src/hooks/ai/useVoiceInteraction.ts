
import { useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface VoiceInteractionState {
  isListening: boolean;
  isSpeaking: boolean;
  supportsVoice: boolean;
  lastTranscript: string;
}

export function useVoiceInteraction() {
  const [state, setState] = useState<VoiceInteractionState>({
    isListening: false,
    isSpeaking: false,
    supportsVoice: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
    lastTranscript: "",
  });
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element for playback
  if (typeof window !== 'undefined' && !audioRef.current) {
    audioRef.current = new Audio();
  }

  // Start recording for voice to text
  const startListening = useCallback(async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create new media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        if (audioChunksRef.current.length === 0) {
          setState(prev => ({ ...prev, isListening: false }));
          return;
        }
        
        try {
          // Create audio blob and convert to base64
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const reader = new FileReader();
          
          reader.onload = async () => {
            if (!reader.result) return;
            
            const base64data = (reader.result as string).split(',')[1];
            
            // Send to Supabase Edge Function
            const { data, error } = await supabase.functions.invoke("ai-voice-to-text", {
              body: { audio: base64data },
            });
            
            if (error) {
              console.error("Error in voice-to-text:", error);
              toast({
                title: "Voice Recognition Failed",
                description: "Could not process your speech. Please try again.",
                variant: "destructive",
              });
            } else if (data?.text) {
              setState(prev => ({ ...prev, lastTranscript: data.text }));
            }
            
            setState(prev => ({ ...prev, isListening: false }));
          };
          
          reader.readAsDataURL(audioBlob);
        } catch (err) {
          console.error("Error processing audio:", err);
          setState(prev => ({ ...prev, isListening: false }));
        }
      };
      
      // Start recording
      mediaRecorder.start();
      setState(prev => ({ ...prev, isListening: true }));
      
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast({
        title: "Microphone Access Denied",
        description: "Please allow microphone access to use voice features.",
        variant: "destructive",
      });
    }
  }, []);
  
  // Stop recording
  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current && state.isListening) {
      mediaRecorderRef.current.stop();
      // State will be updated in onstop handler
      
      // Stop all tracks in the stream
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    }
  }, [state.isListening]);
  
  // Convert text to speech
  const speak = useCallback(async (text: string) => {
    if (!text) return;
    
    try {
      setState(prev => ({ ...prev, isSpeaking: true }));
      
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke("ai-text-to-voice", {
        body: { text, voice: "nova" }, // Using "nova" voice for a professional sound
      });
      
      if (error) {
        console.error("Error in text-to-voice:", error);
        toast({
          title: "Speech Generation Failed",
          description: "Could not generate speech. Please try again.",
          variant: "destructive",
        });
        setState(prev => ({ ...prev, isSpeaking: false }));
        return;
      }
      
      if (data?.audioContent) {
        // Convert base64 to audio and play it
        const audioSrc = `data:audio/mp3;base64,${data.audioContent}`;
        
        if (audioRef.current) {
          audioRef.current.src = audioSrc;
          audioRef.current.onended = () => {
            setState(prev => ({ ...prev, isSpeaking: false }));
          };
          audioRef.current.onerror = () => {
            console.error("Error playing audio");
            setState(prev => ({ ...prev, isSpeaking: false }));
          };
          
          await audioRef.current.play();
        }
      } else {
        setState(prev => ({ ...prev, isSpeaking: false }));
      }
    } catch (err) {
      console.error("Error in speech synthesis:", err);
      setState(prev => ({ ...prev, isSpeaking: false }));
    }
  }, []);
  
  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setState(prev => ({ ...prev, isSpeaking: false }));
    }
  }, []);
  
  return {
    ...state,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    clearTranscript: () => setState(prev => ({ ...prev, lastTranscript: "" })),
  };
}
