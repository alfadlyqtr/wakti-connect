
import { useState, useEffect } from 'react';

interface VoiceInteractionOptions {
  onTranscriptComplete?: (transcript: string) => void;
}

export const useVoiceInteraction = (options?: VoiceInteractionOptions) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  // Check if the browser supports speech recognition
  const supportsVoice = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  
  const startListening = () => {
    if (!supportsVoice) return;
    
    setIsListening(true);
    setTranscript('');
    
    // In a real app, this would initialize the browser's SpeechRecognition API
    // For now, we'll simulate transcription after a short delay
    setTimeout(() => {
      const simulatedText = "This is a simulated voice transcript.";
      setTranscript(simulatedText);
      
      if (options?.onTranscriptComplete) {
        options.onTranscriptComplete(simulatedText);
      }
      
      setIsListening(false);
    }, 2000);
  };
  
  const stopListening = () => {
    setIsListening(false);
  };
  
  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    supportsVoice
  };
};
