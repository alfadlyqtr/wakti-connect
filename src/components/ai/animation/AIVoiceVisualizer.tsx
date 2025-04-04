
import React from 'react';
import { cn } from '@/lib/utils';

interface AIVoiceVisualizerProps {
  isActive: boolean;
  isSpeaking?: boolean;
  className?: string;
}

export function AIVoiceVisualizer({ 
  isActive,
  isSpeaking = false,
  className
}: AIVoiceVisualizerProps) {
  // A simple voice visualizer component that shows when the system is listening or would be speaking
  // Since we removed text-to-speech, this is just a visual indicator
  return (
    <div className={cn('flex items-center justify-center gap-1', className)}>
      {/* Create simple bars that animate slightly differently */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-4 w-1 rounded-full bg-wakti-blue',
            isActive ? 'opacity-100' : 'opacity-30',
            isActive && isListening(i)
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: `${0.5 + Math.random() * 0.5}s`
          }}
        ></div>
      ))}
    </div>
  );
}

// Helper to determine if a bar should be "listening"
function isListening(index: number): string {
  const animations = [
    'animate-[height_0.5s_ease-in-out_infinite]',
    'animate-[height_0.6s_ease-in-out_infinite]',
    'animate-[height_0.7s_ease-in-out_infinite]',
    'animate-[height_0.5s_ease-in-out_infinite]',
    'animate-[height_0.6s_ease-in-out_infinite]'
  ];
  
  return animations[index % animations.length];
}
