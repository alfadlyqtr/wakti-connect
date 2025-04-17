
import React from 'react';
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
  const sizeMap = {
    sm: { container: 'p-1.5 gap-0.5', bar: 'h-4 w-1' },
    md: { container: 'p-2 gap-1', bar: 'h-6 w-1.5' },
    lg: { container: 'p-3 gap-1.5', bar: 'h-8 w-2' }
  };
  
  if (!isActive) return null;
  
  // Number of bars in the visualizer
  const bars = 5;
  
  return (
    <div className={cn(
      "rounded-md bg-red-50 border border-red-200 flex items-center justify-center",
      sizeMap[size].container,
      className
    )}>
      {Array.from({ length: bars }).map((_, i) => {
        // Calculate dynamic height based on position and audio level
        // Center bars are taller than edge bars
        const positionFactor = 1 - Math.abs((i - (bars - 1) / 2) / ((bars - 1) / 2));
        const heightFactor = 0.3 + (audioLevel * 0.7);
        const finalFactor = positionFactor * heightFactor;
        
        return (
          <motion.div
            key={i}
            className={cn(
              "bg-red-400 rounded-full",
              sizeMap[size].bar
            )}
            animate={{
              height: `${Math.max(20, finalFactor * 100)}%`,
              opacity: Math.max(0.5, finalFactor)
            }}
            transition={{
              duration: 0.2,
              ease: "easeInOut"
            }}
            style={{
              transformOrigin: "bottom"
            }}
          />
        );
      })}
    </div>
  );
};
