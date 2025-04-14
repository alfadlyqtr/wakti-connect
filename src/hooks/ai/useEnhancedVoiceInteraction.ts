
import { useState, useCallback, useEffect } from 'react';
import { useVoiceInteraction } from '@/hooks/ai/useVoiceInteraction';

interface UseEnhancedVoiceInteractionProps {
  onTranscriptUpdate?: (text: string) => void;
  onTranscriptComplete?: (text: string) => void;
  setInputMessage: (text: string) => void;
}

export const useEnhancedVoiceInteraction = ({
  onTranscriptUpdate,
  onTranscriptComplete,
  setInputMessage
}: UseEnhancedVoiceInteractionProps) => {
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening,
    supportsVoice
  } = useVoiceInteraction({
    onTranscriptComplete: (text) => {
      if (text) {
        // Create a new string rather than using a function
        const currentInput = document.querySelector('textarea')?.value || '';
        const separator = currentInput && !currentInput.endsWith(' ') && !text.startsWith(' ') ? ' ' : '';
        const newValue = currentInput + separator + text;
        
        setInputMessage(newValue);
        setShowVoiceInput(false);
        onTranscriptComplete?.(text);
      }
    }
  });
  
  // Update input field with transcript in real-time
  useEffect(() => {
    if (transcript && isListening) {
      // Create a new string rather than using a function
      const currentInput = document.querySelector('textarea')?.value || '';
      const separator = currentInput && !currentInput.endsWith(' ') && !transcript.startsWith(' ') ? ' ' : '';
      const newValue = currentInput + separator + transcript;
      
      setInputMessage(newValue);
      onTranscriptUpdate?.(transcript);
    }
  }, [transcript, isListening, setInputMessage, onTranscriptUpdate]);
  
  const handleVoiceToggle = useCallback(() => {
    if (isListening) {
      stopListening();
      setShowVoiceInput(false);
    } else {
      startListening();
      setShowVoiceInput(true);
    }
  }, [isListening, startListening, stopListening]);
  
  return {
    isListening,
    transcript,
    showVoiceInput,
    setShowVoiceInput,
    handleVoiceToggle,
    supportsVoice
  };
};
