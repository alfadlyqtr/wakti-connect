
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceTranscriptionControlProps {
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  processing: boolean;
  audioLevel: number;
  supported: boolean;
  disabled?: boolean;
  transcript?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const VoiceTranscriptionControl: React.FC<VoiceTranscriptionControlProps> = ({
  isListening,
  startListening,
  stopListening,
  processing,
  audioLevel,
  supported,
  disabled = false,
  transcript,
  size = 'md',
  className
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Size mappings
  const sizeMap = {
    sm: {
      button: 'h-8 w-8',
      icon: 'h-4 w-4',
      canvas: 'h-8',
      waveContainerClass: 'h-8 max-w-[100px]'
    },
    md: {
      button: 'h-10 w-10',
      icon: 'h-5 w-5',
      canvas: 'h-10',
      waveContainerClass: 'h-10 max-w-[150px]'
    },
    lg: {
      button: 'h-12 w-12',
      icon: 'h-6 w-6',
      canvas: 'h-12',
      waveContainerClass: 'h-12 max-w-[200px]'
    }
  };
  
  const { button, icon, canvas, waveContainerClass } = sizeMap[size];
  
  // Draw audio waveform
  useEffect(() => {
    if (!canvasRef.current || !isListening) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    const width = canvasRef.current.width;
    const height = canvasRef.current.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw visualized audio level as a wave
    const centerY = height / 2;
    const maxAmplitude = height / 3;
    const frequency = 0.05;
    const waves = 3;
    
    // Use audioLevel to determine wave amplitude
    const amplitude = audioLevel * maxAmplitude;
    
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    
    for (let x = 0; x < width; x++) {
      // Create multiple sine waves with different frequencies
      let y = centerY;
      for (let i = 1; i <= waves; i++) {
        y += Math.sin(x * frequency * i / waves + Date.now() * 0.002 * i) * amplitude / i;
      }
      
      ctx.lineTo(x, y);
    }
    
    ctx.strokeStyle = 'rgb(59 130 246)'; // Blue color
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Request next frame
    requestAnimationFrame(() => {});
  }, [isListening, audioLevel]);
  
  const handleStartListening = () => {
    if (!disabled && supported) {
      startListening();
    }
  };
  
  const handleStopListening = () => {
    stopListening();
  };
  
  if (!supported) {
    return null;
  }
  
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {isListening && (
        <div className={cn("relative overflow-hidden rounded-md bg-blue-50 border border-blue-200", waveContainerClass)}>
          <canvas 
            ref={canvasRef} 
            width={200} 
            height={40} 
            className={cn("w-full", canvas)}
          />
        </div>
      )}
      
      <Button
        type="button"
        size="icon"
        variant={isListening ? "destructive" : "secondary"}
        className={cn(button, "rounded-full flex-shrink-0", 
          isListening && "animate-pulse"
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
    </div>
  );
};
