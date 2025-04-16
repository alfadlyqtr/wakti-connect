
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSwipe } from '@/hooks/useSwipe';
import { platformHapticFeedback } from '@/utils/hapticFeedback';

interface SwipeToActionProps {
  onComplete: () => void;
  onCancel?: () => void;
  completeLabel?: string;
  cancelLabel?: string;
  className?: string;
  completeIcon?: React.ReactNode;
  cancelIcon?: React.ReactNode;
  swipeThreshold?: number;
}

export const SwipeToAction: React.FC<SwipeToActionProps> = ({
  onComplete,
  onCancel,
  completeLabel = "Swipe to complete",
  cancelLabel = "Cancel",
  className,
  completeIcon = <Check className="h-4 w-4" />,
  cancelIcon = <X className="h-4 w-4" />,
  swipeThreshold = 0.75
}) => {
  const [swipePercent, setSwipePercent] = useState(0);
  const [touchActive, setTouchActive] = useState(false);
  
  // Calculate if threshold has been met
  const thresholdMet = swipePercent >= swipeThreshold;
  
  // Handle touch events manually for precise control
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchActive(true);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchActive) return;
    
    const touch = e.touches[0];
    const container = e.currentTarget.getBoundingClientRect();
    
    // Calculate how far across the container the touch is (0 to 1)
    const newPercent = Math.max(0, Math.min(1, 
      (touch.clientX - container.left) / container.width
    ));
    
    setSwipePercent(newPercent);
    
    // Provide subtle haptic feedback at intervals
    if (newPercent > 0.25 && swipePercent <= 0.25) {
      platformHapticFeedback('selection');
    } else if (newPercent > 0.5 && swipePercent <= 0.5) {
      platformHapticFeedback('selection');
    } else if (newPercent > 0.75 && swipePercent <= 0.75) {
      platformHapticFeedback('selection');
    } else if (newPercent >= 0.98 && swipePercent < 0.98) {
      platformHapticFeedback('success');
    }
  };
  
  const handleTouchEnd = () => {
    setTouchActive(false);
    
    if (thresholdMet) {
      // Complete action if threshold met
      onComplete();
    } else {
      // Reset to starting position
      setSwipePercent(0);
    }
  };
  
  return (
    <div className={cn("relative w-full", className)}>
      {/* Background track */}
      <div 
        className="h-12 bg-muted rounded-full relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Progress fill */}
        <motion.div 
          className="absolute top-0 left-0 h-full bg-primary/20"
          style={{ width: `${swipePercent * 100}%` }}
        />
        
        {/* Sliding thumb */}
        <motion.div 
          className={cn(
            "absolute top-1 left-1 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-md",
            thresholdMet ? "bg-green-500" : "bg-primary"
          )}
          style={{ left: `calc(${swipePercent * 100}% - ${swipePercent * 40}px)` }}
        >
          {thresholdMet ? (
            completeIcon
          ) : (
            <ArrowRight className="h-5 w-5 text-white" />
          )}
        </motion.div>
        
        {/* Label - positioned to avoid the thumb */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium ml-12">
            {completeLabel}
          </span>
        </div>
      </div>
      
      {/* Cancel button */}
      {onCancel && (
        <button 
          className="mt-2 text-muted-foreground text-sm flex items-center justify-center mx-auto"
          onClick={() => {
            platformHapticFeedback('impact');
            onCancel();
          }}
        >
          {cancelIcon}
          <span className="ml-1">{cancelLabel}</span>
        </button>
      )}
    </div>
  );
};
