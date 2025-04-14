
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
        // Append to existing text rather than replacing
        setInputMessage(prev => {
          const separator = prev && !prev.endsWith(' ') && !text.startsWith(' ') ? ' ' : '';
          return prev + separator + text;
        });
        setShowVoiceInput(false);
        onTranscriptComplete?.(text);
      }
    }
  });
  
  // Update input field with transcript in real-time
  useEffect(() => {
    if (transcript && isListening) {
      setInputMessage(prev => {
        const separator = prev && !prev.endsWith(' ') && !transcript.startsWith(' ') ? ' ' : '';
        return prev + separator + transcript;
      });
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
