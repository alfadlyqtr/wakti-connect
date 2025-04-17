
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface VoiceRecordingVisualizerProps {
  isActive: boolean;
  audioLevel: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const VoiceRecordingVisualizer: React.FC<VoiceRecordingVisualizerProps> = ({
  isActive,
  audioLevel,
  className,
  size = 'md'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const offsetRef = useRef<number>(0);
  
  const sizeMap = {
    sm: { canvas: 'h-8 w-32', container: 'p-1.5' },
    md: { canvas: 'h-10 w-40', container: 'p-2' },
    lg: { canvas: 'h-12 w-48', container: 'p-3' }
  };
  
  // Draw waveform visualization with animation
  useEffect(() => {
    if (!canvasRef.current || !isActive) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Animation function for the waveform
    const animateWaveform = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw visualized audio level as a dynamic waveform
      const centerY = canvas.height / 2;
      const maxAmplitude = canvas.height / 2.5;
      
      // Use audioLevel (0-1) to determine wave amplitude, ensure minimum visibility
      const amplitude = Math.max(0.15, audioLevel) * maxAmplitude;
      
      // Set line style
      ctx.lineWidth = 2;
      ctx.strokeStyle = isActive ? 'rgb(239, 68, 68)' : 'rgb(59, 130, 246)'; // Red when active, blue otherwise
      
      // Update offset for animation
      offsetRef.current += 0.05;
      
      // Draw multiple waves with different frequencies for a rich visualization
      const drawWave = (frequency: number, amplitude: number, offset: number) => {
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        
        for (let x = 0; x < canvas.width; x++) {
          const y = centerY + 
            Math.sin((x * frequency + offset + offsetRef.current) / 20) * amplitude;
          ctx.lineTo(x, y);
        }
        
        ctx.stroke();
      };
      
      // Draw multiple waves with slight variations
      drawWave(0.5, amplitude * 1.0, 0);
      drawWave(0.7, amplitude * 0.7, 2);
      drawWave(0.3, amplitude * 0.5, 4);
      
      // Request next frame for animation
      if (isActive) {
        animationRef.current = requestAnimationFrame(animateWaveform);
      }
    };
    
    // Start the animation
    animateWaveform();
    
    // Clean up animation frame on unmount or when inactive
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isActive, audioLevel]);
  
  if (!isActive) return null;
  
  return (
    <div className={cn(
      "relative rounded-md bg-red-50 border border-red-200 overflow-hidden",
      sizeMap[size].container,
      className
    )}>
      <canvas 
        ref={canvasRef} 
        className={cn("w-full", sizeMap[size].canvas)}
        width={200} 
        height={50}
      />
      <motion.div 
        className="absolute inset-0 bg-red-400/10"
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      />
    </div>
  );
};
