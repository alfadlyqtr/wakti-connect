
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface SpeechSynthesisOptions {
  voice?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export const useSpeechSynthesis = (options?: SpeechSynthesisOptions) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const { toast } = useToast();

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Check if browser supports speech synthesis
    if ('speechSynthesis' in window) {
      setSupported(true);
      
      // Get available voices
      const updateVoices = () => {
        setVoices(window.speechSynthesis.getVoices());
      };
      
      // Chrome loads voices asynchronously
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = updateVoices;
      }
      
      updateVoices();
    } else {
      console.warn('Speech synthesis not supported in this browser');
      setSupported(false);
    }
    
    // Cleanup on unmount
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Function to speak text
  const speak = useCallback((text: string) => {
    if (!supported || !text) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice if specified and available
    if (options?.voice && voices.length > 0) {
      const voice = voices.find(v => v.name === options.voice);
      if (voice) {
        utterance.voice = voice;
      }
    }
    
    // Set other speech properties
    utterance.rate = options?.rate || 1;
    utterance.pitch = options?.pitch || 1;
    utterance.volume = options?.volume || 1;
    
    // Set up event handlers
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setSpeaking(false);
      toast({
        title: "Error",
        description: "There was an error with speech synthesis.",
        variant: "destructive",
      });
    };
    
    // Start speaking
    window.speechSynthesis.speak(utterance);
  }, [supported, voices, options, toast]);

  // Function to stop speaking
  const cancel = useCallback(() => {
    if (!supported) return;
    
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  // Function to pause speaking
  const pause = useCallback(() => {
    if (!supported) return;
    
    window.speechSynthesis.pause();
  }, [supported]);

  // Function to resume speaking
  const resume = useCallback(() => {
    if (!supported) return;
    
    window.speechSynthesis.resume();
  }, [supported]);

  return {
    voices,
    speaking,
    supported,
    speak,
    cancel,
    pause,
    resume
  };
};
