
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { VoiceRecordingVisualizer } from './VoiceRecordingVisualizer';

interface VoiceTranscriptionControlProps {
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  confirmTranscript?: () => void;
  processing: boolean;
  audioLevel: number;
  supported: boolean;
  disabled?: boolean;
  transcript?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showConfirmButton?: boolean;
}

export const VoiceTranscriptionControl: React.FC<VoiceTranscriptionControlProps> = ({
  isListening,
  startListening,
  stopListening,
  confirmTranscript,
  processing,
  audioLevel,
  supported,
  disabled = false,
  transcript,
  size = 'md',
  className,
  showConfirmButton = false
}) => {
  // Size mappings
  const sizeMap = {
    sm: {
      button: 'h-8 w-8',
      icon: 'h-4 w-4',
      container: 'space-x-1'
    },
    md: {
      button: 'h-10 w-10',
      icon: 'h-5 w-5',
      container: 'space-x-2'
    },
    lg: {
      button: 'h-12 w-12',
      icon: 'h-6 w-6',
      container: 'space-x-3'
    }
  };
  
  const { button, icon, container } = sizeMap[size];
  
  const handleStartListening = () => {
    if (!disabled && supported) {
      startListening();
    }
  };
  
  const handleStopListening = () => {
    console.log("VoiceTranscriptionControl: stopping listening");
    stopListening();
  };
  
  if (!supported) {
    return null;
  }
  
  return (
    <div className={cn("flex items-center", container, className)}>
      {isListening && (
        <VoiceRecordingVisualizer 
          isActive={isListening}
          audioLevel={audioLevel}
          size={size}
        />
      )}
      
      <motion.div
        initial={false}
        animate={isListening ? { scale: [1, 1.05, 1] } : { scale: 1 }}
        transition={{ repeat: isListening ? Infinity : 0, duration: 1.5 }}
        className="relative"
      >
        <Button
          type="button"
          size="icon"
          variant={isListening ? "destructive" : "secondary"}
          className={cn(button, "rounded-full flex-shrink-0", 
            isListening && "border-4 border-red-200"
          )}
          onClick={isListening ? handleStopListening : handleStartListening}
          disabled={disabled || processing}
        >
          {processing ? (
            <Loader2 className={cn(icon, "animate-spin")} />
          ) : isListening ? (
            <MicOff className={icon} />
          ) : (
            <Mic className={icon} />
          )}
        </Button>
        
        {isListening && (
          <motion.div
            className="absolute -inset-1 rounded-full border-2 border-red-400"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          />
        )}
      </motion.div>
      
      {showConfirmButton && transcript && !isListening && !processing && (
        <Button
          type="button"
          size="icon"
          variant="success"
          className={button}
          onClick={confirmTranscript}
        >
          <Check className={icon} />
        </Button>
      )}
    </div>
  );
};
