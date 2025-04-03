
import { useState, useEffect, useCallback } from 'react';

interface SpeechSynthesisOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice;
}

export const useSpeechSynthesis = (options?: SpeechSynthesisOptions) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  
  // Initialize and check support
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSupported(true);
      
      // Get available voices
      const voicesChanged = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };
      
      // Chrome loads voices asynchronously
      window.speechSynthesis.onvoiceschanged = voicesChanged;
      voicesChanged();
      
      // Clean up
      return () => {
        window.speechSynthesis.cancel();
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);
  
  // Speak function
  const speak = useCallback((text: string, speakOptions?: SpeechSynthesisOptions) => {
    if (!supported) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply options
    const mergedOptions = { ...options, ...speakOptions };
    if (mergedOptions.rate) utterance.rate = mergedOptions.rate;
    if (mergedOptions.pitch) utterance.pitch = mergedOptions.pitch;
    if (mergedOptions.volume) utterance.volume = mergedOptions.volume;
    if (mergedOptions.voice) utterance.voice = mergedOptions.voice;
    
    // Set preferred voice if not specified
    if (!utterance.voice) {
      // Try to find a good English voice
      const preferredVoice = voices.find(voice => 
        voice.lang.includes('en') && voice.name.includes('Google') ||
        voice.name.includes('Samantha') ||
        voice.name.includes('Daniel')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
    }
    
    // Add event handlers
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    
    // Speak
    window.speechSynthesis.speak(utterance);
    
    return utterance;
  }, [supported, options, voices]);
  
  // Stop speaking
  const cancel = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);
  
  return {
    supported,
    voices,
    speak,
    cancel,
    speaking
  };
};
