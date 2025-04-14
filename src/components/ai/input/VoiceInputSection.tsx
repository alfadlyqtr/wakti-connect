
import React from 'react';

interface VoiceInputSectionProps {
  showVoiceInput: boolean;
  isListening: boolean;
  transcript: string;
  setInputMessage: (message: string) => void;
}

export const VoiceInputSection = ({ 
  showVoiceInput, 
  isListening, 
  transcript, 
  setInputMessage 
}: VoiceInputSectionProps) => {
  if (!showVoiceInput) return <div className="text-xs text-muted-foreground"></div>;
  
  return (
    <div className="text-xs text-muted-foreground">
      {showVoiceInput && isListening && (
        <span className="text-pink-600 font-medium animate-pulse">
          Listening... {transcript ? `"${transcript}"` : ""}
        </span>
      )}
    </div>
  );
};
