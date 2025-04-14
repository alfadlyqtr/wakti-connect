
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Paperclip, Mic, MicOff } from 'lucide-react';
import { useVoiceInteraction } from '@/hooks/ai/useVoiceInteraction';

interface InputToolbarProps {
  isLoading: boolean;
  isListening: boolean;
  onVoiceToggle: () => void;
}

export const InputToolbar = ({ isLoading, isListening, onVoiceToggle }: InputToolbarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { supportsVoice } = useVoiceInteraction({
    onTranscriptComplete: () => {}
  });
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // In a real implementation, you'd process the file and send it to the AI
    console.log('File to process:', files[0]);
    
    // Reset the input
    e.target.value = '';
  };
  
  const handleCameraCapture = () => {
    // This would open the camera in a real implementation
    console.log('Opening camera');
  };

  return (
    <div className="absolute right-2 bottom-2 flex items-center gap-1">
      {/* Camera button */}
      <Button
        type="button"
        size="icon"
        variant="ghost"
        onClick={handleCameraCapture}
        disabled={isLoading || isListening}
        className="h-8 w-8 rounded-full"
      >
        <Camera className="h-4 w-4" />
        <span className="sr-only">Take a photo</span>
      </Button>
      
      {/* File upload button */}
      <Button
        type="button"
        size="icon"
        variant="ghost"
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading || isListening}
        className="h-8 w-8 rounded-full"
      >
        <Paperclip className="h-4 w-4" />
        <span className="sr-only">Upload a file</span>
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
      />
      
      {/* Voice input button */}
      {supportsVoice && (
        <Button
          type="button"
          size="icon"
          variant={isListening ? "destructive" : "ghost"}
          onClick={onVoiceToggle}
          className="h-8 w-8 rounded-full"
        >
          {isListening ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
          <span className="sr-only">
            {isListening ? "Stop recording" : "Start recording"}
          </span>
        </Button>
      )}
    </div>
  );
};
