
import React from 'react';
import { cn } from '@/lib/utils';

export interface VoiceRecordingVisualizerProps {
  isActive: boolean;
  audioLevel?: number;
}

export const AIVoiceVisualizer: React.FC<VoiceRecordingVisualizerProps> = ({ 
  isActive, 
  audioLevel = 50 
}) => {
  return (
    <div className={cn(
      "h-8 flex items-end justify-center gap-1",
      !isActive && "opacity-30"
    )}>
      {Array.from({ length: 9 }, (_, i) => (
        <div
          key={i}
          className={cn(
            "w-1 bg-wakti-blue rounded-full transition-all duration-150",
            isActive && "animate-pulse"
          )}
          style={{
            height: isActive 
              ? `${Math.max(3, Math.min(28, 12 + Math.sin(i * 0.8) * (audioLevel / 5)))}px` 
              : '3px',
            animationDelay: `${i * 100}ms`
          }}
        ></div>
      ))}
    </div>
  );
};
