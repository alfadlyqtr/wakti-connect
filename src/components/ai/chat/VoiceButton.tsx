
import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2, CheckCheck } from 'lucide-react';
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
  recordingDuration?: number;
  isCompleted?: boolean;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  isListening,
  isLoading = false,
  isDisabled = false,
  audioLevel = 0.5, // Increased default level for better visibility
  onPress,
  className,
  recordingDuration = 0,
  isCompleted = false
}) => {
  const [timeLeft, setTimeLeft] = useState(60);
  
  // Reset timer when recording starts
  useEffect(() => {
    if (isListening) {
      setTimeLeft(60);
    }
  }, [isListening]);
  
  // Update countdown when recording is in progress
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (isListening && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isListening, timeLeft]);
  
  // Set timer based on the duration from props
  useEffect(() => {
    if (isListening && recordingDuration) {
      setTimeLeft(Math.max(0, 60 - recordingDuration));
    }
  }, [isListening, recordingDuration]);
  
  return (
    <div className="relative inline-flex items-center">
      <Button
        type="button"
        variant={isListening ? "destructive" : isCompleted ? "outline" : "ghost"}
        size="icon"
        className={cn("h-9 w-9 rounded-full relative transition-colors duration-300", 
          isListening ? "bg-red-500 hover:bg-red-600" : 
          isCompleted ? "bg-green-100 text-green-700 border-green-300 hover:bg-green-200" : "",
          className
        )}
        onClick={onPress}
        disabled={isDisabled || isLoading}
        aria-label={isListening ? "Stop recording" : "Start voice recording"}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isCompleted ? (
          <CheckCheck className="h-4 w-4" />
        ) : isListening ? (
          <MicOff className="h-4 w-4 text-white" />
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
        <>
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-10">
            <VoiceRecordingVisualizer 
              isActive={isListening}
              audioLevel={audioLevel}
              size="sm"
            />
          </div>
          
          {/* Countdown timer */}
          <div className="absolute top-1 -right-8 text-xs font-medium bg-red-100 text-red-800 rounded-full px-1.5 py-0.5 min-w-[36px] text-center">
            {timeLeft}s
          </div>
        </>
      )}
      
      {isCompleted && (
        <div className="absolute top-10 left-0 z-10 bg-green-100 text-green-800 rounded-md px-2 py-1 text-xs whitespace-nowrap">
          Speech processed
        </div>
      )}
    </div>
  );
};
