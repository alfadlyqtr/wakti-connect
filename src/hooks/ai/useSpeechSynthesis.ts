
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface SpeechSynthesisOptions {
  rate?: number;
  pitch?: number;
}

export function useSpeechSynthesis(options: SpeechSynthesisOptions = {}) {
  const [speaking, setSpeaking] = useState(false);
  const { toast } = useToast();
  
  // Check if speech synthesis is supported in the browser
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  
  // Since we're removing text-to-speech functionality, these are now stub functions
  // that inform the user that the feature has been disabled
  
  const speak = useCallback((text: string) => {
    if (!supported) return;
    
    // Show a notification that TTS has been disabled
    toast({
      title: "Text-to-Speech Disabled",
      description: "This feature has been temporarily disabled.",
      variant: "default"
    });
    
    return false;
  }, [supported, toast]);
  
  const cancel = useCallback(() => {
    if (!supported) return;
    setSpeaking(false);
  }, [supported]);
  
  return {
    speak,
    cancel,
    speaking,
    supported
  };
}
