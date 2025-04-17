
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface VoiceRecordingVisualizerProps {
  isActive: boolean;
  audioLevel?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export const VoiceRecordingVisualizer: React.FC<VoiceRecordingVisualizerProps> = ({
  isActive,
  audioLevel = 0.5, // Default level
  size = 'md'
}) => {
  const getBarCount = (size: string) => {
    switch (size) {
      case 'xs': return 5;
      case 'sm': return 10;
      case 'md': return 15;
      case 'lg': return 20;
      default: return 15;
    }
  };
  
  const barCount = getBarCount(size);
  
  const renderBars = () => {
    const bars = [];
    const baseHeight = size === 'xs' ? 10 : size === 'sm' ? 12 : size === 'md' ? 16 : 20;
    
    for (let i = 0; i < barCount; i++) {
      // Calculate a sine-wave based height modifier
      const position = i / barCount;
      const sineWave = Math.sin(position * Math.PI);
      
      // Add randomness factor when active
      const randomFactor = isActive ? Math.random() * 0.5 : 0;
      
      // Combine factors for final height
      const heightFactor = isActive 
        ? 0.4 + (sineWave * 0.3) + (randomFactor * audioLevel) + (audioLevel * 0.7)
        : 0.2 + (sineWave * 0.1);
      
      const height = Math.max(2, Math.round(baseHeight * heightFactor));
      
      bars.push(
        <div
          key={i}
          className={cn(
            "w-0.5 sm:w-1 mx-px rounded-full bg-current transition-all duration-100",
            isActive ? "bg-red-500" : "bg-gray-400"
          )}
          style={{
            height: `${height}px`,
            opacity: isActive ? (0.5 + heightFactor * 0.5) : 0.5
          }}
        />
      );
    }
    return bars;
  };
  
  return (
    <div className={cn(
      "flex items-center justify-center space-x-[1px] sm:space-x-0.5",
      size === 'xs' ? "h-3" : 
      size === 'sm' ? "h-4" : 
      size === 'md' ? "h-5" : 
      "h-6"
    )}>
      {renderBars()}
    </div>
  );
};
