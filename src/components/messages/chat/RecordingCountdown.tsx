
import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface RecordingCountdownProps {
  maxDuration: number; // in seconds
  isRecording: boolean;
  onTimeUp?: () => void;
}

const RecordingCountdown: React.FC<RecordingCountdownProps> = ({
  maxDuration,
  isRecording,
  onTimeUp
}) => {
  const [remainingTime, setRemainingTime] = useState(maxDuration);
  
  useEffect(() => {
    if (!isRecording) {
      setRemainingTime(maxDuration);
      return;
    }
    
    setRemainingTime(maxDuration);
    
    const timer = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onTimeUp) onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isRecording, maxDuration, onTimeUp]);
  
  if (!isRecording) return null;
  
  // Calculate progress percentage
  const progress = (remainingTime / maxDuration) * 100;
  
  return (
    <div className="flex items-center gap-2 bg-rose-50 px-3 py-1.5 rounded-md text-rose-700 text-xs animate-pulse">
      <Clock className="h-3.5 w-3.5" />
      <div className="flex-1">
        <div className="flex justify-between mb-1">
          <span>Recording...</span>
          <span>{remainingTime}s left</span>
        </div>
        <div className="w-full bg-rose-200 rounded-full h-1.5">
          <div 
            className="bg-rose-500 h-1.5 rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default RecordingCountdown;
