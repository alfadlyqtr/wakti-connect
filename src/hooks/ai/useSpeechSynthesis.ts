
import { useState, useEffect, useCallback } from 'react';

export function useSpeechSynthesis() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  
  useEffect(() => {
    // Check if speech synthesis is supported in the browser
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSupported(true);
      
      // Get available voices
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        if (availableVoices.length > 0) {
          setVoices(availableVoices);
        }
      };
      
      // Load voices initially
      loadVoices();
      
      // Chrome loads voices asynchronously, so we need this event listener
      window.speechSynthesis.onvoiceschanged = loadVoices;
      
      // Cleanup
      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    } else {
      setSupported(false);
    }
  }, []);
  
  // Function to speak text
  const speak = useCallback((text: string, voiceName?: string, rate: number = 1, pitch: number = 1) => {
    if (!supported || !text) return;
    
    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice if specified
    if (voiceName && voices.length > 0) {
      const voice = voices.find(v => v.name === voiceName);
      if (voice) utterance.voice = voice;
    }
    
    // Set other properties
    utterance.rate = rate;
    utterance.pitch = pitch;
    
    // Set listeners
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    
    // Speak
    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    window.speechSynthesis.speak(utterance);
  }, [supported, voices]);
  
  // Function to stop speaking
  const cancel = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);
  
  return {
    speak,
    cancel,
    speaking,
    supported,
    voices
  };
}
