
import React, { useState } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { VoiceRecordingVisualizer } from '../voice/VoiceRecordingVisualizer';

interface VoiceButtonProps {
  isListening: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  audioLevel?: number;
  onPress: () => void;
  className?: string;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  isListening,
  isLoading = false,
  isDisabled = false,
  audioLevel = 0.2,
  onPress,
  className
}) => {
  return (
    <div className="relative inline-flex items-center">
      <Button
        type="button"
        variant={isListening ? "destructive" : "ghost"}
        size="icon"
        className={cn("h-9 w-9 rounded-full relative", className)}
        onClick={onPress}
        disabled={isDisabled || isLoading}
        aria-label={isListening ? "Stop recording" : "Start voice recording"}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isListening ? (
          <MicOff className="h-4 w-4" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
        
        {isListening && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}
      </Button>
      
      {isListening && (
        <div className="absolute top-10 left-0 z-10">
          <VoiceRecordingVisualizer 
            isActive={isListening}
            audioLevel={audioLevel}
            size="sm"
          />
        </div>
      )}
    </div>
  );
};
