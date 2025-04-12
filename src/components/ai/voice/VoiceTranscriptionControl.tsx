
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface VoiceTranscriptionControlProps {
  startRecording: () => void;
  stopRecording: () => void;
  isRecording: boolean;
  isProcessing: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const VoiceTranscriptionControl: React.FC<VoiceTranscriptionControlProps> = ({
  startRecording,
  stopRecording,
  isRecording,
  isProcessing,
  disabled = false,
  size = 'md',
  className
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
  
  const handleClick = () => {
    if (disabled) return;
    
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  return (
    <div className={cn("flex items-center", container, className)}>
      <motion.div
        initial={false}
        animate={isRecording ? { scale: [1, 1.05, 1] } : { scale: 1 }}
        transition={{ repeat: isRecording ? Infinity : 0, duration: 1.5 }}
        className="relative"
      >
        <Button
          type="button"
          size="icon"
          variant={isRecording ? "secondary" : "secondary"}
          className={cn(button, "rounded-full flex-shrink-0", 
            isRecording && "border-2 border-green-200 bg-green-50 hover:bg-green-100"
          )}
          onClick={handleClick}
          disabled={disabled || isProcessing}
        >
          {isProcessing ? (
            <Loader2 className={cn(icon, "animate-spin")} />
          ) : isRecording ? (
            <Check className={cn(icon, "text-green-600")} />
          ) : (
            <Mic className={icon} />
          )}
        </Button>
        
        {isRecording && (
          <motion.div
            className="absolute -inset-1 rounded-full border-2 border-green-400"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          />
        )}
      </motion.div>
    </div>
  );
};
