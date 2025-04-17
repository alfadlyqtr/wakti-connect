
import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Camera, Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAudioLevelMonitor } from '@/hooks/ai/useAudioLevelMonitor';
import { VoiceButton } from '../chat/VoiceButton';

interface InputToolbarProps {
  isLoading?: boolean;
  isListening?: boolean;
  onVoiceToggle?: () => void;
  onFileSelected?: (file: File) => void;
  onImageCapture?: () => void;
  recordingDuration?: number;
}

export const InputToolbar: React.FC<InputToolbarProps> = ({
  isLoading = false,
  isListening = false,
  onVoiceToggle,
  onFileSelected,
  onImageCapture,
  recordingDuration = 0
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Use the hook for audio monitoring with increased sensitivity
  const { audioLevel } = useAudioLevelMonitor({
    isActive: isListening,
    sensitivity: 2.0 // Increase sensitivity for better visual feedback
  });
  
  // Reset completed state when recording starts
  useEffect(() => {
    if (isListening) {
      setIsCompleted(false);
    }
  }, [isListening]);
  
  // Set completed state briefly when recording stops
  useEffect(() => {
    if (!isListening && recordingDuration > 0) {
      setIsCompleted(true);
      
      // Reset after animation completes
      const timer = setTimeout(() => {
        setIsCompleted(false);
      }, 3000); // Increased time to show completion state
      
      return () => clearTimeout(timer);
    }
  }, [isListening, recordingDuration]);
  
  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onFileSelected) {
      onFileSelected(e.target.files[0]);
      // Clear value to allow selecting the same file again
      e.target.value = '';
    }
  };
  
  return (
    <div className="flex items-center gap-1 py-1">
      {/* Voice recorder button */}
      {onVoiceToggle && (
        <VoiceButton
          isListening={isListening}
          isLoading={isLoading}
          isDisabled={isLoading}
          audioLevel={audioLevel}
          onPress={onVoiceToggle}
          recordingDuration={recordingDuration}
          isCompleted={isCompleted}
        />
      )}
      
      {/* File upload button */}
      {onFileSelected && (
        <>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full"
            onClick={handleFileButtonClick}
            disabled={isLoading || isListening}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.md"
            onChange={handleFileChange}
          />
        </>
      )}
      
      {/* Camera button */}
      {onImageCapture && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full"
          onClick={onImageCapture}
          disabled={isLoading || isListening}
        >
          <Camera className="h-4 w-4" />
        </Button>
      )}
      
      {/* Recording status with improved visibility */}
      {isListening && (
        <div className="text-xs text-red-500 ml-1 flex items-center bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
          <span className="relative flex h-2 w-2 mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          Recording... (Click mic to stop)
        </div>
      )}
      
      {/* Completion status */}
      {isCompleted && !isListening && (
        <div className="text-xs text-green-600 ml-1 flex items-center bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
          <CheckCheck className="h-3 w-3 mr-1" />
          Processing complete
        </div>
      )}
    </div>
  );
};
